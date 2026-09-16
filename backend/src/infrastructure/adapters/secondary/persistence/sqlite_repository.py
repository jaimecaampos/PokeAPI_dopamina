from typing import List
from sqlalchemy.orm import Session
from src.domain.models.pokemon import RosterItem
from src.domain.ports.roster_repository import RosterRepository
from .models import RosterItemModel

class SqliteRepository(RosterRepository):
    def __init__(self, session: Session):
        self.session = session

    async def save_pokemon(self, roster_item: RosterItem) -> RosterItem:
        # Check if exists to avoid duplicates
        existing = self.session.query(RosterItemModel).filter(
            RosterItemModel.pokemon_id == roster_item.pokemon_id
        ).first()
        
        if not existing:
            db_item = RosterItemModel(
                pokemon_id=roster_item.pokemon_id,
                name=roster_item.name,
                image_url=roster_item.image_url,
                nickname=roster_item.nickname
            )
            self.session.add(db_item)
        else:
            existing.nickname = roster_item.nickname
            
        self.session.commit()
            
        return roster_item

    async def get_roster(self) -> List[RosterItem]:
        items = self.session.query(RosterItemModel).all()
        return [
            RosterItem(
                pokemon_id=item.pokemon_id,
                name=item.name,
                image_url=item.image_url,
                nickname=item.nickname
            )
            for item in items
        ]

    async def delete_pokemon(self, pokemon_id: int) -> bool:
        existing = self.session.query(RosterItemModel).filter(
            RosterItemModel.pokemon_id == pokemon_id
        ).first()
        if existing:
            self.session.delete(existing)
            self.session.commit()
            return True
        return False
