const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "rarity",
				"type": "uint8"
			}
		],
		"name": "KeyFound",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "NewIsland",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "n",
				"type": "uint8"
			}
		],
		"name": "RandomNumber",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "looter",
				"type": "address"
			}
		],
		"name": "IslandLooted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "number",
				"type": "uint256"
			}
		],
		"name": "buyKeys",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "completeLooting",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "enter",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "move",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "lootIsland",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "sellLoot",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_dt",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "_isTestnet",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "bottom",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "diamond",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"name": "dungeon",
		"outputs": [
			{
				"internalType": "bool",
				"name": "found",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "looted",
				"type": "bool"
			},
			{
				"internalType": "uint8",
				"name": "rarity",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "looter",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "dungeonSerialized",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "dungeonToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "getDungeonRow",
		"outputs": [
			{
				"internalType": "uint8[]",
				"name": "",
				"type": "uint8[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getInventory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256[5]",
						"name": "keys",
						"type": "uint256[5]"
					},
					{
						"internalType": "uint256[10]",
						"name": "loot",
						"type": "uint256[10]"
					}
				],
				"internalType": "struct DungeonEngine.Inventory",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gold",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"name": "isAdjacent",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "isInside",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "lastRarityAt",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "left",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "lootValue",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mythicKeysDropped",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "number",
				"type": "int256"
			}
		],
		"name": "numDigits",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "looting",
		"outputs": [
			{
				"internalType": "bool",
				"name": "isOpening",
				"type": "bool"
			},
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"name": "lootingAtBlock",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "right",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "int256",
				"name": "fromX",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "fromY",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "toX",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "toY",
				"type": "int256"
			}
		],
		"name": "routePrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "silver",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "top",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalInside",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalIslands",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userPosition",
		"outputs": [
			{
				"internalType": "int256",
				"name": "x",
				"type": "int256"
			},
			{
				"internalType": "int256",
				"name": "y",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export default abi;
