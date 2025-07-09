from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from database import get_db
from Login.auth import router as login_router
from Listings.create_listing import router as listings_router
from Listings.list_active_listings import router as active_listings_router
from Listings.get_listing_with_id import router as idlisting_listings_router
from Listings.get_user_listings import router as user_listings_router
from Listings.delete_listing import router as delete_listing_router
from Login.verify_token import router as verify_token_router
from Purchase.complete_purchase import router as complete_purchase_router
import requests
import base64
import hmac
import hashlib
import json
import random
import uuid
from pydantic import BaseModel
from models import WalletCode
from starlette.requests import Request
from starlette.responses import Response
from fastapi.staticfiles import StaticFiles
# CORS ve ayarlar için gerekli import ###################
from fastapi.middleware.cors import CORSMiddleware
import os
from Wallet.get_wallet import router as get_wallet_router

app = FastAPI()

# CORS middleware tanımı
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",             # local development
        "http://localhost:3003",
        "http://goktugtunc.com",             # live frontend
        "https://goktugtunc.com",            # ssl varsa
        "https://wallet.goktugtunc.com"      # subdomain varsa
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(login_router)
app.include_router(listings_router)
app.include_router(active_listings_router)
app.include_router(idlisting_listings_router)
app.include_router(user_listings_router)
app.include_router(delete_listing_router)
app.include_router(verify_token_router)
app.include_router(complete_purchase_router)
app.include_router(get_wallet_router)
app.mount("/uploads", StaticFiles(directory=os.path.join(os.getcwd(), "uploads")), name="uploads")

@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    max_size = 20 * 1024 * 1024  # 20 MB
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > max_size:
        return Response("Request too large", status_code=413)
    return await call_next(request)

@app.get("/")
def read_root():
    return {"message": "FastAPI + MySQL çalışıyor!"}

@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "message": "Veritabanı bağlantısı başarılı"}
    except OperationalError as e:
        return {"status": "error", "message": f"Veritabanı bağlantı hatası: {str(e)}"}

class WalletCodeCreate(BaseModel):
    wallet_code: str

@app.post("/save_wallet_code")
def save_wallet_code(data: WalletCodeCreate, db: Session = Depends(get_db)):
    existing = db.query(WalletCode).filter(WalletCode.wallet_code == data.wallet_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="This wallet code is already registered.")
    new_code = WalletCode(wallet_code=data.wallet_code)
    db.add(new_code)
    db.commit()
    db.refresh(new_code)
    return {"status": "ok", "id": new_code.id, "wallet_code": new_code.wallet_code}
