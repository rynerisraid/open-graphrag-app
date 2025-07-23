"""
Job ORM模型，包含任务状态、输入文件、结果、错误信息、时间戳等字段
"""
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.config.db import Base
from datetime import datetime

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String(32), index=True)
    input_file = Column(String(256))
    result = Column(Text, nullable=True)
    error_msg = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

