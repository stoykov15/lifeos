from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel
from typing import Optional
from app.db.database import database
from app.db.models import users as users_table
from app.auth.auth import get_current_user

router = APIRouter()

# Use alias consistently
users = users_table

# Create user schema (optional, mostly used internally)
class UserCreate(BaseModel):
    email: str
    password: str
    monthly_income: Optional[float] = 0.0
    fixed_expenses: Optional[dict] = {}
    currency: Optional[str] = "USD"
    dark_mode: Optional[bool] = False
    goal: Optional[str] = None

# Response schema
class UserResponse(BaseModel):
    id: int
    email: str
    monthly_income: float
    fixed_expenses: dict
    currency: str
    dark_mode: bool
    goal: Optional[str] = None
    setup_complete: Optional[bool] = False

# Create user (not used by frontend directly)
@router.post("/", response_model=UserResponse)
async def create_user(user: UserCreate):
    query = users.insert().values(**user.dict())
    user_id = await database.execute(query)
    return { "id": user_id, **user.dict(), "setup_complete": False }

# ✅ Setup route used by UserSetup.jsx
@router.put("/setup")
async def update_user_setup(
    user=Depends(get_current_user),
    data: dict = Body(...)
):
    query = users.update().where(users.c.id == user["id"]).values(
        monthly_income=data.get("monthly_income"),
        goal=data.get("goal"),
        fixed_expenses=data.get("fixed_expenses") or {},
        setup_complete=True
    )
    await database.execute(query)
    return {"msg": "User setup updated"}

# Get user by ID (optional, used by admin or debug tools)
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    query = users.select().where(users.c.id == user_id)
    user = await database.fetch_one(query)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
