from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/records",
    tags=["Records"]
)

@router.get("/", response_model=list[schemas.LandRecordOut])
def get_records(db: Session = Depends(get_db)):
    return db.query(models.LandRecord).all()

@router.get("/{record_id}", response_model=schemas.LandRecordOut)
def get_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(models.LandRecord).filter(models.LandRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Record with id {record_id} not found")
    return record

@router.post("/", response_model=schemas.LandRecordOut, status_code=201)
def create_record(record: schemas.LandRecordCreate, db: Session = Depends(get_db)):
    db_record = models.LandRecord(**record.dict())
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    return db_record

@router.put("/{record_id}", response_model=schemas.LandRecordOut)
def update_record(record_id: int, updated: schemas.LandRecordCreate, db: Session = Depends(get_db)):
    record = db.query(models.LandRecord).filter(models.LandRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Record with id {record_id} not found")
    for key, value in updated.dict().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

@router.delete("/{record_id}")
def delete_record(record_id: int, db: Session = Depends(get_db)):
    record = db.query(models.LandRecord).filter(models.LandRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Record with id {record_id} not found")
    db.delete(record)
    db.commit()
    return {"message": f"Record with id {record_id} deleted successfully"}