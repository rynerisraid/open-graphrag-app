
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.config.db import get_db
from app.models.workspace import Workspace
from typing import List
from pydantic import BaseModel
import uuid
from app.core.dependencies import get_current_user
from datetime import datetime
from app.config import settings
import os

router = APIRouter(prefix="/workspace", tags=["workspace"])

class WorkspaceCreate(BaseModel):
    name: str
    description: str | None = None
    state: str | None = "A"

class WorkspaceRead(BaseModel):
    id: uuid.UUID
    name: str
    description: str | None = None
    state: str | None = None
    created_by: uuid.UUID | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

@router.post("/", response_model=WorkspaceRead)
async def create_workspace(
    workspace: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_workspace = Workspace(
        name=workspace.name,
        description=workspace.description,
        state=workspace.state,
        created_by=current_user.id
    )
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)

    # 根据Workspace初始化一个GraphRAG目录
    graph_rag_dir = os.path.join(settings.ROOT_DIR, str(db_workspace.id))
    graph_rag_dir = os.path.join(settings.ROOT_DIR, str(db_workspace.id))
    os.makedirs(graph_rag_dir, exist_ok=True)  # 确保目录被创建
    return db_workspace

@router.get("/", response_model=List[WorkspaceRead])
async def list_workspaces(
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return db.query(Workspace).filter(Workspace.created_by == current_user.id).offset(skip).limit(limit).all()

@router.get("/{workspace_id}", response_model=WorkspaceRead)
async def get_workspace(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    ws = db.query(Workspace).filter(Workspace.id == workspace_id, Workspace.created_by == current_user.id).first()
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return ws

@router.put("/{workspace_id}", response_model=WorkspaceRead)
async def update_workspace(
    workspace_id: uuid.UUID,
    workspace: WorkspaceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id, Workspace.created_by == current_user.id).first()
    if not db_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    for field, value in workspace.model_dump(exclude_unset=True).items():
        setattr(db_workspace, field, value)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_workspace = db.query(Workspace).filter(Workspace.id == workspace_id, Workspace.created_by == current_user.id).first()
    if not db_workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    db.delete(db_workspace)
    db.commit()
    return {"ok": True}
