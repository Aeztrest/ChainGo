from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Listing

router = APIRouter()

@router.delete("/delete_listing/{listing_id}")
def delete_listing(listing_id: int, username: str, db: Session = Depends(get_db)):
    # İlanı bul
    listing = db.query(Listing).filter(Listing.id == listing_id, Listing.username == username).first()

    if not listing:
        raise HTTPException(status_code=404, detail="İlan bulunamadı veya yetkiniz yok.")

    db.delete(listing)
    db.commit()

    return {"status": "success", "message": f"İlan (ID: {listing_id}) başarıyla silindi."}
