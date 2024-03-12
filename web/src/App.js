import './App.css';

import React from 'react';
import Home from './Home';
import Dungeon from './Dungeon';
import { useMetaMask } from "metamask-react";
import { CHAIN_ID } from './constants';

function App() {

  const { status, chainId } = useMetaMask();

  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
      <div className='desktop'>
        {status == 'connected' && chainId == CHAIN_ID ? <Dungeon /> : <Home />}
      </div>
      <div className='mobile'>
        <div style={{ color: '#ffd480', fontFamily: 'monospace', display: 'flex', justifyContent: 'center' }}>
          <p style={{ marginTop: 0, paddingTop: '30px', fontSize: 'large' }}>You can't play from mobile.</p>
        </div>
        <div style={{ color: '#ffd480', fontFamily: 'monospace', display: 'flex', justifyContent: 'center' }}>
          <p style={{ fontSize: 'large', marginLeft: '20px', marginRight: '20px' }}>Get a laptop or PC. If you don't have money, why are you even on a crypto gambling game website?!</p>
        </div>
      </div>
    </div>
  );
}

export default App;
