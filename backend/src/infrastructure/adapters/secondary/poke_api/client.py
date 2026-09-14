import httpx
import json
from typing import List, Optional
from src.domain.models.pokemon import Pokemon, PokemonDetail
from src.domain.ports.api_client import ApiClient

POKE_API_URL = "https://beta.pokeapi.co/graphql/v1beta"

class PokeApiClient(ApiClient):
    async def search_pokemon(self, query: str) -> List[Pokemon]:
        graphql_query = """
        query searchPokemon($name: String!) {
          pokemon_v2_pokemon(where: {name: {_ilike: $name}}, limit: 20) {
            id
            name
            pokemon_v2_pokemonsprites {
              sprites
            }
          }
        }
        """
        variables = {"name": f"%{query}%"}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                POKE_API_URL, 
                json={"query": graphql_query, "variables": variables}
            )
            data = response.json()
            
        pokemons = []
        if "data" in data and "pokemon_v2_pokemon" in data["data"]:
            for item in data["data"]["pokemon_v2_pokemon"]:
                image_url = self._extract_image_url(item)
                pokemons.append(Pokemon(
                    id=item["id"],
                    name=item["name"],
                    image_url=image_url
                ))
        return pokemons

    async def get_pokemon_detail(self, name: str) -> Optional[PokemonDetail]:
        graphql_query = """
        query getPokemonDetail($name: String!) {
          pokemon_v2_pokemon(where: {name: {_eq: $name}}) {
            id
            name
            height
            weight
            pokemon_v2_pokemonsprites {
              sprites
            }
            pokemon_v2_pokemonabilities {
              pokemon_v2_ability {
                name
              }
            }
            pokemon_v2_pokemonspecy {
              pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 9}}, limit: 1) {
                flavor_text
              }
            }
          }
        }
        """
        variables = {"name": name}
        async with httpx.AsyncClient() as client:
            response = await client.post(
                POKE_API_URL, 
                json={"query": graphql_query, "variables": variables}
            )
            data = response.json()
            
        if "data" in data and data["data"]["pokemon_v2_pokemon"]:
            item = data["data"]["pokemon_v2_pokemon"][0]
            image_url = self._extract_image_url(item)
            
            abilities = [
                ability["pokemon_v2_ability"]["name"] 
                for ability in item.get("pokemon_v2_pokemonabilities", [])
            ]
            
            description = None
            specy = item.get("pokemon_v2_pokemonspecy")
            if specy and specy.get("pokemon_v2_pokemonspeciesflavortexts"):
                description = specy["pokemon_v2_pokemonspeciesflavortexts"][0].get("flavor_text")
                if description:
                    description = description.replace("\n", " ").replace("\f", " ")

            return PokemonDetail(
                id=item["id"],
                name=item["name"],
                image_url=image_url,
                height=item["height"],
                weight=item["weight"],
                abilities=abilities,
                description=description
            )
        return None

    def _extract_image_url(self, item: dict) -> Optional[str]:
        sprites = item.get("pokemon_v2_pokemonsprites", [])
        if sprites:
            sprite_data = sprites[0].get("sprites")
            if isinstance(sprite_data, str):
                try:
                    sprite_data = json.loads(sprite_data)
                except json.JSONDecodeError:
                    return None
            if isinstance(sprite_data, dict):
                return sprite_data.get("front_default")
        return None
