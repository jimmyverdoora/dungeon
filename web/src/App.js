import React from 'react';
import Home from './Home';
import Dungeon from './Dungeon';
import { useMetaMask } from "metamask-react";

function App() {

  const { status } = useMetaMask();

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
      {status == 'connected' ? <Dungeon /> : <Home />}
    </div>
  );
}

export default App;
