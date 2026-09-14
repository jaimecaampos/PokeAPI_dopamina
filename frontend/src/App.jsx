import React, { useState } from 'react';
import Search from './components/Search';
import Roster from './components/Roster';

function App() {
  const [view, setView] = useState('search');

  return (
    <div className="container">
      <header>
        <h1>Poké Explorer</h1>
        <div className="nav">
          <button 
            className={view === 'search' ? 'active' : ''} 
            onClick={() => setView('search')}
          >
            Search
          </button>
          <button 
            className={view === 'roster' ? 'active' : ''} 
            onClick={() => setView('roster')}
          >
            My Roster
          </button>
        </div>
      </header>
      
      <main>
        {view === 'search' && <Search />}
        {view === 'roster' && <Roster />}
      </main>
    </div>
  );
}

export default App;
