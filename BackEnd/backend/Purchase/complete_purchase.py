from fastapi import APIRouter, Header, HTTPException, Depends
from database import get_db
from sqlalchemy.orm import Session
from models import Listing
from datetime import datetime
from pydantic import BaseModel

router = APIRouter()

class PurchaseRequest(BaseModel):
    listing_id: int
    buyer_username: str
    txid: str  # Opsiyonel olarak transfer işleminin hash’i (doğrulama için)

@router.post("/complete_purchase")
def complete_purchase(data: PurchaseRequest, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter_by(id=data.listing_id, is_sold=False).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı veya satılmış.")

    # İsteğe bağlı: blockchain üzerinde transferin doğruluğunu kontrol et

    listing.is_sold = True
    listing.buyer_username = data.buyer_username
    listing.sold_at = datetime.utcnow()
    db.commit()

    return {"status": "success", "message": "Satın alma işlemi tamamlandı."}
