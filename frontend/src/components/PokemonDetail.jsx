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
  mutation SaveToRoster($pokemonId: Int!, $name: String!, $imageUrl: String, $nickname: String) {
    saveToRoster(pokemonId: $pokemonId, name: $name, imageUrl: $imageUrl, nickname: $nickname) {
      pokemonId
      name
      nickname
    }
  }
`;

function PokemonDetail({ name, onClose }) {
  const { loading, error, data } = useQuery(GET_POKEMON_DETAIL, {
    variables: { name },
  });
  
  const [nickname, setNickname] = React.useState('');

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
        imageUrl: pokemon.imageUrl,
        nickname: nickname || null
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
          
          <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="ENTER NICKNAME (OPTIONAL)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                fontFamily: '"Press Start 2P", cursive',
                fontSize: '10px',
                background: '#000',
                color: '#fff',
                border: '2px solid #fff',
                boxSizing: 'border-box'
              }}
            />
          </div>
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
