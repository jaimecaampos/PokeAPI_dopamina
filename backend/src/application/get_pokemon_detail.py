from typing import Optional
from src.domain.models.pokemon import PokemonDetail
from src.domain.ports.api_client import ApiClient

class GetPokemonDetailUseCase:
    def __init__(self, api_client: ApiClient):
        self.api_client = api_client

    async def execute(self, name: str) -> Optional[PokemonDetail]:
        return await self.api_client.get_pokemon_detail(name)
