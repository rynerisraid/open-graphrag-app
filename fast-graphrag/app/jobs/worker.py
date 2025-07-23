"""
异步任务worker模块：负责异步执行知识图谱构建任务，并更新Job状态
"""
import asyncio
from app.jobs.manager import JobManager
# from app.services.kg_builder import run_kg_pipeline
from app.config.db import get_db
from sqlalchemy.orm import Session

def run_kg_job_sync(job_id: int, input_file: str):
    # 同步包装，供BackgroundTasks调用
    asyncio.run(run_kg_job(job_id, input_file))

async def run_kg_job(job_id: int, input_file: str):
    db_gen = get_db()
    db: Session = next(db_gen)
    try:
        JobManager.update_status(db, job_id, "running")
        #result = await run_kg_pipeline(input_file)
        #JobManager.update_status(db, job_id, "success", result=result)
    except Exception as e:
        JobManager.update_status(db, job_id, "failed", error_msg=str(e))
    finally:
        db.close() 