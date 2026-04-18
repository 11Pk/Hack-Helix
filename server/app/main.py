from fastapi import FastAPI
from routes.predict import router as predict_router

app = FastAPI(title="Hackathon Delivery AI")

app.include_router(predict_router)