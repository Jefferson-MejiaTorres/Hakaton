from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Nino(Base):
    """Modelo para información básica del niño"""
    __tablename__ = "ninos"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    sexo = Column(String(1), nullable=False)  # 'M' o 'F'
    documento_identidad = Column(String(20), unique=True, index=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    mediciones = relationship("MedicionAntropometrica", back_populates="nino", cascade="all, delete-orphan")
    historia_clinica = relationship("HistoriaClinica", back_populates="nino", uselist=False, cascade="all, delete-orphan")
    datos_sociodemograficos = relationship("DatosSociodemograficos", back_populates="nino", uselist=False, cascade="all, delete-orphan")
    predicciones = relationship("Prediccion", back_populates="nino", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Nino {self.nombre} {self.apellido}>"


class MedicionAntropometrica(Base):
    """Modelo para mediciones antropométricas"""
    __tablename__ = "mediciones_antropometricas"
    
    id = Column(Integer, primary_key=True, index=True)
    nino_id = Column(Integer, ForeignKey("ninos.id"), nullable=False)
    fecha_medicion = Column(Date, nullable=False)
    
    # Mediciones
    peso = Column(Float, nullable=False)  # kg
    talla = Column(Float, nullable=False)  # cm
    perimetro_braquial = Column(Float)  # cm
    peso_al_nacer = Column(Float)  # gramos (solo primera medición)
    
    # Indicadores calculados
    imc = Column(Float)  # kg/m²
    z_score_peso_edad = Column(Float)
    z_score_talla_edad = Column(Float)
    z_score_peso_talla = Column(Float)
    
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relación
    nino = relationship("Nino", back_populates="mediciones")
    
    def __repr__(self):
        return f"<MedicionAntropometrica {self.fecha_medicion} - Niño ID: {self.nino_id}>"


class HistoriaClinica(Base):
    """Modelo para historial clínico del niño"""
    __tablename__ = "historia_clinica"
    
    id = Column(Integer, primary_key=True, index=True)
    nino_id = Column(Integer, ForeignKey("ninos.id"), nullable=False, unique=True)
    
    # Historial de salud
    episodios_diarrea = Column(Integer, default=0)  # Últimos 6 meses
    infecciones_respiratorias = Column(Integer, default=0)  # Últimos 6 meses
    vacunacion_completa = Column(Boolean, default=False)
    enfermedades_cronicas = Column(String(200))  # Separadas por comas
    
    # Alimentación
    lactancia_materna = Column(String(20))  # 'exclusiva_6m', 'mixta', 'no_lacto'
    suplementacion_nutricional = Column(Boolean, default=False)
    
    # Notas adicionales
    observaciones = Column(Text)
    
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relación
    nino = relationship("Nino", back_populates="historia_clinica")
    
    def __repr__(self):
        return f"<HistoriaClinica Niño ID: {self.nino_id}>"


class DatosSociodemograficos(Base):
    """Modelo para datos socioeconómicos y demográficos"""
    __tablename__ = "datos_sociodemograficos"
    
    id = Column(Integer, primary_key=True, index=True)
    nino_id = Column(Integer, ForeignKey("ninos.id"), nullable=False, unique=True)
    
    # Educación de los padres
    nivel_educativo_madre = Column(String(20))  # 'ninguno', 'primaria', 'secundaria', 'tecnico', 'universitario'
    nivel_educativo_padre = Column(String(20))
    
    # Economía familiar
    ingreso_familiar_mensual = Column(Float)  # Pesos colombianos
    numero_hijos = Column(Integer)
    
    # Vivienda
    tipo_vivienda = Column(String(20))  # 'propia', 'arrendada', 'familiar', 'invasion'
    material_vivienda = Column(String(20))  # 'concreto', 'madera', 'lata', 'mixto'
    
    # Servicios públicos
    acceso_agua_potable = Column(Boolean, default=False)
    acceso_alcantarillado = Column(Boolean, default=False)
    
    # Ubicación
    zona_residencia = Column(String(10))  # 'urbana', 'rural'
    municipio = Column(String(50))
    
    fecha_actualizacion = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relación
    nino = relationship("Nino", back_populates="datos_sociodemograficos")
    
    def __repr__(self):
        return f"<DatosSociodemograficos Niño ID: {self.nino_id}>"


class Prediccion(Base):
    """Modelo para almacenar predicciones del sistema"""
    __tablename__ = "predicciones"
    
    id = Column(Integer, primary_key=True, index=True)
    nino_id = Column(Integer, ForeignKey("ninos.id"), nullable=False)
    fecha_prediccion = Column(DateTime(timezone=True), server_default=func.now())
    
    # Resultado de la predicción
    nivel_riesgo = Column(String(10))  # 'bajo', 'medio', 'alto'
    probabilidad = Column(Float)  # 0.0 - 1.0
    modelo_usado = Column(String(20))  # 'svm', 'random_forest', 'mlp'
    
    # Features usados (JSON como texto)
    features_json = Column(Text)
    
    # Relación
    nino = relationship("Nino", back_populates="predicciones")
    
    def __repr__(self):
        return f"<Prediccion {self.nivel_riesgo} - Niño ID: {self.nino_id}>"
