from src.domain.models.pokemon import RosterItem
from src.domain.ports.roster_repository import RosterRepository

class SaveToRosterUseCase:
    def __init__(self, repository: RosterRepository):
        self.repository = repository

    async def execute(self, roster_item: RosterItem) -> RosterItem:
        return await self.repository.save_pokemon(roster_item)
