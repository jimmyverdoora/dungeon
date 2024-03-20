import React from 'react';
import { useMetaMask } from "metamask-react";
import { CHAIN_ID } from './constants';

import Title from './Title';


const rarityColor = ['#ad846a', '#b0b0b0', '#ffc247', '#47fffc', '#fc4521'];

function Home() {

  const { status, chainId, connect, switchChain } = useMetaMask();

  const handleConnect = async () => {
    if (status == 'unavailable') {
      window.open('https://metamask.io/', '_blank');
    } else if (status == 'notConnected') {
      await connect();
    } else if (status == 'connected') {
      await switchChain('0x' + CHAIN_ID.toString(16));
    }
  };

  const button = status == 'unavailable' ? 
`/'''''''''''''''''''''''''''\\
| INSTALL METAMASK TO ENTER |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,/` : status == 'connected' ?
`/'''''''''''''''''''''''''\\
| SWITCH CHAIN TO POLYGON |
\\,,,,,,,,,,,,,,,,,,,,,,,,,/` :
`/''''''''''''''''''''''''''\\
| CONNECT WALLET AND ENTER |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,/`;
  const button2 = status == 'unavailable' ?
`/''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\\
| NOW STOP FUCKING AROUND YOU DAMN DEGEN AND INSTALL METAMASK! |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/`  : status == 'connected' ?
`/'''''''''''''''''''''''''\\
| SWITCH CHAIN TO POLYGON |
\\,,,,,,,,,,,,,,,,,,,,,,,,,/` :
`/'''''''''''''''''''''''''''''''''''''''''''''''''''''''\\
| NOW STOP FUCKING AROUND YOU DAMN DEGEN AND GO INSIDE! |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/`;

  const game = `/'''''''''''''''\\
| ENTER DUNGEON |
\\,,,,,,,,,,,,,,,/`;
  const token = `/'''''''''''\\
| TOKEN ICO |
\\,,,,,,,,,,,/`

  return (
    <div style={{ color: '#ffd480', fontFamily: 'monospace' }}>
      <Title />
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <p style={{ color: '#ff2222' }}>- This is NOT another fucking ponzi crap. -</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <div>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> NO ERC20: ALL play money in 100% LIQUID MATIC</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> NO CONTRACT OWNER!</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$--</span> 90% of the money is given back as in game rewards</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$--</span> 10% of the money goes to $DUNG hodlers</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ABSOLUTELY ultra solid tamper resistant randomness</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> CHECK the fucking contract!!! It's not that hard...</p>
        </div>
      </div>
      {(status != 'connected' || chainId != CHAIN_ID) && <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleConnect}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {button}
          </pre>
        </a>
      </div>}
      {(status == 'connected' && chainId == CHAIN_ID) && <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="/game" style={{ textDecoration: 'none', color: rarityColor[3], marginRight: '12px' }}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {game}
          </pre>
        </a>
        <a href="/token" style={{ textDecoration: 'none', color: rarityColor[3], marginLeft: '12px' }}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {token}
          </pre>
        </a>
      </div>}
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <div>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+--- How does this work? Well... it's very simple. </p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Click on the 2D dungeon to enter inside.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| There are 5 kind of rooms: wood, iron, golden, diamond and mythic.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| You need the respective kind of key to open a room.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When someone opens a room, all the 4 adjacent are randomly generated (if not already).</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When YOU open a room, you get guaranteed LOOT, which you sell to the game merchant for MATIC.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| IN ADDITION, you have 10% chance of getting a key for the rarer kind of room.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| The wood keys are not found inside and you have to buy from merchant for 11 MATIC.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Half of that money will stay in the contract for rewards, half goes to $DUNG hodlers.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Moving inside the dungeon costs a super small amount of MATIC as well.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| There are ONLY 4 <span style={{ color: rarityColor[4] }}>MYTHIC</span> rooms, which are already spawned.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When you open a mythic room, you become an OPENER. You don't get anything right away. BUT...</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When the 4th mythic room is opened, each OPENER gets 20% of the WHOLE contract value,</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| $DUNG hodlers get 20% as well, the game ends and the CHAPTER 2 BEGINS!</p>
        </div>
      </div>
      {(status != 'connected' || chainId != CHAIN_ID) && <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleConnect}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {button2}
          </pre>
        </a>
      </div>}
    </div>

  );
}

export default Home;
