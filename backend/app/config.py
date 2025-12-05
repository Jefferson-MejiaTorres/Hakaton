from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Configuración de la aplicación SIDI"""
    
    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "sidi_db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    
    # Application
    APP_NAME: str = "SIDI API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:8000"
    
    # Machine Learning
    ML_MODEL_PATH: str = "data/models/svm_model.pkl"
    SCALER_PATH: str = "data/models/scaler.pkl"
    
    @property
    def database_url(self) -> str:
        """Construye la URL de conexión a PostgreSQL"""
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convierte la cadena de orígenes CORS en lista"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instancia global de configuración
settings = Settings()
