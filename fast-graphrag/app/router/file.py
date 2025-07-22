from fastapi import APIRouter, UploadFile, File as FastAPIFile, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.file import File as FileORM
from app.models.workspace import Workspace
from app.config.settings import settings
from app.core.dependencies import get_current_user
import uuid
import os
import shutil

router = APIRouter(prefix="/file", tags=["file"])

@router.post("/upload/{workspace_id}")
async def upload_file(
    workspace_id: uuid.UUID,
    upload_file: UploadFile = FastAPIFile(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 检查workspace归属
    ws = db.query(Workspace).filter(Workspace.id == workspace_id, Workspace.created_by == current_user.id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found or no permission")
    # 目标路径
    target_dir = os.path.join(settings.ROOT_DIR, str(workspace_id))
    os.makedirs(target_dir, exist_ok=True)
    file_path = os.path.join(target_dir, upload_file.filename)
    # 保存文件
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    # 记录到数据库
    db_file = FileORM(
        workspace_id=workspace_id,
        filename=upload_file.filename,
        filepath=file_path,
        uploaded_by=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return {"id": db_file.id, "filename": db_file.filename, "filepath": db_file.filepath}

@router.delete("/{file_id}")
async def delete_file(
    file_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_file = db.query(FileORM).filter(FileORM.id == file_id, FileORM.uploaded_by == current_user.id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found or no permission")
    # 删除物理文件
    if os.path.exists(db_file.filepath):
        os.remove(db_file.filepath)
    db.delete(db_file)
    db.commit()
    return {"ok": True}
