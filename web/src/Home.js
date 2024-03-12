import React from 'react';
import { useMetaMask } from "metamask-react";


const rarityColor = ['#ad846a', '#b0b0b0', '#ffc247', '#47fffc'];

function Home() {

  const { status, connect } = useMetaMask();

  const handleConnect = async () => {
    if (status == 'unavailable') {
      window.open('https://metamask.io/', '_blank');
    } else if (status == 'notConnected') {
      await connect();
    }
  };


  const text = ` /$$$$$$$                                                                     /$$$$$$                          /$$       /$$ /$$                    
| $$__  $$                                                                   /$$__  $$                        | $$      | $$|__/                    
| $$  \\ $$ /$$   /$$ /$$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$       | $$  \\__/  /$$$$$$  /$$$$$$/$$$$ | $$$$$$$ | $$ /$$ /$$$$$$$   /$$$$$$ 
| $$  | $$| $$  | $$| $$__  $$ /$$__  $$ /$$__  $$ /$$__  $$| $$__  $$      | $$ /$$$$ |____  $$| $$_  $$_  $$| $$__  $$| $$| $$| $$__  $$ /$$__  $$
| $$  | $$| $$  | $$| $$  \\ $$| $$  \\ $$| $$$$$$$$| $$  \\ $$| $$  \\ $$      | $$|_  $$  /$$$$$$$| $$ \\ $$ \\ $$| $$  \\ $$| $$| $$| $$  \\ $$| $$  \\ $$
| $$  | $$| $$  | $$| $$  | $$| $$  | $$| $$_____/| $$  | $$| $$  | $$      | $$  \\ $$ /$$__  $$| $$ | $$ | $$| $$  | $$| $$| $$| $$  | $$| $$  | $$
| $$$$$$$/|  $$$$$$/| $$  | $$|  $$$$$$$|  $$$$$$$|  $$$$$$/| $$  | $$      |  $$$$$$/|  $$$$$$$| $$ | $$ | $$| $$$$$$$/| $$| $$| $$  | $$|  $$$$$$$
|_______/  \\______/ |__/  |__/ \\____  $$ \\_______/ \\______/ |__/  |__/       \\______/  \\_______/|__/ |__/ |__/|_______/ |__/|__/|__/  |__/ \\____  $$
                               /$$  \\ $$                                                                                                   /$$  \\ $$
                              |  $$$$$$/                                                                                                  |  $$$$$$/
                               \\______/                                                                                                    \\______/ `;
  const button = status == 'unavailable' ? 
`/'''''''''''''''''''''''''''\\
| INSTALL METAMASK TO ENTER |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,/` :
`/''''''''''''''''''''''''''\\
| CONNECT WALLET AND ENTER |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,/`;
  const button2 = status == 'unavailable' ?
`/''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\\
| NOW STOP FUCKING AROUND YOU DAMN DEGEN AND INSTALL METAMASK! |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/` :
`/'''''''''''''''''''''''''''''''''''''''''''''''''''''''\\
| NOW STOP FUCKING AROUND YOU DAMN DEGEN AND GO INSIDE! |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/`;
  return (
    <div style={{ color: '#ffd480', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <pre style={{ fontSize: 'small', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
          {text}
        </pre>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <p style={{ color: '#ff2222' }}>- This is NOT another fucking ponzi crap. -</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <div>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#ff2222" }}>X</span> NO scammy pump and dump ERC20 tokens</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#ff2222" }}>X</span> NO suspicious proxied contracts</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#ff2222" }}>X</span> NO strange sign message requests</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ALL money in 100% LIQUID GA$$$ (ARB)</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ONLY entering fee goes to me (I need some money to eat)</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ALL other money put inside is given back as rewards</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ABSOLUTELY ultra solid tamper resistant randomness</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> CHECK the fucking contract, it's not that hard...</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleConnect}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {button}
          </pre>
        </a>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <div>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+--- How does this work? Well... it's very simple. </p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| 10 ARB to enter the 2D dungeon.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| There are 4 kind of rooms: wood, iron, golden and diamond.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| You need the respective kind of key to open a room.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When someone opens a room, all the 4 adjacent are randomly generated (if not already).</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When YOU open a room, you get guaranteed LOOT, which you sell to the game merchant for ARB.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| IN ADDITION, you have 10% chance of getting a key for the rarer kind of room.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| The wood keys are not found inside and you have to buy from merchant for 10 ARB.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| That's the main source of money which goes to the merchant (contract).</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Moving inside the dungeon costs a super small amount of ARB as well.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Inside a DIAMOND room, there are no keys or random LOOT...</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| But if you open it, you get FLAT 50% of the WHOLE current contract value.</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleConnect}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {button2}
          </pre>
        </a>
      </div>
    </div>

  );
}

export default Home;
