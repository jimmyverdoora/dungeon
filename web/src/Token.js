import React, { useState, useEffect } from 'react';
import { useMetaMask } from "metamask-react";
import Title from './Title';
import abi from './abi/ico';
import Web3 from 'web3';
import { ICO_ADDRESS, RPC_URL, TOKEN_ADDRESS } from './constants';


function Token() {

  const { account, ethereum } = useMetaMask();

  const web3 = new Web3(RPC_URL);
  const contract = new web3.eth.Contract(abi, ICO_ADDRESS);

  const [balance, setBalance] = useState(0);
  const [icoValue, setIcoValue] = useState(0);
  const [icoValueTot, setIcoValueTot] = useState(0);
  const [showOpen, setShowOpen] = useState(false);
  const [value, setValue] = useState(100);

  useEffect(() => {
    loadInfo(true);
  }, []);

  const loadInfo = async () => {
    await new Promise(r => setTimeout(r, 1000));
    const b = await web3.eth.getBalance(account);
    setBalance((Number(Web3.utils.fromWei(b.toString(), 'ether'))).toFixed(6));
    const cb = await web3.eth.getBalance(ICO_ADDRESS);
    setIcoValueTot((Number(Web3.utils.fromWei(cb.toString(), 'ether'))).toFixed(2))
    const iv = await contract.methods.getContribution().call({ from: account });
    setIcoValue((Number(Web3.utils.fromWei(iv.toString(), 'ether'))).toFixed(6))
  }

  async function sendValue() {
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, ICO_ADDRESS);
    setTimeout(() => setShowOpen(false), 1000);
    try {
      const gp = await web3.eth.getGasPrice();
      const receipt = await con.methods.buy().send({
        from: account,
        gasPrice: Math.round(Number(gp) * 1.2).toString(),
        value: Web3.utils.toWei(value, 'ether')
      });
      console.log(receipt);
      loadInfo();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div style={{ color: '#ffd480', fontFamily: 'monospace' }}>
      <Title />
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <div>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+--- $DUNG Token ICO - own part of the game.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Each Chapter, $DUNG holders will get ≈30%</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|  of the full payout of the game. </p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Our estimation is a market cap of around </p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| $100M within 6 months and $1B long term.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Get $DUNG, click <span style={{ color: '#fc4521' }}>'LOCK MATIC'</span> below. </p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large', color: '#4aff47', backgroundColor: 'black', }}>
        <div>

          <p style={{ marginBottom: 0, marginTop: 0 }}>+--- Your position</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| {account}</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Balance: {balance} MATIC</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| ICO value: {icoValue} MATIC</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------------------------</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Total ICO value locked: {icoValueTot} MATIC</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------------------------</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#fc4521' }} onClick={() => setShowOpen(true)} >LOCK MATIC</a>{'\u00A0'.repeat(27)}<a href="/" style={{ textDecoration: 'none', color: '#ffd480' }} >BACK</a></p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>|</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------------------------</p>
        </div>
      </div>
      {showOpen && <div style={{ zIndex: 1, color: '#fc4521', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace', fontSize: 'large' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+------------------------------------------------------------+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>|{'\u00A0'.repeat(25)}<span style={{ color: '#ffd480' }}>BUY $DUNG</span>{'\u00A0'.repeat(26)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| 40% of the total supply will be distributed proportionally{'\u00A0'}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| to the ICO participants. Once the limit block is reached,{'\u00A0'.repeat(2)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| all the MATIC locked will be added in the token liquidity{'\u00A0'.repeat(2)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| pool, $DUNG token given out to ICO members and buy/sell{'\u00A0'.repeat(4)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| functionality of $DUNG token enabled. The swap pool is{'\u00A0'.repeat(5)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| embedded inside the token contract.{'\u00A0'.repeat(24)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {'\u00A0'.repeat(58)} |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| TOKEN: <a href={`https://polygonscan.com/token/${TOKEN_ADDRESS.toLowerCase()}`} style={{ textDecoration: 'none', color: '#ffd480' }} >{TOKEN_ADDRESS}</a>{'\u00A0'.repeat(10)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| ICO: <a href={`https://polygonscan.com/address/${ICO_ADDRESS.toLowerCase()}`} style={{ textDecoration: 'none', color: '#ffd480' }} >{ICO_ADDRESS}</a>{'\u00A0'.repeat(12)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>|{'\u00A0'.repeat(60)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>|{'\u00A0'.repeat(22)}<span style={{ color: '#ffd480' }}>+-------------+</span>{'\u00A0'.repeat(23)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>{'\u00A0'.repeat(23)}<span style={{ color: '#ffd480' }}>|</span><input
          type="number"
          style={{ width: '106px', fontFamily: 'monospace', color: '#47fffc', border: 'none', background: 'none', outline: 'none' }}
          value={value}
          onChange={e => setValue(Number(e.target.value))}
          onWheel={() => {}}
          autoFocus={true}
        /><span style={{ color: '#ffd480' }}>{'\u00A0'.repeat(2)}|</span>{'\u00A0'.repeat(22)} </p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>|{'\u00A0'.repeat(22)}<span style={{ color: '#ffd480' }}>+-------------+</span>{'\u00A0'.repeat(23)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {'\u00A0'.repeat(58)} |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#ffd480' }} onClick={() => sendValue()}>LOCK!</a>{'\u00A0'.repeat(48)}<a href="#" style={{ textDecoration: 'none', color: '#ffd480' }} onClick={() => setShowOpen(false)}>CLOSE</a> |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+------------------------------------------------------------+</p>
      </div>}
    </div>
  );
}

export default Token;
