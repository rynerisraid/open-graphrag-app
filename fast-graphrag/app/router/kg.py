"""
知识图谱检索相关的FastAPI路由，提供Cypher查询接口
"""
from fastapi import APIRouter, Depends, Query
from app.config.db import graph_driver

router = APIRouter()

@router.get("/kg/search")
def search_kg(query: str = Query(..., description="Cypher查询语句")):
    with graph_driver.session() as session:
        result = session.run(query)
        records = [record.data() for record in result]
    return {"result": records} 