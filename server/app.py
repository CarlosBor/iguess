from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()

# CORS config (good as is!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar el modelo de ironía de CardiffNLP
irony_classifier = pipeline("text-classification", model="cardiffnlp/twitter-roberta-base-irony")

# Define el formato de entrada
class TextInput(BaseModel):
    text: str

# Define la ruta principal
@app.get("/")
async def root():
    return {"message": "Hello World"}

# Ruta para la predicción de ironía
@app.post("/predict")
async def predict(input: TextInput):
    # Predicción usando el modelo de ironía
    result = irony_classifier(input.text)
    
    # Devuelve el resultado con la etiqueta y el score
    return {"result": result}
