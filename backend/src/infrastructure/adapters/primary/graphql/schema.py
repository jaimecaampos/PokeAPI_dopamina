import strawberry
from typing import List, Optional
from .types import PokemonType, PokemonDetailType, RosterItemType
from .resolvers import (
    resolve_search_pokemon,
    resolve_get_pokemon_detail,
    resolve_get_roster,
    mutate_save_to_roster
)

@strawberry.type
class Query:
    search_pokemon: List[PokemonType] = strawberry.field(resolver=resolve_search_pokemon)
    get_pokemon_detail: Optional[PokemonDetailType] = strawberry.field(resolver=resolve_get_pokemon_detail)
    get_roster: List[RosterItemType] = strawberry.field(resolver=resolve_get_roster)

@strawberry.type
class Mutation:
    save_to_roster: RosterItemType = strawberry.field(resolver=mutate_save_to_roster)

schema = strawberry.Schema(query=Query, mutation=Mutation)
