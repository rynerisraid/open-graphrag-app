"""
Job相关的Pydantic模型，用于API请求和响应
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobCreate(BaseModel):
    file_id: str  # 或UUID，视File表主键类型

class JobRead(BaseModel):
    id: int
    status: str
    input_file: str
    result: Optional[str] = None
    error_msg: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 