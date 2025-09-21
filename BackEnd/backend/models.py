# models.py

from sqlalchemy import Column, Integer, String, TIMESTAMP, DateTime, DECIMAL, Text, Boolean
from database import Base
from datetime import datetime
import json

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    wallet_address = Column(String(64), unique=True, nullable=False)
    nameSurname = Column(String(500))
    username = Column(String(32))
    created_at = Column(TIMESTAMP)
    last_login = Column(TIMESTAMP)

class WalletCode(Base):
    __tablename__ = "wallet_codes"

    id = Column(Integer, primary_key=True, index=True)
    wallet_code = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)
    category = Column(String(100))
    username = Column(String(100))
    images = Column(Text)  # JSON string olarak kaydedeceğiz
    is_sold = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    buyer_username = Column(String(100), nullable=True)
    sold_at = Column(DateTime, nullable=True)

    def as_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": str(self.price),
            "category": self.category,
            "username": self.username,
            "images": json.loads(self.images) if self.images else [],
            "created_at": self.created_at.isoformat(),
            "is_sold": self.is_sold,
            "buyer_username": self.buyer_username,
            "sold_at": self.sold_at
        }