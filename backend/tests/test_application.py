import pytest
from src.domain.models.pokemon import Pokemon
from src.application.search_pokemon import SearchPokemonUseCase

class MockApiClient:
    async def search_pokemon(self, query: str):
        return [Pokemon(id=1, name="pikachu", image_url="http://example.com/pikachu.png")]
    async def get_pokemon_detail(self, name: str):
        return None

@pytest.mark.asyncio
async def test_search_pokemon():
    client = MockApiClient()
    use_case = SearchPokemonUseCase(client)
    result = await use_case.execute("pikachu")
    assert len(result) == 1
    assert result[0].name == "pikachu"
