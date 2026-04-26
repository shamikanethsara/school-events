from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Event
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

router = APIRouter()

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    event_date: datetime
    image_url: Optional[str] = None
    max_capacity: Optional[int] = 100
    is_featured: Optional[bool] = False

class EventOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    location: Optional[str]
    event_date: datetime
    image_url: Optional[str]
    max_capacity: int
    is_featured: bool
    created_at: datetime
    registration_count: Optional[int] = 0

    class Config:
        from_attributes = True

@router.get("/", response_model=List[EventOut])
def get_events(db: Session = Depends(get_db)):
    events = db.query(Event).order_by(Event.event_date).all()
    result = []
    for e in events:
        out = EventOut.from_orm(e)
        out.registration_count = len(e.registrations)
        result.append(out)
    return result

@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    out = EventOut.from_orm(event)
    out.registration_count = len(event.registrations)
    return out

@router.post("/", response_model=EventOut)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted"}
