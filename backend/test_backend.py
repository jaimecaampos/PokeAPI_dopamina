import asyncio
from src.infrastructure.adapters.secondary.poke_api.client import PokeApiClient

async def main():
    client = PokeApiClient()
    result = await client.search_pokemon("")
    print(f"Count: {len(result)}")
    if result:
        print(f"First: {result[0]}")

if __name__ == "__main__":
    asyncio.run(main())
