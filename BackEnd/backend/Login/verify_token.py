from fastapi import APIRouter, Header, HTTPException, Depends
from jose import jwt, JWTError
from typing import Optional
from pydantic import BaseModel
from database import get_db
from sqlalchemy.orm import Session
from models import User

router = APIRouter()

# Bunları settings dosyandan ya da ortam değişkenlerinden alman önerilir
SECRET_KEY = "gizli_key"  # .env'den alman önerilir
ALGORITHM = "HS256"

class TokenInput(BaseModel):
    token: str

@router.post("/verify_token")
def verify_token(data: TokenInput, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        print("verify secret:", SECRET_KEY)

        user_id = payload.get("user_id")
        username = payload.get("username")
        wallet = payload.get("wallet")

        if not username or not wallet:
            raise HTTPException(status_code=400, detail="Eksik kullanıcı bilgisi.")

        # Veritabanından kullanıcı bilgilerini çek
        user = db.query(User).filter_by(id=user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı.")

        return {
            "valid": True,
            "user": {
                "user_id": user.id,
                "username": user.username,
                "wallet": user.wallet_address,
                "name": user.nameSurname,
                "created_at": user.created_at
            }
        }

    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Geçersiz token: {str(e)}")