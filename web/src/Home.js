import React from 'react';
import backgroundImage from './images/landing4.png';
import './Landing.css';
import { useMetaMask } from "metamask-react";
import { CHAIN_ID } from './constants';

function Home() {

  const { status, connect, switchChain, chainId } = useMetaMask();

  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      if (status == 'unavailable') {
        window.open('https://metamask.io/', '_blank');
      } else if (status == 'notConnected') {
        await connect();
      } else if (status == 'connected') {
        await switchChain('0x' + CHAIN_ID.toString(16));
      }
    } catch (e) {
      console.error(e);
    }
  };
  const button = status == 'unavailable' ? 'INSTALL METAMASK TO ENTER' : status == 'connected' ?
    'SWITCH CHAIN TO POLYGON' : 'CONNECT WALLET AND ENTER';

  return (
    <div>
      <div className="hero-section " style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className='test-section'>
          <h1 className='hero-heading'>$DUNGeon Islands</h1>
          <p className='hero-subheading '>We are starting the biggest treasure hunt crypto degens have ever seen. $100M.</p>
        </div>
        <div>
          <p className='hero-downheading code-font'>Scroll down to enter "Chapter 1: East Blue" & find the $2M Payout.</p>
        </div>
      </div>
      <div className="content-section">

        <div className="game-info">
          <h2 className='game-heading'>GAME:</h2>
          <div className="info-block">
            <p className='code-font'>To start, buy a bronze key from the merchant island (0.M). (Your location is marked on the map with: O.`{'>'}`).<br></br> <br></br>
              Next, loot other islands to find items or keys to higher-value islands. (Already looted islands marked with borders.) <br></br> <br></br>
              Island keys are unlocked in order: Bronze, Silver, Gold, Diamond, Mythic. (Small Matic fee to move between islands.)<br></br> <br></br>
              If you find the Diamond Key to access a Mythic Room you get 1/5 of the MEGA Payout. (Payouts happen post-opening all Mythic Rooms and Chapter 2 "West Blue" starts.)
            </p>
          </div>


          <div className="start-game">
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              {(status != 'connected' || chainId != CHAIN_ID) && <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className='game-heading-btn' onClick={handleConnect}>
                  {button}
                </button>
              </div>}
              {(status == 'connected' && chainId == CHAIN_ID) && <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className='game-heading-btn' onClick={() => window.location.href = '/game'}>
                  ENTER DUNGEON
                </button>
              </div>}
            </div>
          </div>
        </div>

        <div className="game-info game-info-2">
          <h2 className='ico-heading'>ICO:</h2>
          <div className="info-block">

            <p className='code-font'>Every Chapter $DUNG Token holders will get 20% of the Final Payout. (Final Chapter "Grand Line" Payout will be around $100M)<br></br> <br></br>
              This game is the first of its kind, as it is fully on-chain game and with tamper-proof randomness. (Don't trust, verify contract here.)<br></br> <br></br>
              To get the $DUNG token, participate in our ICO. Only 30% will be fairly distributed, not more. <br></br> <br></br>
              We've been around since the DOOM era and launched many of the OG' ICO projects in crypto. This will be our best one yet. (The biggest tresure hunt crypto has ever seen).<br></br> <br></br> </p>
          </div>




          <div className="start-game">
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              {(status != 'connected' || chainId != CHAIN_ID) && <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className='ico-heading-btn' onClick={handleConnect}>
                  {button}
                </button>
              </div>}
              {(status == 'connected' && chainId == CHAIN_ID) && <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button className='ico-heading-btn' onClick={() => window.location.href = '/token'}>
                  TOKEN ICO
                </button>
              </div>}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};


export default Home;