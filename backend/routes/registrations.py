from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Registration, Event
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import random, string

router = APIRouter()

def generate_ticket_code():
    return "TKT-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))

class RegistrationCreate(BaseModel):
    event_id: int
    name: str
    email: str
    grade: Optional[str] = None
    school: Optional[str] = None

class RegistrationOut(BaseModel):
    id: int
    event_id: int
    name: str
    email: str
    grade: Optional[str]
    school: Optional[str]
    ticket_code: str

    class Config:
        from_attributes = True

@router.post("/", response_model=RegistrationOut)
def register(reg: RegistrationCreate, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == reg.event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    # Check capacity
    current = len(event.registrations)
    if current >= event.max_capacity:
        raise HTTPException(status_code=400, detail="Event is fully booked")

    # Check duplicate
    existing = db.query(Registration).filter(
        Registration.event_id == reg.event_id,
        Registration.email == reg.email
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")

    db_reg = Registration(**reg.dict(), ticket_code=generate_ticket_code())
    db.add(db_reg)
    db.commit()
    db.refresh(db_reg)
    return db_reg

@router.get("/event/{event_id}", response_model=List[RegistrationOut])
def get_registrations(event_id: int, db: Session = Depends(get_db)):
    return db.query(Registration).filter(Registration.event_id == event_id).all()
