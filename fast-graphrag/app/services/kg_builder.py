"""
知识图谱构建服务模块：封装Neo4j GraphRAG的KG构建流程
"""
import asyncio
from neo4j import GraphDatabase
from neo4j_graphrag.kg_builder import SimpleKGPipeline
from app.config.db import graph_driver

async def run_kg_pipeline(input_file: str):
    # 这里假设input_file为本地文件路径
    # 具体schema、参数可根据实际需求调整
    pipeline = SimpleKGPipeline(
        driver=graph_driver,
        input_file=input_file,
        # 其他参数可根据需要补充
    )
    # 假设SimpleKGPipeline支持异步run
    result = await asyncio.to_thread(pipeline.run)
    return result 