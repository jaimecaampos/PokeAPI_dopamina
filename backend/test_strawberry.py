import asyncio
from src.infrastructure.adapters.primary.graphql.schema import schema

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
    result = await schema.execute(query, variable_values={"query": ""})
    print(result.errors)
    print(result.data)

if __name__ == "__main__":
    asyncio.run(main())
