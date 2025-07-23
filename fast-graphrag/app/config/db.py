from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config.settings import settings
from neo4j import GraphDatabase

# Graph Database
graph_driver = GraphDatabase.driver(
    settings.NEO4J_URI, 
    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD))

# SQLAlchemy engine for PostgreSQL
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

async_engine = create_async_engine(settings.ASYNC_DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# FastAPI依赖注入数据库Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_async_db():
    async with AsyncSessionLocal() as db:
        yield db

Base = declarative_base()

