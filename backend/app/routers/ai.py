import os
import json
import shutil
from google import genai
from google.genai import types
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel
from dotenv import load_dotenv

from ..database import get_db
from .. import models

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY"),
    http_options=types.HttpOptions(api_version="v1")
)

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


# Frontend se mapping match karne ke liye 'query' property set ki
class QueryRequest(BaseModel):
    query: str


@router.post("/query")
def ask_ai(request: QueryRequest, db: Session = Depends(get_db)):
    records = db.query(models.LandRecord).all()

    data_summary = "\n".join([
        f"District: {r.district}, State: {r.state}, Area: {r.area_hectares} hectares, Dispute Status: {r.dispute_status}"
        for r in records
    ])

    prompt = f"""
You are a land governance data assistant.
Answer ONLY from the data below.

Land Records Data:
{data_summary}

User Question:
{request.query}

Give a short and clear answer.
"""

    # New SDK updates ke hisab se gemini-2.5-flash sabse stable aur active hai
    chat = client.chats.create(
        model="gemini-3.6-flash"
    )

    response = chat.send_message(prompt)
    return {"answer": response.text}


@router.post("/scan-document")
def scan_land_document(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        uploaded_file = client.files.upload(file=temp_path)
        
        system_prompt = (
            "You are an expert Indian Land Governance AI. The uploaded document can be in any Indian regional language "
            "(like Hindi, Marathi, Punjabi, Tamil, Telugu, Gujarati, etc.) or English. "
            "Your task is to translate and analyze the document text, then extract the following details strictly in JSON format: "
            "{'state': '...', 'district': '...', 'land_type': 'Urban/Agricultural/Rural/Forest', "
            "'area_hectares': 0.0, 'dispute_status': 'Clear/Disputed', 'latitude': 0.0, 'longitude': 0.0}. "
            "Ensure the output values are translated to English. If coordinates are missing, guess reasonable dummy coordinates "
            "based on the district/state location inside India."
        )
        
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=[uploaded_file, system_prompt]
        )
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
        
        extracted_data = json.loads(response.text.strip().replace("```json", "").replace("```", ""))
        return {"status": "success", "extracted_data": extracted_data}
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return {"status": "error", "message": str(e)}