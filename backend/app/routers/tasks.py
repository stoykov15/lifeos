from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.db.database import database
from app.db.models import tasks as tasks_table

router = APIRouter()

class Task(BaseModel):
    id: int
    user_id: int
    title: str
    done: bool
    type: str  # work | personal
    priority: Optional[str] = "normal"
    due_date: Optional[str] = None

class TaskCreate(BaseModel):
    user_id: int
    title: str
    type: str = "personal"
    priority: Optional[str] = "normal"
    due_date: Optional[str] = None

@router.get("/{user_id}", response_model=List[Task])
async def get_user_tasks(user_id: int):
    query = tasks_table.select().where(tasks_table.c.user_id == user_id)
    return await database.fetch_all(query)

@router.post("/", response_model=Task)
async def create_task(task: TaskCreate):
    query = tasks_table.insert().values(
        user_id=task.user_id,
        title=task.title,
        type=task.type,
        priority=task.priority,
        done=False,
        due_date=task.due_date
    )
    task_id = await database.execute(query)
    return { "id": task_id, "done": False, **task.dict() }

@router.put("/{task_id}", response_model=Task)
async def update_task(task_id: int, task: Task):
    query = tasks_table.update().where(tasks_table.c.id == task_id).values(**task.dict())
    await database.execute(query)
    return task

@router.delete("/{task_id}")
async def delete_task(task_id: int):
    query = tasks_table.delete().where(tasks_table.c.id == task_id)
    await database.execute(query)
    return { "message": "Task deleted" }