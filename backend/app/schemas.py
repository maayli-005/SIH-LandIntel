from pydantic import BaseModel, Field

class LandRecordBase(BaseModel):
    state: str = Field(..., min_length=2, max_length=50)
    district: str = Field(..., min_length=2, max_length=50)
    land_type: str = Field(..., min_length=2, max_length=30)
    area_hectares: float = Field(..., gt=0, description="Area must be greater than 0")
    dispute_status: str = Field(..., pattern="^(Clear|Disputed)$")
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

class LandRecordCreate(LandRecordBase):
    pass

class LandRecordOut(LandRecordBase):
    id: int
    class Config:
        from_attributes = True
class DistrictBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    state: str = Field(..., min_length=2, max_length=50)
    total_area_hectares: float = Field(..., gt=0)
    forest_area_hectares: float = Field(..., ge=0)
    population: int = Field(..., ge=0)

class DistrictCreate(DistrictBase):
    pass

class DistrictOut(DistrictBase):
    id: int
    class Config:
        from_attributes = True


class DisputeBase(BaseModel):
    land_record_id: int
    title: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=2, max_length=500)
    status: str = Field(..., pattern="^(Open|Resolved|Under Review)$")
    filed_date: str

class DisputeCreate(DisputeBase):
    pass

class DisputeOut(DisputeBase):
    id: int
    class Config:
        from_attributes = True