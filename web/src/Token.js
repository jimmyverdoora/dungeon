import React, { useState } from 'react';
import { useMetaMask } from "metamask-react";
import Title from './Title';



function Token() {

  const { account } = useMetaMask();
  const [balance, setBalance] = useState(0);
  const [icoValue, setIcoValue] = useState(0);
  const [icoValueTot, setIcoValueTot] = useState(0);

  return (
    <div style={{ color: '#ffd480', fontFamily: 'monospace' }}>
      <Title />
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <div>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+--- WTF? You said no ERC20! </p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Play money is 100% MATIC. The $DUNG token</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| lets you "own" your stake of the game.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| And this is not only for chapter 1 but for</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| all chapters to come. For chapter 1, 10%</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| of all in game money gets distributed to</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| the $DUNG hodlers, increasing the MATIC</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| value in the liquidity pool.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| NOW JOIN THE ICO BEFORE IT ENDS!!!</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large', color: '#4aff47', backgroundColor: 'black', }}>
        <div>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+--- Your position</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| {account}</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Balance: {balance} MATIC</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| ICO value: {balance} MATIC</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------------------------</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Total ICO value locked: {icoValueTot} MATIC</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------------------------</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="/" style={{ textDecoration: 'none', color: '#ffd480' }} >LOCK MATIC</a>{'\u00A0'.repeat(27)}<a href="/" style={{ textDecoration: 'none', color: '#ffd480' }} >BACK</a></p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------------------------</p>
        </div>
      </div>
    </div>
  );
}

export default Token;
