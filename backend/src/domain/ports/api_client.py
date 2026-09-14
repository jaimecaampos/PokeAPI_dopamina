from abc import ABC, abstractmethod
from typing import List, Optional
from src.domain.models.pokemon import Pokemon, PokemonDetail

class ApiClient(ABC):
    @abstractmethod
    async def search_pokemon(self, query: str) -> List[Pokemon]:
        pass

    @abstractmethod
    async def get_pokemon_detail(self, name: str) -> Optional[PokemonDetail]:
        pass
