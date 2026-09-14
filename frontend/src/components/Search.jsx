import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import PokemonDetail from './PokemonDetail';

const SEARCH_POKEMON = gql`
  query SearchPokemon($query: String!) {
    searchPokemon(query: $query) {
      id
      name
      imageUrl
    }
  }
`;

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  
  const [searchPokemon, { loading, error, data }] = useLazyQuery(SEARCH_POKEMON);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchPokemon({ variables: { query: searchTerm.trim() } });
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder="Search for a Pokémon..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {loading && <div className="loading">LOADING...</div>}
      {error && <div className="empty-state">ERROR: {error.message}</div>}
      
      {data && data.searchPokemon && (
        data.searchPokemon.length === 0 ? (
          <div className="empty-state">NO POKEMON FOUND</div>
        ) : (
          <div className="grid">
            {data.searchPokemon.map((pokemon) => (
              <div 
                key={pokemon.id} 
                className="card"
                onClick={() => setSelectedPokemon(pokemon.name)}
              >
                {pokemon.imageUrl ? (
                  <img src={pokemon.imageUrl} alt={pokemon.name} />
                ) : (
                  <div style={{width: 120, height: 120, margin: '0 auto', background: '#333'}} />
                )}
                <h3>{pokemon.name}</h3>
                <div>ID: {pokemon.id}</div>
              </div>
            ))}
          </div>
        )
      )}

      {selectedPokemon && (
        <PokemonDetail 
          name={selectedPokemon} 
          onClose={() => setSelectedPokemon(null)} 
        />
      )}
    </div>
  );
}

export default Search;
