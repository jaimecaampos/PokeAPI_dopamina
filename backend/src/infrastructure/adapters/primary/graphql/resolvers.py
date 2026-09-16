import strawberry
from typing import List, Optional
from .types import PokemonType, PokemonDetailType, RosterItemType
from src.infrastructure.config.dependencies import (
    get_search_pokemon_use_case,
    get_pokemon_detail_use_case,
    get_save_to_roster_use_case,
    get_roster_use_case,
    get_delete_from_roster_use_case
)
from src.domain.models.pokemon import RosterItem

async def resolve_search_pokemon(query: str) -> List[PokemonType]:
    use_case = get_search_pokemon_use_case()
    results = await use_case.execute(query)
    return [
        PokemonType(id=r.id, name=r.name, image_url=r.image_url)
        for r in results
    ]

async def resolve_get_pokemon_detail(name: str) -> Optional[PokemonDetailType]:
    use_case = get_pokemon_detail_use_case()
    result = await use_case.execute(name)
    if result:
        return PokemonDetailType(
            id=result.id,
            name=result.name,
            image_url=result.image_url,
            height=result.height,
            weight=result.weight,
            abilities=result.abilities,
            description=result.description
        )
    return None

async def resolve_get_roster() -> List[RosterItemType]:
    use_case = get_roster_use_case()
    results = await use_case.execute()
    return [
        RosterItemType(pokemon_id=r.pokemon_id, name=r.name, image_url=r.image_url, nickname=r.nickname)
        for r in results
    ]

async def mutate_save_to_roster(pokemon_id: int, name: str, image_url: Optional[str] = None, nickname: Optional[str] = None) -> RosterItemType:
    use_case = get_save_to_roster_use_case()
    item = RosterItem(pokemon_id=pokemon_id, name=name, image_url=image_url, nickname=nickname)
    result = await use_case.execute(item)
    return RosterItemType(
        pokemon_id=result.pokemon_id, 
        name=result.name, 
        image_url=result.image_url,
        nickname=result.nickname
    )

async def mutate_delete_from_roster(pokemon_id: int) -> bool:
    use_case = get_delete_from_roster_use_case()
    return await use_case.execute(pokemon_id)
