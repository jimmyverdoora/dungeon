import React from 'react';
import backgroundImage from './images/landing.jpg';
import './Landing.css'; 
import { useMetaMask } from "metamask-react";
import { CHAIN_ID } from './constants';
const rarityColor = ['#ad846a', '#b0b0b0', '#ffc247', '#47fffc'];

function LandingPage() {

    const { status, connect, switchChain } = useMetaMask();
  
    const handleConnect = async () => {
      if (status == 'unavailable') {
        window.open('https://metamask.io/', '_blank');
      } else if (status == 'notConnected') {
        await connect();
      } else if (status == 'connected') {
        await switchChain('0x' + CHAIN_ID.toString(16));
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
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,/` : status == 'connected' ?
`/'''''''''''''''''''''''''\\
| SWITCH CHAIN TO POLYGON |
\\,,,,,,,,,,,,,,,,,,,,,,,,,/` :
`/''''''''''''''''''''''''''\\
| CONNECT WALLET AND ENTER |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,/`;
const button2 = status == 'unavailable' ?
`/''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''\\
| FUCKING AROUND YOU DAMN DEGEN, INSTALL METAMASK! |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/`  : status == 'connected' ?
`/'''''''''''''''''''''''''\\
| SWITCH CHAIN TO POLYGON |
\\,,,,,,,,,,,,,,,,,,,,,,,,,/` :
`/'''''''''''''''''''''''''''''''''''''''''''''''''''''''\\
| STOP FUCKING AROUND YOU DAMN DEGEN, GO INSIDE! |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,/`;


  return (
    <div>
      <div className="hero-section " style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className='test-section'>
            <h1 className='hero-heading'>Dungeon Gambling</h1>
            <p className='hero-subheading '>We are starting the biggest treasure hunt crypto degens have ever seen. $100M.</p>
        </div>
        <div>
            <p className='hero-downheading code-font'>Start "Chapter 1" below to get the biggest reward any crypto game has ever given.</p>
        </div>
      </div>
      <div className="content-section">
        
        <div className="game-info">
        <h2>GAME:</h2>
          <div className="info-block">
            <p className='code-font'>To start, buy a wooden key from the merchant island (0.M). (Your location is marked on the map with: O.`{'>'}`).<br></br> <br></br> 
                Start looting other islands to find items or keys to higher-value islands. (Already looted islands marked with borders.) <br></br> <br></br> 
                Island keys are unlocked in order: Bronze, Silver, Gold, Diamond, Mythic. (Small Matic fee to move between islands.)<br></br> <br></br> 
                If you find the Diamond Key to access a Mythic Room you get 1/5 of the MEGA Payout. (Payouts happen post-opening all Mythic Rooms and Chapter 2 "West Blue" starts.)
                </p>
          </div>
          
          
          <div className="start-game">
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleConnect}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px',  }}>
            {button2}
          </pre>
        </a>
      </div>
          </div>
        </div>

        <div className="game-info game-info-2">
            <h2>ICO:</h2>
          <div className="info-block">
            
            <p className='code-font'>Every Chapter $DUNG Token holders will get 20% of the Final Payout. (Final Chapter "Grand Line" Payout will be around $100M)<br></br> <br></br> 
            This game is the first of its kind, as it is fully on-chain game and with tamper-proof randomness. (Don't trust, verify contract here.)<br></br> <br></br>
            To get the $DUNG token, participate in our ICO. Only 30% will be fairly distributed, not more. <br></br> <br></br>
            We've been around since the DOOM era and launched two of the most successful ICO projects in crypto. This will be our best one yet. (The biggest tresure hunt crypto has ever seen).<br></br> <br></br> </p>
          </div>
          
          
          
          
          <div className="start-game">
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleConnect}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', }}>
            {button}
          </pre>
        </a>
      </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};


export default LandingPage;