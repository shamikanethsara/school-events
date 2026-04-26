from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import events, registrations, announcements
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="School Events API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(registrations.router, prefix="/api/registrations", tags=["registrations"])
app.include_router(announcements.router, prefix="/api/announcements", tags=["announcements"])

@app.get("/")
def root():
    return {"message": "School Events API is running"}
