import React, { useEffect, useState } from 'react';
import { useMetaMask } from "metamask-react";
import { ethers } from 'ethers';


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

  const { status, connect, account, chainId, ethereum } = useMetaMask();

  const [position, setPosition] = useState([0, 0]);
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
  }

  function generateDungeon() {
    const { top, bottom, left, right } = dungeonLimits;
    const result = [];
    for (let i = 0; i <= top-bottom; i++) {
      const row = [];
      for (let j = 0; j <= right-left; j++) {
        const code = serializedDungeon[i][j];
        const x = i + bottom;
        const y = j + left;
        if (code == 0) {
          row.push({ found: false, x, y });
        } else {
          row.push({ found: true, open: code > 4, rarity: (code-1) % 4, x, y });
        }
      }
      result.push(row);
    }
    return result;
  }

  function renderAsciiBlocks(dungeonMap) {
    const chars = 4 + Math.max(dungeonMap[0][0].x.toString().length, dungeonMap[0][0].y.toString().length, dungeonMap[dungeonMap.length - 1][dungeonMap[0].length - 1].x.toString().length, dungeonMap[dungeonMap.length - 1][dungeonMap[0].length - 1].y.toString().length);
    let string = "";
    for (let row = 0; row < dungeonMap.length; row++) {
      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        for (let col = 0; col < dungeonMap[row].length; col++) {
          const cell = dungeonMap[row][col];
          let asciiBlock;
          if (!cell.found) {
            asciiBlock = ' '.repeat(chars);
          } else if (cell.open) {
            if (rowIndex == 0) {
              asciiBlock = '+' + '-'.repeat(chars-2) + '+';
            } else if (rowIndex <= 2) {
              if (chars % 2) {
                asciiBlock = cell.x === position[0] && cell.y === position[1] ? '|' + ' '.repeat((chars - 3) / 2) + `${rowIndex == 1 ? 'O' : 'X'}` + ' '.repeat((chars - 3) / 2) + '|' : `|${rowIndex == 1 ? 'x' : 'y'}:${(rowIndex == 1 ? cell.x.toString().padEnd(chars - 4, ' ') : cell.y.toString().padEnd(chars - 4, ' '))}|`;
              } else {
                asciiBlock = cell.x === position[0] && cell.y === position[1] ? '|' + ' '.repeat((chars - 4) / 2) + `${rowIndex == 1 ? 'O' : 'X'} ` + ' '.repeat((chars - 4) / 2) + '|' : `|${rowIndex == 1 ? 'x' : 'y'}:${(rowIndex == 1 ? cell.x.toString().padEnd(chars - 4, ' ') : cell.y.toString().padEnd(chars - 4, ' '))}|`;
              }
            } else {
              asciiBlock = '+' + '-'.repeat(chars-2) + '+';
            }
          } else {
            if (rowIndex == 0) {
              asciiBlock = ' '.repeat(chars);
            } else if (rowIndex <= 2) {
              if (chars % 2) {
                asciiBlock = ` ${rowIndex == 1 ? 'x' : 'y'}:${(rowIndex == 1 ? cell.x.toString().padEnd(chars - 4, ' ') : cell.y.toString().padEnd(chars - 4, ' '))} `;
              } else {
                asciiBlock = ` ${rowIndex == 1 ? 'x' : 'y'}:${(rowIndex == 1 ? cell.x.toString().padEnd(chars - 4, ' ') : cell.y.toString().padEnd(chars - 4, ' '))} `;
              }
            } else {
              asciiBlock = ' '.repeat(chars);
            }
          }
          asciiBlock = asciiBlock.replace(/X/g, `<span style="color: #4aff47">></span>`);
          asciiBlock = asciiBlock.replace(/O/g, `<span style="color: #4aff47">o</span>`);
          string += cell.rarity !== undefined ? `<span style="color: ${rarityColor[cell.rarity]}">` + asciiBlock + '</span>' : asciiBlock;
        }
        string += '\n';
      }
    }
    return string;
  }

  return (
    <div>
      <pre style={{ backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }} dangerouslySetInnerHTML={{ __html: renderAsciiBlocks(generateDungeon()) }}>
      </pre>
      <div style={{ color: '#4aff47', backgroundColor: 'black', position: 'absolute', bottom: '10px', right: '10px', fontFamily: 'monospace' }}>
        <p style={{ marginBottom: 0, marginTop: 0 }}>+--------------------------------------------</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| {account}</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Balance: {balance} ARB</p>
        <p style={{ marginBottom: 0, marginTop: 0 }}>| Position: {position[0]}x {position[1]}y</p>
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
