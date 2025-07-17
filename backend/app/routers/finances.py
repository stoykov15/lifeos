from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.db.database import database
from app.db.models import finances as finances_table

router = APIRouter()

class Finance(BaseModel):
    id: int
    user_id: int
    type: str        # income | expense
    category: str
    amount: float
    note: Optional[str] = None
    timestamp: Optional[datetime] = None

class FinanceCreate(BaseModel):
    user_id: int
    type: str
    category: str
    amount: float
    note: Optional[str] = None

@router.get("/{user_id}", response_model=List[Finance])
async def get_user_finances(user_id: int):
    query = finances_table.select().where(finances_table.c.user_id == user_id)
    return await database.fetch_all(query)

@router.post("/", response_model=Finance)
async def add_finance(entry: FinanceCreate):
    now = datetime.utcnow()
    query = finances_table.insert().values(
        user_id=entry.user_id,
        type=entry.type,
        category=entry.category,
        amount=entry.amount,
        note=entry.note,
        timestamp=now
    )
    entry_id = await database.execute(query)
    return { "id": entry_id, "timestamp": now, **entry.dict() }

@router.delete("/{entry_id}")
async def delete_finance(entry_id: int):
    query = finances_table.delete().where(finances_table.c.id == entry_id)
    await database.execute(query)
    return { "message": "Entry deleted" }