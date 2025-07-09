from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Listing
import json

router = APIRouter()

@router.get("/get_user_listings")
def get_user_listings(username: str = Query(...), db: Session = Depends(get_db)):
    listings = db.query(Listing).filter(Listing.username == username).order_by(Listing.created_at.desc()).all()

    if not listings:
        return {"listings": []}

    return {
        "listings": [
            {
                "id": listing.id,
                "title": listing.title,
                "description": listing.description,
                "price": str(listing.price),
                "category": listing.category,
                "location": listing.location,
                "item_condition": listing.item_condition,
                "username": listing.username,
                "images": json.loads(listing.images or "[]"),
                "created_at": listing.created_at.isoformat(),
                "is_sold": listing.is_sold,
                "buyer_username": listing.buyer_username,
                "sold_at": listing.sold_at
            }
            for listing in listings
        ]
    }
