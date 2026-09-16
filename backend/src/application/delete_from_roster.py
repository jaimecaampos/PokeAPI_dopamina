from src.domain.ports.roster_repository import RosterRepository

class DeleteFromRosterUseCase:
    def __init__(self, repository: RosterRepository):
        self.repository = repository

    async def execute(self, pokemon_id: int) -> bool:
        return await self.repository.delete_pokemon(pokemon_id)
