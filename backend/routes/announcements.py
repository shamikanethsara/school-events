from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Announcement
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

router = APIRouter()

class AnnouncementCreate(BaseModel):
    title: str
    content: str
    priority: Optional[str] = "normal"

class AnnouncementOut(BaseModel):
    id: int
    title: str
    content: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/", response_model=List[AnnouncementOut])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Announcement).order_by(Announcement.created_at.desc()).all()

@router.post("/", response_model=AnnouncementOut)
def create_announcement(ann: AnnouncementCreate, db: Session = Depends(get_db)):
    db_ann = Announcement(**ann.dict())
    db.add(db_ann)
    db.commit()
    db.refresh(db_ann)
    return db_ann
