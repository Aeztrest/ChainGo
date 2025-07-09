from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from models import Listing

router = APIRouter()

@router.get("/list_active_listings")
def list_active_listings(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, le=100),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * page_size

    listings = db.query(Listing) \
        .filter(Listing.is_sold == False) \
        .order_by(Listing.created_at.desc()) \
        .offset(offset) \
        .limit(page_size) \
        .all()

    total_count = db.query(Listing).filter(Listing.is_sold == False).count()
    total_pages = (total_count + page_size - 1) // page_size

    return {
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "total_items": total_count,
        "listings": [l.as_dict() for l in listings]
    }
