import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_ROSTER = gql`
  query GetRoster {
    getRoster {
      pokemonId
      name
      imageUrl
      nickname
    }
  }
`;

function Roster() {
  const { loading, error, data } = useQuery(GET_ROSTER);

  if (loading) return <div className="loading">LOADING ROSTER...</div>;
  if (error) return <div className="empty-state">ERROR LOADING ROSTER</div>;

  const roster = data?.getRoster || [];

  return (
    <div>
      <h2 style={{marginBottom: '2rem', textAlign: 'center'}}>MY POKEMON TEAM</h2>
      {roster.length === 0 ? (
        <div className="empty-state">ROSTER IS EMPTY</div>
      ) : (
        <div className="grid">
          {roster.map((item) => (
            <div key={item.pokemonId} className="card">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} />
              ) : (
                <div style={{width: 120, height: 120, margin: '0 auto', background: '#333'}} />
              )}
              {item.nickname ? (
                <>
                  <h3 style={{color: '#ffcc00'}}>{item.nickname}</h3>
                  <div style={{fontSize: '8px', color: '#888'}}>({item.name})</div>
                </>
              ) : (
                <h3>{item.name}</h3>
              )}
              <div style={{marginTop: '10px'}}>ID: {item.pokemonId}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Roster;
