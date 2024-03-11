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

function Home() {

  const handleClick = () => { };
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
  const button = `/''''''''''''''''''''''''''\\
| CONNECT WALLET AND ENTER |
\\,,,,,,,,,,,,,,,,,,,,,,,,,,/`;
  const button2 = `/'''''''''''''''''''''''''''''''''''''''''''''''''''''''\\
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
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ALL money in 100% LIQUID GA$$$ (SOL)</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ONLY entering fee goes to me (I need some money to eat)</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ALL other money put inside is given back as rewards</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> ABSOLUTELY ultra solid tamper resistant randomness</p>
          <p style={{ marginBottom: '2px', marginTop: 0 }}><span style={{ color: "#4aff47" }}>$</span> CHECK the fucking contract, it's not that hard...</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleClick}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {button}
          </pre>
        </a>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', fontSize: 'large' }}>
        <div>
          <p style={{ marginBottom: 0, marginTop: 0 }}>+--- How does this work? Well... it's very simple. </p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| 0.1 SOL to enter the 2D dungeon.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| There are 4 kind of rooms: wood, iron, golden and diamond.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| You need the respective kind of key to open a room.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When someone opens a room, all the 4 adjacent are randomly generated (if not already).</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| When YOU open a room, you get guaranteed LOOT, which you sell to the game merchant for SOL.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| IN ADDITION, you have 10% chance of getting a key for the rarer kind of room.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| The wood keys are not found inside and you have to buy from merchant for 0.1 SOL.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| That's the main source of money which goes to the merchant (contract).</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Moving inside the dungeon costs a super small amount of SOL as well.</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| Inside a DIAMOND room, there are no keys or random LOOT...</p>
          <p style={{ marginBottom: 0, marginTop: 0 }}>| But if you open it, you get FLAT 50% of the WHOLE current contract value.</p>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href="#" style={{ textDecoration: 'none', color: rarityColor[3] }} onClick={handleClick}>
          <pre style={{ fontSize: 'large', marginLeft: 'auto', marginRight: 'auto', marginTop: 0, paddingTop: '24px', marginBottom: '24px', backgroundColor: 'black' }}>
            {button2}
          </pre>
        </a>
      </div>
    </div>
    
  );
}

// App component
function App() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: 'black' }}>
      <Home />
      {/* <DungeonMap /> */}
    </div>
  );
}

export default App;
