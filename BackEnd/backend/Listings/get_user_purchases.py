from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Listing
import json

router = APIRouter()

def _parse_images(raw):
    if not raw:
        return []
    try:
        # JSON string ise
        if isinstance(raw, (list, dict)):
            return raw
        s = str(raw).strip()
        if s.startswith("["):
            return json.loads(s)
        # CSV gibi tutulduysa
        return [x.strip() for x in s.split(",") if x.strip()]
    except Exception:
        return []

@router.get("/get_user_purchases")
def get_user_purchases(username: str = Query(...), db: Session = Depends(get_db)):
    """
    Belirtilen kullanıcının satın aldığı (is_sold=1 ve buyer_username=username) ilanlar.
    En yeni satışa göre sıralanır (sold_at varsa ona, yoksa created_at'e göre).
    """
    rows = (
        db.query(Listing)
        .filter(
            Listing.is_sold == True,          # noqa: E712
            Listing.buyer_username == username
        )
        .order_by(func.coalesce(Listing.sold_at, Listing.created_at).desc())
        .all()
    )

    if not rows:
        return {"purchases": []}

    return {
        "purchases": [
            {
                "id": r.id,
                "title": r.title,
                "description": r.description,
                "price": str(r.price) if getattr(r, "price", None) is not None else None,
                "category": r.category,
                "seller_username": r.username,  # ilanın sahibi = satıcı
                "buyer_username": r.buyer_username,
                "images": _parse_images(getattr(r, "images", None)),
                "created_at": r.created_at.isoformat() if getattr(r, "created_at", None) else None,
                "is_sold": bool(r.is_sold),
                "sold_at": r.sold_at.isoformat() if getattr(r, "sold_at", None) else None,
            }
            for r in rows
        ]
    }
