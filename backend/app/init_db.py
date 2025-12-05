"""
Script para inicializar la base de datos PostgreSQL
Crea todas las tablas definidas en los modelos SQLAlchemy
"""

from app.database import init_db, engine
from app.config import settings


def main():
    print("=" * 60)
    print("🚀 SIDI - Inicialización de Base de Datos")
    print("=" * 60)
    print(f"\n📊 Base de datos: {settings.DB_NAME}")
    print(f"🖥️  Host: {settings.DB_HOST}:{settings.DB_PORT}")
    print(f"👤 Usuario: {settings.DB_USER}\n")
    
    try:
        # Verificar conexión
        print("🔍 Verificando conexión a PostgreSQL...")
        connection = engine.connect()
        connection.close()
        print("✅ Conexión exitosa\n")
        
        # Crear tablas
        print("🏗️  Creando tablas...")
        init_db()
        print("\n" + "=" * 60)
        print("✨ ¡Base de datos inicializada correctamente!")
        print("=" * 60)
        print("\nTablas creadas:")
        print("  - ninos")
        print("  - mediciones_antropometricas")
        print("  - historia_clinica")
        print("  - datos_sociodemograficos")
        print("  - predicciones")
        print("\n✅ Listo para usar SIDI\n")
        
    except Exception as e:
        print("\n❌ Error al inicializar la base de datos:")
        print(f"   {str(e)}\n")
        print("💡 Verifica que:")
        print("   1. PostgreSQL esté ejecutándose")
        print("   2. Las credenciales en .env sean correctas")
        print("   3. La base de datos 'sidi_db' exista")
        print(f"   4. El usuario '{settings.DB_USER}' tenga permisos\n")
        return 1
    
    return 0


if __name__ == "__main__":
    exit(main())
