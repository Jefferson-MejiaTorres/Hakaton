from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Crear engine de SQLAlchemy
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # Verificar conexión antes de usar
    echo=settings.DEBUG   # Mostrar queries SQL en modo debug
)

# Crear SessionLocal para interactuar con la BD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos ORM
Base = declarative_base()


def get_db():
    """
    Dependency para obtener sesión de base de datos.
    Se usa en los endpoints de FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """
    Inicializa la base de datos creando todas las tablas.
    """
    from app.models import paciente  # Import aquí para evitar circular imports
    Base.metadata.create_all(bind=engine)
    print("✅ Base de datos inicializada correctamente")
