"""
Job相关的FastAPI路由，包含任务创建、状态查询、任务列表接口
"""
from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.jobs.manager import JobManager
from app.jobs.worker import run_kg_job_sync
from app.jobs.schemas import JobCreate, JobRead
from app.models.job import Job
from app.models.file import File as FileORM

router = APIRouter()

@router.post("/jobs/", response_model=JobRead)
def create_job(
    job: JobCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    db_file = db.query(FileORM).filter(FileORM.id == job.file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")
    file_path = db_file.filepath
    job_obj = JobManager.create_job(db, input_file=file_path)
    background_tasks.add_task(run_kg_job_sync, job_obj.id, file_path)
    return job_obj

@router.get("/jobs/{job_id}", response_model=JobRead)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = JobManager.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/jobs/", response_model=list[JobRead])
def list_jobs(db: Session = Depends(get_db)):
    return JobManager.list_jobs(db)
