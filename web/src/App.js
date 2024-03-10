import React, { useState, useEffect } from 'react';

function renderAsciiBlocks(dungeonMap) {
  let string = "";
  for (let row = 0; row < dungeonMap.length; row++) {
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      for (let col = 0; col < dungeonMap[row].length; col++) {
        const cell = dungeonMap[row][col];
        let asciiBlock;
        if (!cell.found) {
          asciiBlock = '    ';
        } else if (cell.open) {
          if (rowIndex == 0) {
            asciiBlock = '####';
          } else if (rowIndex == 1) {
            asciiBlock = '#  #';
          } else {
            asciiBlock = '####';
          }
        } else {
          if (rowIndex == 0) {
            asciiBlock = '    ';
          } else if (rowIndex == 1) {
            asciiBlock = ' ## ';
          } else {
            asciiBlock = '    ';
          }
        }
        if (cell.rarity === 0) {
          asciiBlock = asciiBlock.replace(/#/g, `<span style="color: brown">#</span>`);
        } else if (cell.rarity === 1) {
          asciiBlock = asciiBlock.replace(/#/g, `<span style="color: grey">#</span>`);
        }
        string += asciiBlock;
      }
      string += '\n';
    }
  }
  return string;
}

// Sample dungeon map
const sampleDungeonMap = [
  [{ found: false }, { found: false }, { found: true, open: false, rarity: 0 }, { found: false }, { found: false }],
  [{ found: false }, { found: false }, { found: true, open: true, rarity: 1 }, { found: false }, { found: false }],
  [{ found: false }, { found: true, open: false, rarity: 0 }, { found: true, open: true, rarity: 0 }, { found: true, open: false, rarity: 1 }, { found: false }],
  [{ found: false }, { found: false }, { found: true, open: false, rarity: 0 }, { found: false }, { found: false }],
];

// React component to render dungeon map
function DungeonMap() {

  return (
    <div style={{ width: '50vw', height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
      <pre style={{ fontFamily: 'monospace' }} dangerouslySetInnerHTML={{__html: renderAsciiBlocks(sampleDungeonMap)}}>
      </pre>
    </div>
  );
}

// App component
function App() {
  return (
    <div>
      <h1>Dungeon Map</h1>
      <DungeonMap />
    </div>
  );
}

export default App;
