from typing import List
from src.domain.models.pokemon import Pokemon
from src.domain.ports.api_client import ApiClient

class SearchPokemonUseCase:
    def __init__(self, api_client: ApiClient):
        self.api_client = api_client

    async def execute(self, query: str) -> List[Pokemon]:
        return await self.api_client.search_pokemon(query)
