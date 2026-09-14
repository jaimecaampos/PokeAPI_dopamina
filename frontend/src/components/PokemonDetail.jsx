import React from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_POKEMON_DETAIL = gql`
  query GetPokemonDetail($name: String!) {
    getPokemonDetail(name: $name) {
      id
      name
      imageUrl
      height
      weight
      abilities
      description
    }
  }
`;

const SAVE_TO_ROSTER = gql`
  mutation SaveToRoster($pokemonId: Int!, $name: String!, $imageUrl: String) {
    saveToRoster(pokemonId: $pokemonId, name: $name, imageUrl: $imageUrl) {
      pokemonId
      name
    }
  }
`;

function PokemonDetail({ name, onClose }) {
  const { loading, error, data } = useQuery(GET_POKEMON_DETAIL, {
    variables: { name },
  });

  const [saveToRoster, { loading: saving, error: saveError }] = useMutation(SAVE_TO_ROSTER, {
    refetchQueries: ['GetRoster']
  });

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content" style={{textAlign: 'center'}}>
          <h2 className="loading">FETCHING DATA...</h2>
        </div>
      </div>
    );
  }

  if (error || !data?.getPokemonDetail) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>X</button>
          <h2 className="empty-state">ERROR FETCHING DETAILS</h2>
        </div>
      </div>
    );
  }

  const pokemon = data.getPokemonDetail;

  const handleSave = () => {
    saveToRoster({
      variables: {
        pokemonId: pokemon.id,
        name: pokemon.name,
        imageUrl: pokemon.imageUrl
      }
    }).then(() => alert('SAVED TO ROSTER!'));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>X</button>
        <div className="pokemon-details">
          {pokemon.imageUrl ? (
            <img src={pokemon.imageUrl} alt={pokemon.name} />
          ) : (
             <div style={{width: 150, height: 150, background: '#333', marginBottom: '1rem'}} />
          )}
          <h2>{pokemon.name}</h2>
          
          <div className="detail-row">
            <span>HEIGHT:</span>
            <span>{pokemon.height / 10} M</span>
          </div>
          <div className="detail-row">
            <span>WEIGHT:</span>
            <span>{pokemon.weight / 10} KG</span>
          </div>
          
          <div className="abilities">
            <h3>ABILITIES</h3>
            <ul>
              {pokemon.abilities.map((ability, idx) => (
                <li key={idx} style={{textTransform: 'capitalize'}}>{ability}</li>
              ))}
            </ul>
          </div>
          
          {pokemon.description && (
            <div className="description">
              {pokemon.description}
            </div>
          )}
          
          <button 
            className="save-btn" 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'SAVING...' : 'ADD TO ROSTER'}
          </button>
          {saveError && <div style={{color: 'red', marginTop: 10, fontSize: 10}}>FAILED TO SAVE</div>}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
