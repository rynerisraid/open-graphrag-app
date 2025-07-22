from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    OPENAI_API_KEY: str
    OPENAI_API_BASE: str
    TEXT_EMBEDDING_MODEL: str
    TEXT_EMBEDDINE_BASE_URL: str
    TEXT_EMBEDDINE_API_KEY: str
    NEO4J_URI: str
    NEO4J_USER: str
    NEO4J_PASSWORD: str
    ROOT_DIR: str
    MAX_CONCURRENT_JOBS: int 
    # 例如: postgresql+psycopg2://user:password@localhost:5432/dbname
    DATABASE_URL: str
    ASYNC_DATABASE_URL:str

    class Config:
        env_file = ".env"

settings = Settings()