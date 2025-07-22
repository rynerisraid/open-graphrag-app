from fastapi import APIRouter, Depends, HTTPException
from app.models.job import Job
from app.config.db import get_async_db
from app.core.dependencies import get_current_user

import uuid


router = APIRouter(prefix="/jobs", tags=["jobs"])

from pydantic import BaseModel
from typing import Optional, Dict, Any

class JobCreate(BaseModel):
    pipeline_steps: Optional[Dict[str, Any]] = None

class JobRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    status: str
    pipeline_steps: Optional[Dict[str, Any]] = None
    created_at: str
    updated_at: str
    class Config:
        from_attributes = True

@router.post("/", response_model=JobRead)
async def create_job_api(
    job: JobCreate,
    current_user=Depends(get_current_user),
    session= Depends(get_async_db)
):

    db_job = Job(user_id=current_user.id, status="queued", pipeline_steps=job.pipeline_steps or {})
    session.add(db_job)
    await session.commit()
    await session.refresh(db_job)
    return db_job

@router.patch("/{job_id}")
async def update_job_status_api(
    job_id: uuid.UUID,
    status: str,
    pipeline_steps: Optional[Dict[str, Any]] = None,
    current_user=Depends(get_current_user),
    session= Depends(get_async_db)
):

    db_job = await session.get(Job, job_id)
    if not db_job or db_job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found or no permission")
    db_job.status = status
    if pipeline_steps is not None:
        db_job.pipeline_steps = pipeline_steps
    await session.commit()
    return {"ok": True}

@router.get("/{job_id}", response_model=JobRead)
async def get_job_api(
    job_id: uuid.UUID, 
    current_user=Depends(get_current_user),    
    session= Depends(get_async_db)):
    db_job = await session.get(Job, job_id)
    if not db_job or db_job.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Job not found or no permission")
    return db_job
