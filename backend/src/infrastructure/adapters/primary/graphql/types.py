import strawberry
from typing import List, Optional

@strawberry.type
class PokemonType:
    id: int
    name: str
    image_url: Optional[str]

@strawberry.type
class PokemonDetailType(PokemonType):
    height: int
    weight: int
    abilities: List[str]
    description: Optional[str]

@strawberry.type
class RosterItemType:
    pokemon_id: int
    name: str
    image_url: Optional[str]
    nickname: Optional[str]
