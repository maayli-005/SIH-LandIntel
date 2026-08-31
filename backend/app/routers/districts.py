from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/districts",
    tags=["Districts"]
)

@router.get("/", response_model=list[schemas.DistrictOut])
def get_districts(db: Session = Depends(get_db)):
    return db.query(models.District).all()

@router.get("/{district_id}", response_model=schemas.DistrictOut)
def get_district(district_id: int, db: Session = Depends(get_db)):
    district = db.query(models.District).filter(models.District.id == district_id).first()
    if not district:
        raise HTTPException(status_code=404, detail=f"District with id {district_id} not found")
    return district

@router.post("/", response_model=schemas.DistrictOut, status_code=201)
def create_district(district: schemas.DistrictCreate, db: Session = Depends(get_db)):
    db_district = models.District(**district.dict())
    db.add(db_district)
    db.commit()
    db.refresh(db_district)
    return db_district

@router.put("/{district_id}", response_model=schemas.DistrictOut)
def update_district(district_id: int, updated: schemas.DistrictCreate, db: Session = Depends(get_db)):
    district = db.query(models.District).filter(models.District.id == district_id).first()
    if not district:
        raise HTTPException(status_code=404, detail=f"District with id {district_id} not found")
    for key, value in updated.dict().items():
        setattr(district, key, value)
    db.commit()
    db.refresh(district)
    return district

@router.delete("/{district_id}")
def delete_district(district_id: int, db: Session = Depends(get_db)):
    district = db.query(models.District).filter(models.District.id == district_id).first()
    if not district:
        raise HTTPException(status_code=404, detail=f"District with id {district_id} not found")
    db.delete(district)
    db.commit()
    return {"message": f"District with id {district_id} deleted successfully"}