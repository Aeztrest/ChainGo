from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Listing
import json

router = APIRouter()

@router.get("/get_listing/{product_id}")
def get_listing(product_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter_by(id=product_id).first()

    if not listing:
        raise HTTPException(status_code=404, detail="Product not found")

    return {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price": str(listing.price),
        "category": listing.category,
        "location": listing.location,
        "item_condition": listing.item_condition,
        "username": listing.username,
        "images": json.loads(listing.images) if listing.images else [],
        "created_at": listing.created_at.isoformat(),
        "is_sold": listing.is_sold,
        "buyer_username": listing.buyer_username,
        "sold_at": listing.sold_at
    }
