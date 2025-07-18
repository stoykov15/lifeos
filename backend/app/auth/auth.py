from fastapi import APIRouter, HTTPException, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.db.database import database
from app.db.models import users
import os
from dotenv import load_dotenv
from app.schemas.auth import RegisterUser

load_dotenv()

# Config
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

# Init
router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Models
# class RegisterUser(BaseModel):
#     email: EmailStr
#     password: str = Field(..., min_length=6)
#     confirm_password: str = Field(..., min_length=6)

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

# Utility functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_user_by_email(email: str):
    query = users.select().where(users.c.email == email)
    return await database.fetch_one(query)

# Authenticated user dependency
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Routes

# Register
@router.post("/register")
async def register_user(data: RegisterUser = Body(...)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = await get_user_by_email(data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    query = users.insert().values(
        email=data.email,
        password=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        monthly_income=0.0,
        fixed_expenses={},
        currency="USD",
        setup_complete=False
    )
    user_id = await database.execute(query)
    return {"msg": "User created", "user_id": user_id}

# Login
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(data={"sub": user["email"]})
    return {"access_token": token, "token_type": "bearer"}

# Get current user
@router.get("/me")
async def get_profile(user=Depends(get_current_user)):
    return {
        "id": user["id"],
        "email": user["email"],
        "setup_complete": user["setup_complete"]
    }

# Change password
@router.post("/change-password")
async def change_password(data: PasswordChangeRequest, user=Depends(get_current_user)):
    if not verify_password(data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Incorrect current password")

    new_hashed = hash_password(data.new_password)
    query = users.update().where(users.c.id == user["id"]).values(password=new_hashed)
    await database.execute(query)

    return {"msg": "Password updated"}

# Delete account
@router.delete("/delete")
async def delete_account(user=Depends(get_current_user)):
    query = users.delete().where(users.c.id == user["id"])
    await database.execute(query)
    return {"msg": "Account deleted"}
