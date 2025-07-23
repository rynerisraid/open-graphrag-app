from fastapi import FastAPI
from app.router import auth as auth_router
from app.router import workspace as workspace_router
from app.router import file as file_router
from app.router import jobs as jobs_router
from typing import Union
from app.config.settings import settings
from app.config.db import engine,Base
# from app.models import auth, workspace, file, jobs
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator
from app.router import jobs, kg

@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    Base.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)


app.include_router(auth_router.router, prefix="/auth", tags=["auth"])
app.include_router(workspace_router.router) # prefix="/workspace", tags=["workspace"]
app.include_router(file_router.router) #  prefix="/file", tags=["file"]
app.include_router(jobs_router.router) #  prefix="/jobs", tags=["jobs"]
app.include_router(jobs.router)
app.include_router(kg.router)

@app.get("/")
def read_root():
    return {
        "Hello": "World",
        "env_test": {
            "OPENAI_API_BASE": settings.OPENAI_API_BASE[:5] + "..." if settings.OPENAI_API_BASE else None,
            "NEO4J_URI": settings.NEO4J_URI
        }
    }

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


