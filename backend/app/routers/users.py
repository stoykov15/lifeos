from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.db.database import database
from app.db.models import users as users_table

router = APIRouter()

# Request model
class UserCreate(BaseModel):
    email: str
    password: str
    monthly_income: Optional[float] = 0.0
    fixed_expenses: Optional[dict] = {}
    currency: Optional[str] = "USD"
    dark_mode: Optional[bool] = False

# Response model
class UserResponse(BaseModel):
    id: int
    email: str
    monthly_income: float
    fixed_expenses: dict
    currency: str
    dark_mode: bool

@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    query = users_table.insert().values(**user.dict())
    user_id = await database.execute(query)
    return { "id": user_id, **user.dict() }

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    query = users_table.select().where(users_table.c.id == user_id)
    user = await database.fetch_one(query)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user