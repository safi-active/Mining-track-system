from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:hmLTyCqOJhYwxasIPAijIQQAkGsIKYNV@acela.proxy.rlwy.net:13007/railway"
    SECRET_KEY: str = "minetrack-drc-secret-key-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = ".env"

settings = Settings()