import asyncio
import httpx

async def main():
    query = """
    query SearchPokemon($query: String!) {
        search_pokemon(query: $query) {
        id
        name
        image_url
        }
    }
    """
    async with httpx.AsyncClient() as client:
        # Let's start the server first in another process or use a TestClient
        pass

if __name__ == "__main__":
    asyncio.run(main())
