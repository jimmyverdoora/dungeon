import React from 'react';
import Home from './Home';
import Dungeon from './Dungeon';
import { useMetaMask } from "metamask-react";
import { CHAIN_ID } from './constants';

function App() {

  const { status, chainId } = useMetaMask();

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
      {status == 'connected' && chainId == CHAIN_ID ? <Dungeon /> : <Home />}
    </div>
  );
}

export default App;
