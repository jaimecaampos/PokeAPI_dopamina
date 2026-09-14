from abc import ABC, abstractmethod
from typing import List
from src.domain.models.pokemon import RosterItem

class RosterRepository(ABC):
    @abstractmethod
    async def save_pokemon(self, roster_item: RosterItem) -> RosterItem:
        pass

    @abstractmethod
    async def get_roster(self) -> List[RosterItem]:
        pass
