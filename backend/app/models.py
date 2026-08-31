from sqlalchemy import Column, Integer, String, Float, ForeignKey
from .database import Base

class LandRecord(Base):
    __tablename__ = "land_records"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String)
    district = Column(String)
    land_type = Column(String)      # agricultural, forest, urban, disputed
    area_hectares = Column(Float)
    dispute_status = Column(String) # "Disputed" ya "Clear"
    latitude = Column(Float)
    longitude = Column(Float)
class District(Base):
    __tablename__ = "districts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    state = Column(String)
    total_area_hectares = Column(Float)
    forest_area_hectares = Column(Float)
    population = Column(Integer)

class Dispute(Base):
    __tablename__ = "disputes"

    id = Column(Integer, primary_key=True, index=True)
    land_record_id = Column(Integer, ForeignKey("land_records.id"))
    title = Column(String)
    description = Column(String)
    status = Column(String)
    filed_date = Column(String)