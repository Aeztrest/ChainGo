from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import re
from database import get_db  # veritabanı bağlantısı
from models import User, WalletCode  # SQLAlchemy User modeli

SECRET_KEY = "gizli_key"  # .env'den alman önerilir
ALGORITHM = "HS256"

router = APIRouter()

class WalletCheckRequest(BaseModel):
    wallet_address: str

@router.post("/is_exists_user")
def is_exists_user(data: WalletCheckRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(wallet_address=data.wallet_address).first()
    if not user:
        return {"status": False}
    
    # login timestamp güncelle
    user.last_login = datetime.utcnow()
    db.commit()

    # JWT token oluştur
    payload = {
        "user_id": user.id,
        "wallet": user.wallet_address,
        "username": user.username,
        "exp": datetime.utcnow() + timedelta(days=3)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    print("secret:", SECRET_KEY)

    return {
        "status": True,
        "token": token,
        "user": {
            "name": user.nameSurname,
            "username": user.username,
            "wallet_address": user.wallet_address,
            "creation_time": user.created_at
        }
    }

class NewUserRequest(BaseModel):
    nameSurname: str
    username: str
    wallet_address: str

@router.post("/create_new_user")
def create_new_user(data: NewUserRequest, db: Session = Depends(get_db)):
    
    # Aynı wallet zaten varsa hata döndür
    existing = db.query(User).filter_by(wallet_address=data.wallet_address).first()
    if existing:
        raise HTTPException(status_code=400, detail="Wallet already registered.")
    
    existing = db.query(User).filter_by(username=data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered.")

    new_user = User(
        nameSurname=data.nameSurname,
        username=data.username,
        wallet_address=data.wallet_address,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"status": "ok", "user_id": new_user.id}
