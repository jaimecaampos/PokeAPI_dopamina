from typing import List
from src.domain.models.pokemon import RosterItem
from src.domain.ports.roster_repository import RosterRepository

class GetRosterUseCase:
    def __init__(self, repository: RosterRepository):
        self.repository = repository

    async def execute(self) -> List[RosterItem]:
        return await self.repository.get_roster()
