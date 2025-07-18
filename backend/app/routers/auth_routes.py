from fastapi import APIRouter, Depends
from app.auth.auth import get_current_user

router = APIRouter()

@router.get("/me")
async def get_my_profile(user=Depends(get_current_user)):
    return {
        "email": user["email"],
        "currency": user["currency"],
        "monthly_income": user["monthly_income"]
    }
