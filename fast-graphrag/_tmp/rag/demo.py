from pathlib import Path
from graphrag import index
import graphrag.api as api
from graphrag.config.load_config import load_config
from graphrag.index.typing.pipeline_run_result import PipelineRunResult
from graphrag.index.workflows.factory import PipelineFactory
from graphrag.config.enums import IndexingMethod
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

async def main():
    config = load_config(Path(__file__).parent / "settings.yaml")
    pipeline_factory = PipelineFactory(config)
    pipeline = pipeline_factory.create_pipeline(
        IndexingMethod.VECTOR_STORE,
        "default_chat_model",
        "default_embedding_model",
    )
    print(pipeline.names())
    index_result = await api.build_index(
        pipeline,
        "default_chat_model",
        "default_embedding_model",
    )
    print(index_result)
