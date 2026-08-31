from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db

router = APIRouter(
    prefix="/disputes",
    tags=["Disputes"]
)

@router.get("/", response_model=list[schemas.DisputeOut])
def get_disputes(db: Session = Depends(get_db)):
    return db.query(models.Dispute).all()

@router.get("/{dispute_id}", response_model=schemas.DisputeOut)
def get_dispute(dispute_id: int, db: Session = Depends(get_db)):
    dispute = db.query(models.Dispute).filter(models.Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail=f"Dispute with id {dispute_id} not found")
    return dispute

@router.post("/", response_model=schemas.DisputeOut, status_code=201)
def create_dispute(dispute: schemas.DisputeCreate, db: Session = Depends(get_db)):
    db_dispute = models.Dispute(**dispute.dict())
    db.add(db_dispute)
    db.commit()
    db.refresh(db_dispute)
    return db_dispute

@router.put("/{dispute_id}", response_model=schemas.DisputeOut)
def update_dispute(dispute_id: int, updated: schemas.DisputeCreate, db: Session = Depends(get_db)):
    dispute = db.query(models.Dispute).filter(models.Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail=f"Dispute with id {dispute_id} not found")
    for key, value in updated.dict().items():
        setattr(dispute, key, value)
    db.commit()
    db.refresh(dispute)
    return dispute

@router.delete("/{dispute_id}")
def delete_dispute(dispute_id: int, db: Session = Depends(get_db)):
    dispute = db.query(models.Dispute).filter(models.Dispute.id == dispute_id).first()
    if not dispute:
        raise HTTPException(status_code=404, detail=f"Dispute with id {dispute_id} not found")
    db.delete(dispute)
    db.commit()
    return {"message": f"Dispute with id {dispute_id} deleted successfully"}