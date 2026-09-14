from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class RosterItemModel(Base):
    __tablename__ = "roster"
    
    pokemon_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    image_url = Column(String, nullable=True)
