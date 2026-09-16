from src.infrastructure.adapters.secondary.poke_api.client import PokeApiClient
from src.infrastructure.adapters.secondary.persistence.sqlite_repository import SqliteRepository
from src.application.search_pokemon import SearchPokemonUseCase
from src.application.get_pokemon_detail import GetPokemonDetailUseCase
from src.application.save_to_roster import SaveToRosterUseCase
from src.application.get_roster import GetRosterUseCase
from src.application.delete_from_roster import DeleteFromRosterUseCase
from src.infrastructure.config.database import SessionLocal

def get_api_client() -> PokeApiClient:
    return PokeApiClient()

def get_repository() -> SqliteRepository:
    db = SessionLocal()
    # Note: In a real app we'd close the session properly via dependency injection, 
    # but for Strawberry GraphQL without FastAPI dependency injection context, 
    # we'll keep it simple. Actually, we should ideally close it.
    return SqliteRepository(session=db)

def get_search_pokemon_use_case() -> SearchPokemonUseCase:
    return SearchPokemonUseCase(get_api_client())

def get_pokemon_detail_use_case() -> GetPokemonDetailUseCase:
    return GetPokemonDetailUseCase(get_api_client())

def get_save_to_roster_use_case() -> SaveToRosterUseCase:
    return SaveToRosterUseCase(get_repository())

def get_roster_use_case() -> GetRosterUseCase:
    return GetRosterUseCase(get_repository())

def get_delete_from_roster_use_case() -> DeleteFromRosterUseCase:
    return DeleteFromRosterUseCase(get_repository())
