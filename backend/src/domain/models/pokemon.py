from dataclasses import dataclass
from typing import List, Optional

@dataclass
class Pokemon:
    id: int
    name: str
    image_url: Optional[str]

@dataclass
class PokemonDetail(Pokemon):
    height: int
    weight: int
    abilities: List[str]
    description: Optional[str]

@dataclass
class RosterItem:
    pokemon_id: int
    name: str
    image_url: Optional[str]
    nickname: Optional[str] = None
