# get_wallet.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter()

@router.get("/get_user_wallet")
def get_user_wallet(username: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(User).filter_by(username=username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "username": user.username,
        "wallet_address": user.wallet_address
    }
