import React, { useEffect, useState } from 'react';
import { useMetaMask } from "metamask-react";
import { ethers } from 'ethers';
import Web3 from 'web3';
import abi from './abi';
import { CONTRACT_ADDRESS, RPC_URL, ENV } from './constants';

const fee = ENV == 'production' ? 10000 : 1; // finney
const rarityColor = ['#ad846a', '#b0b0b0', '#ffc247', '#47fffc'];
const rarityName = ['wood', 'iron', 'golden', 'diamond'];
const lootName = [
  "ByBit referral code",
  "Cardano holder plate",
  "Pepe bone",
  "Shiba tail",
  "Doge fur",
  "Bored ape necklace",
  "Rug-pull protection amulet",
  "El Salvador citizenship",
  "Sam Bankman-Fried cell key",
  "Satoshi Nakamoto picture"
];
const lootValue = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

// React component to render dungeon map
function Dungeon() {

  const { account, chainId, ethereum } = useMetaMask();
  const web3 = new Web3(RPC_URL);
  const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

  const [position, setPosition] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [action, setAction] = useState(null);
  const [info, setInfo] = useState(null);
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState({ keys: [0, 0, 0, 0], loot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
  const [diamondValue, setDiamondValue] = useState(0);
  const [serializedDungeon, setSerializedDungeon] = useState([[0, 1, 0], [1, 5, 1], [0, 1, 0]]);
  const [dungeonLimits, setDungeonLimits] = useState({ top: 1, bottom: -1, left: -1, right: 1 });

  const totalLootValue = inventory.loot.map(n => n * lootValue[n]).reduce((a, b) => a + b, 0);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    const b = await ethereum.request({ method: 'eth_getBalance', params: [account] });
    setBalance(ethers.formatEther(b));
    const isInside = await contract.methods.isInside(account).call();
    if (isInside) {
      const p = await contract.methods.userPosition(account).call();
      setPosition([Number(p.x), Number(p.y)]);
      const inv = await contract.methods.getInventory(account).call();
      setInventory({ keys: inv.keys.map(k => Number(k)), loot: inv.loot.map(k => Number(k)) });
    }
    const cb = await web3.eth.getBalance(CONTRACT_ADDRESS);
    setDiamondValue((Number(Web3.utils.fromWei(cb.toString(), 'finney')) / 2000).toFixed(2));
    setDungeonLimits({
      top: Number(await contract.methods.top().call()),
      bottom: Number(await contract.methods.bottom().call()),
      left: Number(await contract.methods.left().call()),
      right: Number(await contract.methods.right().call()),
    });
    const ser = [];
    for (let idx = dungeonLimits.top; idx >= dungeonLimits.bottom; idx--) {
      const row = await contract.methods.getDungeonRow(idx).call();
      ser.push(row.map(num => Number(num)));
    }
    setSerializedDungeon(ser);
  }

  const isAdjacent = (cell) => {
    return (position[0] == cell.x && (position[1] == cell.y - 1 || position[1] == cell.y + 1)) ||
      (position[1] == cell.y && (position[0] == cell.x - 1 || position[0] == cell.x + 1));
  }

  const hasKey = (cell) => {
    return inventory.keys[cell.rarity] > 0;
  }

  const performAction = async (cell) => {
    if (showShop || action || info) {
      return;
    }
    if (!position) {
      return await enterDungeon();
    }
    if (!cell.found) {
      return;
    }
    if (cell.x === 0 && cell.y === 0) {
      if (position[0] === 0 && position[1] === 0) {
        return setShowShop(true);
      } else {
        return setInfo('MOVE TO THE MERCHANT TO BUY AND SELL!');
      }
    } else if (cell.open && (position[0] !== cell.x || position[0] !== cell.y)) {
      alert("MOVE TO CELL");
    } else if (!cell.open) {
      if (isAdjacent(cell)) {
        if (hasKey(cell)) {
          alert("OPEN!!!!!!!!!!");
        } else {
          return setInfo("YOU NEED A KEY TO OPEN THE ROOM!");
        }
      } else {
        return setInfo("YOU NEED TO MOVE ADJACENT TO A ROOM TO OPEN IT!");
      }
    }
  }

  async function enterDungeon() {
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
    try {
      setAction('Entering dungeon...');
      const hash = await con.methods.enter().send({
        from: account,
        value: Web3.utils.toWei(fee, 'finney')
      });
      console.log(hash);
      loadInfo();
    } catch (e) {
      console.error(e);
    }
    setAction(null);
  }

  async function sellLoot() {
    setShowShop(false);
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
    try {
      setAction('Selling loot...');
      const hash = await con.methods.sellLoot().send({
        from: account
      });
      console.log(hash);
      loadInfo();
    } catch (e) {
      console.error(e);
    }
    setAction(null);
  }

  async function buyKey(num) {
    setShowShop(false);
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
    try {
      setAction('Buying key(s)...');
      const hash = await con.methods.buyKeys(num).send({
        from: account,
        value: Web3.utils.toWei(num * fee, 'finney')
      });
      console.log(hash);
      loadInfo();
    } catch (e) {
      console.error(e);
    }
    setAction(null);
  }

  function generateDungeon() {
    const { top, bottom, left, right } = dungeonLimits;
    const result = [];
    for (let i = 0; i <= top - bottom; i++) {
      const row = [];
      for (let j = 0; j <= right - left; j++) {
        const code = serializedDungeon[i][j];
        const y = top - i;
        const x = j + left;
        if (code == 0) {
          row.push({ found: false, x, y });
        } else {
          row.push({ found: true, open: code > 4, rarity: (code - 1) % 4, x, y });
        }
      }
      result.push(row);
    }
    return result;
  }

  const dungeon = generateDungeon();
  const chars = 4 + Math.max(dungeon[0][0].x.toString().length, dungeon[0][0].y.toString().length, dungeon[dungeon.length - 1][dungeon[0].length - 1].x.toString().length, dungeon[dungeon.length - 1][dungeon[0].length - 1].y.toString().length);

  function renderAsciiBlocks(row) {
    return <div>
      <p style={{ marginBottom: 0, marginTop: 0 }}>{row.map(cell => {
        if (!cell.found) {
          return <span>{'\u00A0'.repeat(chars)}</span>;
        } else if (cell.open) {
          return <span style={{ color: rarityColor[cell.rarity] }}>{'+' + '-'.repeat(chars - 2) + '+'}</span>;
        } else {
          return <span>{'\u00A0'.repeat(chars)}</span>;
        }
      })}</p>
      <p style={{ marginBottom: 0, marginTop: 0 }}>{row.map(cell =>
        <a href="#" style={{ textDecoration: 'none' }} onClick={() => performAction(cell)}>{(() => {
          if (cell.x === 0 && cell.y === 0) {
            if (position && cell.x === position[0] && cell.y === position[1]) {
              return <span style={{ color: rarityColor[cell.rarity] }}>{'|' + '\u00A0'.repeat((chars - (chars % 2 ? 3 : 4)) / 2)}<span style={{ color: '#4aff47' }}>o</span>{'\u00A0'.repeat((chars - (chars % 2 ? 3 : 2)) / 2 - 1)}<span style={{ color: '#ffa347' }}>o</span>|</span>;
            } else {
              return <span style={{ color: rarityColor[cell.rarity] }}>{`|x:${'0'.padEnd(chars - 5, '\u00A0')}`}<span style={{ color: '#ffa347' }}>o</span>|</span>;
            }
          } else if (!cell.found) {
            return <span>{'\u00A0'.repeat(chars)}</span>;
          } else if (cell.open) {
            if (position && cell.x === position[0] && cell.y === position[1]) {
              return <span style={{ color: rarityColor[cell.rarity] }}>{'|' + '\u00A0'.repeat((chars - (chars % 2 ? 3 : 4)) / 2)}<span style={{ color: '#4aff47' }}>o</span>{'\u00A0'.repeat((chars - (chars % 2 ? 3 : 2)) / 2) + '|'}</span>;
            } else {
              return <span style={{ color: rarityColor[cell.rarity] }}>{`|x:${cell.x.toString().padEnd(chars - 4, '\u00A0')}|`}</span>;
            }
          } else {
            return <span style={{ color: rarityColor[cell.rarity] }}>{`\u00A0x:${cell.x.toString().padEnd(chars - 4, '\u00A0')}\u00A0`}</span>;
          }
        })()}
        </a>
      )}</p>
      <p style={{ marginBottom: 0, marginTop: 0 }}>{row.map(cell =>
        <a href="#" style={{ textDecoration: 'none' }} onClick={() => performAction(cell)}>{(() => {
          if (cell.x === 0 && cell.y === 0) {
            if (position && cell.x === position[0] && cell.y === position[1]) {
              return <span style={{ color: rarityColor[cell.rarity] }}>{'|' + '\u00A0'.repeat((chars - (chars % 2 ? 3 : 4)) / 2)}<span style={{ color: '#4aff47' }}>{'>'}</span>{'\u00A0'.repeat((chars - (chars % 2 ? 3 : 2)) / 2 - 1)}<span style={{ color: '#ffa347' }}>M</span>|</span>;
            } else {
              return <span style={{ color: rarityColor[cell.rarity] }}>{`|y:${'0'.padEnd(chars - 5, '\u00A0')}`}<span style={{ color: '#ffa347' }}>M</span>|</span>;
            }
          } else if (!cell.found) {
            return <span>{'\u00A0'.repeat(chars)}</span>;
          } else if (cell.open) {
            if (position && cell.x === position[0] && cell.y === position[1]) {
              return <span style={{ color: rarityColor[cell.rarity] }}>{'|' + '\u00A0'.repeat((chars - (chars % 2 ? 3 : 4)) / 2)}<span style={{ color: '#4aff47' }}>{'>'}</span>{'\u00A0'.repeat((chars - (chars % 2 ? 3 : 2)) / 2) + '|'}</span>;
            } else {
              return <span style={{ color: rarityColor[cell.rarity] }}>{`|y:${cell.y.toString().padEnd(chars - 4, '\u00A0')}|`}</span>;
            }
          } else {
            return <span style={{ color: rarityColor[cell.rarity] }}>{`\u00A0y:${cell.y.toString().padEnd(chars - 4, '\u00A0')}\u00A0`}</span>;
          }
        })()}
        </a>
      )}</p>
      <p style={{ marginBottom: 0, marginTop: 0 }}>{row.map(cell => {
        if (!cell.found) {
          return <span>{'\u00A0'.repeat(chars)}</span>;
        } else if (cell.open) {
          return <span style={{ color: rarityColor[cell.rarity] }}>{'+' + '-'.repeat(chars - 2) + '+'}</span>;
        } else {
          return <span>{'\u00A0'.repeat(chars)}</span>;
        }
      })}</p>
    </div >;
  }

  return (
    <div>
      <div style={{ backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        {dungeon.map(row => renderAsciiBlocks(row))}
      </div>
      {showShop && <div style={{ zIndex: 1, color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Buy wood keys: <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(1)}>1</a> <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(2)}>2</a> <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(5)}>5</a> <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(10)}>10</a> |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: rarityColor[2] }} onClick={() => sellLoot()}>Sell loot</a>{'\u00A0'.repeat(15)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#ff2222' }} onClick={() => setShowShop(false)}>Close shop</a>{'\u00A0'.repeat(14)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-------------------------+</p>
      </div>}
      {action && <div style={{ zIndex: 1, color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(action.length)}-+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {action} |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(action.length)}-+</p>
      </div>}
      {info && <div style={{ zIndex: 1, color: '#ff2222', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(info.length)}-+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {info} |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#ff2222' }} onClick={() => setInfo(null)}>Close</a>{'\u00A0'.repeat(info.length - 4)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(info.length)}-+</p>
      </div>}
      <div style={{ color: rarityColor[3], backgroundColor: 'black', position: 'absolute', top: '10px', right: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| CURRENT DIAMOND DROP: {diamondValue} ARB</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+----------------------------{'-'.repeat(diamondValue.toString().length)}</p>
      </div>
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', bottom: '10px', right: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {account}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Balance: {balance} ARB</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Position: {position ? `${position[0]}x ${position[1]}y` : 'OUTSIDE'}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Keys: {[0, 1, 2, 3].map(n => (<span style={{ color: rarityColor[n] }}> {inventory.keys[n]} </span>))}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n =>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| {lootName[n]}: {inventory.loot[n]}</p>
        )}
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Total loot value: {totalLootValue}</p>
      </div>
    </div>
  );
}

export default Dungeon;
