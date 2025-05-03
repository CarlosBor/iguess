from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

irony_classifier = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-irony")

class TextInput(BaseModel):
    text: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/predict")
async def predict(input: TextInput):
    result = irony_classifier(input.text)
    
    return {"result": result}
