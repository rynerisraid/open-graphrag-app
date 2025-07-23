"""
任务管理模块：负责Job的创建、状态更新和查询
"""
from app.models.job import Job
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

class JobManager:
    @staticmethod
    def create_job(db: Session, input_file: str) -> Job:
        job = Job(
            status="pending",
            input_file=input_file,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def update_status(db: Session, job_id: int, status: str, result: Optional[str]=None, error_msg: Optional[str]=None):
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job.status = status
            job.updated_at = datetime.utcnow()
            if result:
                job.result = result
            if error_msg:
                job.error_msg = error_msg
            db.commit()
            db.refresh(job)
        return job

    @staticmethod
    def get_job(db: Session, job_id: int) -> Optional[Job]:
        return db.query(Job).filter(Job.id == job_id).first()

    @staticmethod
    def list_jobs(db: Session):
        return db.query(Job).order_by(Job.created_at.desc()).all() 