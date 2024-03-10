import React, { useState, useEffect } from 'react';


const rarityColor = ['#ad846a', '#b0b0b0', '#ffc247', '#47fffc'];
const rarityName = ['wood', 'iron', 'golden', 'diamond'];

// Sample dungeon map
const sampleDungeonMap = [
  [{ found: false, x: -2, y: 2 }, { found: false, x: -1, y: 2 }, { found: true, open: false, rarity: 0, x: 0, y: 2 }, { found: false, x: 1, y: 2 }, { found: false, x: 2, y: 2 }],
  [{ found: false, x: -2, y: 1 }, { found: true, open: false, rarity: 0, x: -1, y: 1 }, { found: true, open: true, rarity: 1, x: 0, y: 1 }, { found: true, open: false, rarity: 0, x: 1, y: 1 }, { found: false, x: 2, y: 1 }],
  [{ found: false, x: -2, y: 0 }, { found: true, open: false, rarity: 0, x: -1, y: 0 }, { found: true, open: true, rarity: 0, x: 0, y: 0 }, { found: true, open: false, rarity: 1, x: 1, y: 0 }, { found: false, x: 2, y: 0 }],
  [{ found: false, x: -2, y: -1 }, { found: false, x: -1, y: -1 }, { found: true, open: false, rarity: 0, x: 0, y: -1 }, { found: false, x: 1, y: -1 }, { found: false, x: 2, y: -1 }],
];

// React component to render dungeon map
function DungeonMap() {

  const [position, setPosition] = useState([0, 0]);
  const [inventory, setInventory] = useState({ keys: [0, 0, 0, 0] });

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
              asciiBlock = '#'.repeat(chars);
            } else if (rowIndex <= 2) {
              if (chars % 2) {
                asciiBlock = cell.x === position[0] && cell.y === position[1] ? '#' + ' '.repeat((chars - 3) / 2) + `${rowIndex == 1 ? 'O' : 'X'}` + ' '.repeat((chars - 3) / 2) + '#' : `#${rowIndex == 1 ? 'x' : 'y'}:${(rowIndex == 1 ? cell.x.toString().padEnd(chars - 4, ' ') : cell.y.toString().padEnd(chars - 4, ' '))}#`;
              } else {
                asciiBlock = cell.x === position[0] && cell.y === position[1] ? '#' + ' '.repeat((chars - 4) / 2) + `${rowIndex == 1 ? 'O' : 'X'} ` + ' '.repeat((chars - 4) / 2) + '#' : `#${rowIndex == 1 ? 'x' : 'y'}:${(rowIndex == 1 ? cell.x.toString().padEnd(chars - 4, ' ') : cell.y.toString().padEnd(chars - 4, ' '))}#`;
              }
            } else {
              asciiBlock = '#'.repeat(chars);
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

  function renderInfo() {
    const rows = [];
    rows.push('');
    rows.push('');
    for (let i = 0; i < 4; i++) {
      rows.push(` ${rarityName[i]} keys: ${inventory.keys[i]}`);
    }
    rows.push('');
    const maxChars = Math.max(...rows.map(r => r.length));
    for (let i = 0; i < rows.length; i++) {

      rows[i] = i == 0 ? `<span style="color: #4aff47">${'#'.repeat(maxChars + 3)}</span>` : '<span style="color: #4aff47">#</span>' + rows[i].padEnd(maxChars + 1, ' ') + '<span style="color: #4aff47">#</span>';
    }
    rows.push('<span style="color: #4aff47">' + '#'.repeat(maxChars + 3) + '</span>');
    return rows.join('\n');
  }


  return (
    <div>
      <pre style={{ backgroundColor: 'black', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'monospace' }} dangerouslySetInnerHTML={{ __html: renderAsciiBlocks(sampleDungeonMap) }}>
      </pre>
      <pre style={{ backgroundColor: 'black', position: 'absolute', bottom: '10px', right: '10px', fontFamily: 'monospace' }} dangerouslySetInnerHTML={{ __html: renderInfo() }}>
      </pre>
    </div>
  );
}

// App component
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
      <DungeonMap />
    </div>
  );
}

export default App;
