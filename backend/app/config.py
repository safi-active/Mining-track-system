from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:1234@127.0.0.1:3306/mining_db"
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    ADMIN_SIGNUP_CODE: str = "admin-setup-code"

    class Config:
        env_file = ".env"

settings = Settings()