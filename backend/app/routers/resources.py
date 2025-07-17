from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.db.database import database
from app.db.models import resources as resources_table

router = APIRouter()

class Resource(BaseModel):
    id: int
    user_id: int
    label: str
    type: str               # article | book | tool
    url: str
    status: str             # to_read | reading | done

class ResourceCreate(BaseModel):
    user_id: int
    label: str
    type: str = "article"
    url: str
    status: str = "to_read"

@router.get("/{user_id}", response_model=List[Resource])
async def get_user_resources(user_id: int):
    query = resources_table.select().where(resources_table.c.user_id == user_id)
    return await database.fetch_all(query)

@router.post("/", response_model=Resource)
async def add_resource(resource: ResourceCreate):
    query = resources_table.insert().values(**resource.dict())
    resource_id = await database.execute(query)
    return { "id": resource_id, **resource.dict() }

@router.put("/{resource_id}", response_model=Resource)
async def update_resource(resource_id: int, resource: Resource):
    query = resources_table.update().where(resources_table.c.id == resource_id).values(**resource.dict())
    await database.execute(query)
    return resource

@router.delete("/{resource_id}")
async def delete_resource(resource_id: int):
    query = resources_table.delete().where(resources_table.c.id == resource_id)
    await database.execute(query)
    return { "message": "Resource deleted" }