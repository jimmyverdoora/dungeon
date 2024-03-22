import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './Home';
import Dungeon from './Dungeon';
import Token from './Token';
import Loading from './Loading';
import { useMetaMask } from "metamask-react";
import { CHAIN_ID } from './constants';

function App() {

  const { status, chainId } = useMetaMask();

  return (
    <Router>
      <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
        <div className='desktop'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={status == 'connected' && chainId == CHAIN_ID ? <Dungeon /> : <Loading action={'Connect Metamask...'} />} />
            <Route path="/token" element={status == 'connected' && chainId == CHAIN_ID ? <Token /> : <Loading action={'Connect Metamask...'} />} />
          </Routes>
        </div>
        <div className='mobile'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/*" element={<div>
              <div style={{ color: '#ffd480', fontFamily: 'monospace', display: 'flex', justifyContent: 'center' }}>
                <p style={{ marginTop: 0, paddingTop: '30px', fontSize: 'large' }}>You can't access from mobile.</p>
              </div>
              <div style={{ color: '#ffd480', fontFamily: 'monospace', display: 'flex', justifyContent: 'center' }}>
                <p style={{ fontSize: 'large', marginLeft: '20px', marginRight: '20px' }}>Get a laptop or PC. If you don't have money, why are you even on a crypto game website?!</p>
              </div>
            </div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
