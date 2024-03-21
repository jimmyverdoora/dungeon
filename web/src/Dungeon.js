import React, { useEffect, useState } from 'react';
import { useMetaMask } from "metamask-react";
import Web3 from 'web3';
import abi from './abi/dungeon';
import { CONTRACT_ADDRESS, RPC_URL, ENV } from './constants';

const fee = ENV == 'production' ? 11000000 : 1100; // szabo
const rarityColor = ['#ad846a', '#b0b0b0', '#ffc247', '#47fffc', '#fc4521'];
const rarityName = ['bronze', 'silver', 'golden', 'diamond', 'mythic'];
const lootName = [
  "ByBit referral code",
  "Cryptopunk JPEG",
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

  const { account, ethereum } = useMetaMask();

  const web3 = new Web3(RPC_URL);
  const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

  const [view, setView] = useState({ top: '50%', left: '50%' });
  const step = 100;

  const [totInside, setTotInside] = useState(0);
  const [totRooms, setTotRooms] = useState(0);
  const [news, setNews] = useState("");
  const [newsAt, setNewsAt] = useState(Date.now());
  const [position, setPosition] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [action, setAction] = useState(null);
  const [info, setInfo] = useState(null);
  const [showOpen, setShowOpen] = useState(null);
  const [balance, setBalance] = useState(0);
  const [inventory, setInventory] = useState({ keys: [0, 0, 0, 0, 0], loot: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] });
  const [diamondValue, setDiamondValue] = useState(0);
  const [dungeon, setDungeon] = useState([
    [{ found: false, open: false, x: -1, y: 1 }, { found: true, open: false, x: 0, y: 1, rarity: 0 }, { found: false, open: false, x: 1, y: 1 }],
    [{ found: true, open: false, x: -1, y: 0, rarity: 0 }, { found: true, open: true, x: 0, y: 0, rarity: 0 }, { found: true, open: false, x: 1, y: 0, rarity: 0 }],
    [{ found: false, open: false, x: -1, y: -1 }, { found: true, open: false, x: 0, y: -1, rarity: 0 }, { found: false, open: false, x: 1, y: -1 }]
  ]);
  const totalLootValue = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => inventory.loot[n] * lootValue[n]).reduce((a, b) => a + b, 0);

  useEffect(() => {
    loadInfo(true);
  }, []);

  // useEffect(() => {
  //   let listener;

  //   const setupListener = async () => {
  //     const web3ws = new Web3(RPC_URL_WS);

  //     const currentBlock = await web3ws.eth.getBlockNumber();
  //     const wsContract = new web3ws.eth.Contract(abi, CONTRACT_ADDRESS);
  //     listener = wsContract.events.RoomOpened({ fromBlock: currentBlock });

  //     listener.on("data", (event) => {
  //       console.log(event.returnValues);
  //     });
  //   };

  //   setupListener();

  //   return () => {
  //     if (listener) {
  //       listener.unsubscribe();
  //     }
  //   };
  // }, []);

  const loadInfo = async (atStart = false) => {
    setAction("Loading...");
    await new Promise(r => setTimeout(r, 1000));
    const b = await web3.eth.getBalance(account);
    setBalance((Number(Web3.utils.fromWei(b.toString(), 'ether'))).toFixed(8));
    const cb = await web3.eth.getBalance(CONTRACT_ADDRESS);
    setDiamondValue((Number(Web3.utils.fromWei(cb.toString(), 'finney')) / 1000).toFixed(2));
    const ti = await contract.methods.totalInside().call();
    setTotInside(Number(ti));
    const newLimits = {
      top: Number(await contract.methods.top().call()),
      bottom: Number(await contract.methods.bottom().call()),
      left: Number(await contract.methods.left().call()),
      right: Number(await contract.methods.right().call()),
    };
    const ser = [];
    const padLeft = Math.max(20 + newLimits.left, 0);
    const padRight = Math.max(20 - newLimits.right, 0);
    for (let i = 0; i < 20 - newLimits.top; i++) {
      ser.push(new Array(newLimits.right - newLimits.left + 1 + padLeft + padRight).fill(0));
    }
    for (let idx = newLimits.top; idx >= newLimits.bottom; idx--) {
      const row = await contract.methods.getDungeonRow(idx).call();
      ser.push(new Array(padLeft).fill(0).concat(row.map(num => Number(num))).concat(new Array(padRight).fill(0)));
    }
    for (let i = 0; i < 20 + newLimits.bottom; i++) {
      ser.push(new Array(newLimits.right - newLimits.left + 1 + padLeft + padRight).fill(0));
    }
    setDungeon(generateDungeon(ser, newLimits));
    const isInside = await contract.methods.isInside(account).call();
    if (isInside) {
      const p = await contract.methods.userPosition(account).call();
      setPosition([Number(p.x), Number(p.y)]);
      const inv = await contract.methods.getInventory(account).call();
      if (!atStart) {
        const newLoot = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => Number(inv.loot[i]) > inventory.loot[i])[0];
        const newKey = [0, 1, 2, 3, 4].filter(i => Number(inv.keys[i]) > inventory.keys[i])[0];
        if (newLoot) {
          setInfo(`You found a ${lootName[newLoot]}${newKey ? ` and a ${rarityName[newKey]} key` : ""}!`)
        }
      }
      setInventory({ keys: inv.keys.map(k => Number(k)), loot: inv.loot.map(k => Number(k)) });
    }
    setAction(null);
    const isOpening = await contract.methods.opening(account).call();
    if (!isOpening.isOpening) {
      return;
    }
    const openingAtBlock = Number(await contract.methods.openingAtBlock(isOpening.x, isOpening.y).call());
    let currentBlock = Number(await web3.eth.getBlockNumber());
    if (currentBlock >= openingAtBlock + 256) {
      return;
    }
    while (currentBlock - openingAtBlock <= 41) {
      setAction(`Get ready to send next tx in ${openingAtBlock + 41 - currentBlock} blocks...`);
      await new Promise(r => setTimeout(r, 1000));
      currentBlock = Number(await web3.eth.getBlockNumber());
    }
    setAction(`Sending opening confirmation of ${isOpening.x}x ${isOpening.y}y...`);
    try {
      const gp = await web3.eth.getGasPrice();
      const w3 = new Web3(ethereum);
      const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
      const rec2 = await con.methods.completeOpening().send({
        gasPrice: Math.round(Number(gp) * 1.5).toString(),
        from: account
      });
      console.log(rec2);
      loadInfo();
    } catch (e) {
      console.error(e);
      setAction(null);
    }
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
        return await move(0, 0);
      }
    } else if (cell.open && (position[0] !== cell.x || position[1] !== cell.y)) {
      return await move(cell.x, cell.y);
    } else if (!cell.open) {
      if (isAdjacent(cell)) {
        if (hasKey(cell)) {
          return setShowOpen([cell.x, cell.y]);
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
      const gp = await web3.eth.getGasPrice();
      const receipt = await con.methods.enter().send({
        from: account,
        gasPrice: Math.round(Number(gp) * 1.5).toString(),
      });
      console.log(receipt);
      loadInfo();
    } catch (e) {
      console.error(e);
      setAction(null);
    }
  }

  async function move(x, y) {
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
    try {
      setAction(`Moving to ${x}x ${y}y...`);
      const price = await con.methods.routePrice(position[0], position[1], x, y).call();
      const gp = await web3.eth.getGasPrice();
      const receipt = await con.methods.move(x, y).send({
        from: account,
        gasPrice: Math.round(Number(gp) * 1.5).toString(),
        value: price
      });
      console.log(receipt);
      loadInfo();
    } catch (e) {
      console.error(e);
      setAction(null);
    }
  }

  async function sellLoot() {
    setShowShop(false);
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
    try {
      setAction('Selling loot...');
      const gp = await web3.eth.getGasPrice();
      const receipt = await con.methods.sellLoot().send({
        gasPrice: Math.round(Number(gp) * 1.5).toString(),
        from: account
      });
      console.log(receipt);
      loadInfo();
    } catch (e) {
      console.error(e);
      setAction(null);
    }
  }

  async function buyKey(num) {
    setShowShop(false);
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
    try {
      setAction('Buying key(s)...');
      const gp = await web3.eth.getGasPrice();
      const receipt = await con.methods.buyKeys(num).send({
        from: account,
        gasPrice: Math.round(Number(gp) * 1.5).toString(),
        value: Web3.utils.toWei(num * fee, 'szabo')
      });
      console.log(receipt);
      loadInfo();
    } catch (e) {
      console.error(e);
      setAction(null);
    }
  }

  async function startDoorOpening() {
    const x = showOpen[0];
    const y = showOpen[1];
    setShowOpen(null);
    const w3 = new Web3(ethereum);
    const con = new w3.eth.Contract(abi, CONTRACT_ADDRESS);
    try {
      setAction(`Initiating opening of ${x}x ${y}y...`);
      let gp = await web3.eth.getGasPrice();
      const receipt = await con.methods.openRoom(x, y).send({
        gasPrice: Math.round(Number(gp) * 1.5).toString(),
        from: account
      });
      console.log(receipt);
      let blockNumber = null;
      while (!blockNumber) {
        await new Promise(r => setTimeout(r, 1000));
        const tx = await web3.eth.getTransaction(receipt.transactionHash);
        blockNumber = tx.blockNumber;
      }
      blockNumber = Number(blockNumber);
      console.log('tx mined at block ' + blockNumber);
      let currentBlock = Number(await web3.eth.getBlockNumber());
      while (currentBlock - blockNumber <= 41) {
        setAction(`Get ready to send next tx in ${blockNumber + 41 - currentBlock} blocks...`);
        await new Promise(r => setTimeout(r, 1000));
        currentBlock = Number(await web3.eth.getBlockNumber());
      }
      setAction(`Sending opening confirmation of ${x}x ${y}y...`);
      gp = await web3.eth.getGasPrice();
      const rec2 = await con.methods.completeOpening().send({
        gasPrice: Math.round(Number(gp) * 1.5).toString(),
        from: account
      });
      console.log(rec2);
      loadInfo();
    } catch (e) {
      console.error(e);
      setAction(null);
    }
  }

  function generateDungeon(serializedDungeon, dungeonLimits) {
    let openedRooms = 0;
    let { top, bottom, left, right } = dungeonLimits;
    top = Math.max(top, 20);
    bottom = Math.min(bottom, -20);
    right = Math.max(right, 20);
    left = Math.min(left, - 20);
    const result = [];
    for (let i = 0; i <= top - bottom; i++) {
      const row = [];
      for (let j = 0; j <= right - left; j++) {
        const code = serializedDungeon[i][j];
        const y = top - i;
        const x = j + left;
        if (code == 0) {
          if (Math.abs(x) == 10 && Math.abs(y) == 10) {
            row.push({ found: true, open: false, x, y, rarity: 4 });
          } else {
            row.push({ found: false, x, y });
          }
        } else {
          row.push({ found: true, open: code > 5, rarity: (code - 1) % 5, x, y });
          if (code > 5) {
            openedRooms += 1;
          }
        }
      }
      result.push(row);
    }
    setTotRooms(openedRooms);
    return result;
  }

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

  function moveView(direction) {
    setView(prevPosition => {
      let { top, left } = prevPosition;
      switch (direction) {
        case 'up':
          top = `calc(${top} - ${step}px)`;
          break;
        case 'down':
          top = `calc(${top} + ${step}px)`;
          break;
        case 'left':
          left = `calc(${left} - ${step}px)`;
          break;
        case 'right':
          left = `calc(${left} + ${step}px)`;
          break;
        default:
          return prevPosition;
      }
      return { top, left };
    });
  }

  const topLeftPad = Math.max(totInside.toString().length + 17, totRooms.toString().length + 16, news.length + 2);

  return (
    <div>
      <div style={{ backgroundColor: 'black', position: 'absolute', ...view, transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        {dungeon.map(row => renderAsciiBlocks(row))}
      </div>
      {showShop && <div style={{ zIndex: 1, color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+---------------------------+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Buy bronze keys: <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(1)}>1</a> <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(2)}>2</a> <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(5)}>5</a> <a href="#" style={{ textDecoration: 'none', color: rarityColor[0] }} onClick={() => buyKey(10)}>10</a> |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: rarityColor[2] }} onClick={() => sellLoot()}>Sell loot</a>{'\u00A0'.repeat(17)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#ff2222' }} onClick={() => setShowShop(false)}>Close shop</a>{'\u00A0'.repeat(16)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+---------------------------+</p>
      </div>}
      {action && <div style={{ zIndex: 1, color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(action.length)}-+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {action} |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(action.length)}-+</p>
      </div>}
      {info && <div style={{ zIndex: 1, color: '#ff2222', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(info.length)}-+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {info} |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#ffa347' }} onClick={() => setInfo(null)}>CLOSE</a>{'\u00A0'.repeat(info.length - 4)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+-{'-'.repeat(info.length)}-+</p>
      </div>}
      {showOpen && <div style={{ zIndex: 1, color: '#ff2222', backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+---------------------------------------------------------------------+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <span style={{ color: '#ffa347' }}>WARNING! READ EXTREMELY CAREFULLY!!!!!</span>{'\u00A0'.repeat(30)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| You are about to open cell {showOpen[0]}x {showOpen[1]}y.{'\u00A0'.repeat(37 - showOpen[0].toString().length - showOpen[1].toString().length)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| To grant a tamper-resistant randomness algorithm the contract uses{'\u00A0'.repeat(2)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| multiple calls of the blockhash function. Unfortunately, block{'\u00A0'.repeat(6)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| hashes older than 256 blocks are not accessible. To open a door you{'\u00A0'}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| will need to submit 2 transactions which are mined less than 256{'\u00A0'.repeat(4)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| and more than 40 blocks apart. The dapp will take care of that, you{'\u00A0'}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| just need to do the following: send the 1st transaction. After 40{'\u00A0'.repeat(3)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| blocks (roughly 2 minutes), the metamask pop up will show up again{'\u00A0'.repeat(2)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| asking you to sign and send the 2nd one. You have to send it as{'\u00A0'.repeat(5)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| soon as possible (ideally within a minute should be enough but{'\u00A0'.repeat(6)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| just sign and send as soon as it pops up).{'\u00A0'.repeat(26)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <span style={{ color: '#ffa347' }}>TLDR</span> click below to send the 1st transaction. As soon as you see{'\u00A0'.repeat(4)}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>|{'\u00A0'.repeat(6)}the pop up with the 2nd transaction, sign and send it as well. |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#ffa347' }} onClick={() => startDoorOpening()}>I UNDERSTAND, LET'S OPEN THIS DOOR!</a>{'\u00A0'.repeat(27)}<a href="#" style={{ textDecoration: 'none', color: '#ffa347' }} onClick={() => setShowOpen(null)}>CLOSE</a> |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+---------------------------------------------------------------------+</p>
      </div>}
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '10px', left: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>{'\u00A0'}DEGENS INSIDE: {totInside}{'\u00A0'.repeat(Math.max(1, topLeftPad - totInside.toString().length - 16))}|</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>{'\u00A0'}ROOMS OPENED: {totRooms}{'\u00A0'.repeat(Math.max(1, topLeftPad - totRooms.toString().length - 15))}|</p>
        {news && <p style={{ marginBottom: 0, marginTop: 0 }}>{'\u00A0'}{news} |</p>}
        <p style={{ marginBottom: 0, marginTop: 0 }}>{'-'.repeat(topLeftPad)}+</p>
      </div>
      <div style={{ color: rarityColor[4], backgroundColor: 'black', position: 'absolute', top: '10px', right: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| CURRENT FINAL TREASURE: {diamondValue} MATIC</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------{'-'.repeat(diamondValue.toString().length)}</p>
      </div>
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', bottom: '10px', right: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {account}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Balance: {balance} MATIC</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Position: {position ? `${position[0]}x ${position[1]}y` : 'OUTSIDE'}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Keys: {[0, 1, 2, 3, 4].map(n => (<span style={{ color: rarityColor[n] }}> {inventory.keys[n]} </span>))}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n =>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| {lootName[n]}: {inventory.loot[n]}</p>
        )}
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Total loot value: {totalLootValue} MATIC</p>
      </div>
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', bottom: '10px', left: '50%', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+----+{view.top && view.top.length > 100 && "------+"}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => moveView('up')}>\/</a> | {view.top && view.top.length > 100 && <a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => setView({ top: '50%', left: '50%' })}>BACK |</a>}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+----+{view.top && view.top.length > 100 && "------+"}</p>
      </div>
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '10px', left: '50%', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+----+{view.top && view.top.length > 100 && "------+"}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => moveView('down')}>/\</a> | {view.top && view.top.length > 100 && <a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => setView({ top: '50%', left: '50%' })}>BACK |</a>}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+----+{view.top && view.top.length > 100 && "------+"}</p>
      </div>
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '50%', right: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>{view.left && view.left.length > 150 && "+------"}+---+</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>|{view.left && view.left.length > 150 && <a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => setView({ top: '50%', left: '50%' })}> BACK |</a>}<a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => moveView('left')}>{' >'}</a> |</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>{view.left && view.left.length > 150 && "+------"}+---+</p>
      </div>
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', top: '50%', left: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+---+{view.left && view.left.length > 150 && "------+"}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| <a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => moveView('right')}>{'<'}</a> | {view.left && view.left.length > 150 && <a href="#" style={{ textDecoration: 'none', color: '#4aff47' }} onClick={() => setView({ top: '50%', left: '50%' })}>BACK |</a>}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+---+{view.left && view.left.length > 150 && "------+"}</p>
      </div>
    </div>
  );
}

export default Dungeon;
