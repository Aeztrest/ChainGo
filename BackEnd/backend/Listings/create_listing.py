from typing import Optional, List
from fastapi import APIRouter, Form, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json
import os
from datetime import datetime

from database import get_db
from models import Listing
from pydantic import BaseModel

class ListingFormData(BaseModel):
    title: str
    description: str
    price: float
    category: Optional[str]
    username: Optional[str]

router = APIRouter()

UPLOAD_DIR = "./uploads"  # klasörün mevcut olduğundan emin ol
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/create_listing")
async def create_listing(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    category: str = Form(None),
    username: str = Form(...),
    images: List[UploadFile] = File([]),
    db: Session = Depends(get_db)
):
    saved_filenames = []
    for file in images:
        filename = f"{datetime.utcnow().timestamp()}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        saved_filenames.append(filename)

    new_listing = Listing(
        title=title,
        description=description,
        price=price,
        category=category,
        username=username,
        images=json.dumps(saved_filenames),
        is_sold=False,
        created_at=datetime.utcnow()
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    return {
        "status": "success",
        "listing_id": new_listing.id,
        "uploaded_images": saved_filenames
    }