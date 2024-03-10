pragma solidity 0.8.19;

contract DungeonEngine {

    address public creator;
    uint public fee;
    uint public top;
    uint public bottom;
    uint public left;
    uint public right;
    uint[10] public lootValue;
    struct Room {
        bool found;
        bool open;
        uint8 rarity;
    }
    struct Position {
        int x;
        int y;
    }
    struct Inventory {
        uint[4] keys;
        uint[10] loot;
    }
    struct OpeningData {
        bool isOpening;
        uint atBlock;
        int x;
        int y;
    }
    mapping(int => mapping(int => Room)) dungeon; // x y
    mapping(address => bool) isInside;
    mapping(address => Position) userPosition;
    mapping(address => Inventory) userInventory;
    mapping(address => OpeningData) opening;
    uint public totalInside;
    uint public totalRooms;
    uint[4] public lastRarityAt;

    event NewRoom(int x, int y);

    constructor() {
        creator = msg.sender;
        fee = 100 finney;
        top = 1;
        bottom = -1;
        left = -1;
        right = 1;
        dugeon[-1][0] = { true, false, 0 };
        dugeon[1][0] = { true, false, 0 };
        dugeon[0][1] = { true, false, 0 };
        dugeon[0][-1] = { true, false, 0 };
        totalRooms = 4;
        lootValue = [10 finney, 20 finney, 50 finney, 100 finney, 200 finney, 500 finney, 1 ether, 2 ether, 5 ether, 10 ether];
    }

    modifier mustBeInside {
        require(isInside[msg.sender], "You have to enter the dungeon first!");
        _;
    }

    modifier mustBeAtStart {
        require(userPosition[user].x == 0 && userPosition[user].y == 0, "Go to the map entrance to buy from merchant!");
        _;
    }

    modifier notOpening {
        require(!opening[msg.sender].isOpening, "You are opening a door!");
        _;
    }

    function enter() public payable {
        require(msg.value >= fee, "Pay 0.1 SOL to enter the dungeon!");
        payable(creator).transfer(msg.value);
        if (!isInside[msg.sender]) {
            totalInside += 1;
            userPosition[msg.sender] = { 0, 0 };
        }
        isInside[msg.sender] = true;
    }

    function move(int x, int y) public payable mustBeInside notOpening {
        start = userPosition[msg.sender]
        price = routePrice(start.x, start.y, x, y);
        require(price <= msg.value, "Not enough money provided for moving!");
        require(dungeon[x][y].open, "Cannot go to a closed room!");
        userPosition[msg.sender] = { x, y };
    }

    function openRoom(int x, int y) public mustBeInside notOpening {
        require(isAdjacent(msg.sender, x, y), "Must be adjacent to the room!");
        require(userInventory[msg.sender].keys[dungeon[x][y].rarity] > 0, "Key missing!");
        userInventory[msg.sender].keys[dungeon[x][y].rarity] -= 1;
        userPosition[msg.sender] = { x, y };
        dungeon[x][y].open = true;
        opening[msg.sender] = { true, block.number, x, y };
    }

    function completeOpening() public mustBeInside {
        if (!opening[msg.sender].isOpening) {
            return;
        }
        require(block.number >= opening[msg.sender].atBlock + 40, "Must wait 40 blocks before complete opening!");
        if (block.number <= opening[msg.sender].atBlock + 256) {
            _rewardUser(msg.sender, dungeon[x][y].rarity);
            _discoverVicinity(opening[msg.sender].x, opening[msg.sender].y, msg.sender);
        }
        opening[msg.sender] = { false, 0, 0, 0 };
    }

    function buyKeys(uint number) public payable mustBeInside mustBeAtStart {
        require(msg.value >= number * fee, "You have to send enough money to buy the key(s)!");
        userInventory[msg.sender].keys[0] += number;
    }

    function sellLoot() public mustBeInside mustBeAtStart {
        uint memory money = 0;
        for (uint8 i = 0; i < 10; i++) {
            money += userInventory[msg.sender].loot[i] * lootValue[i];
            userInventory[msg.sender].loot[i] = 0;
        }
        if (money > 0) {
            payable(msg.sender).transfer(money);
        }
    }

    function isAdjacent(address user, int x, int y) public returns(bool) {
        pos = userPosition[user];
        return (pos.x == x && (pos.y == y - 1 || pos.y == y + 1)) || (pos.y == y && (pos.x == x - 1 || pos.x == x + 1));
    }

    function routePrice(int fromX, int fromY, int toX, int toY) public returns(uint) {
        return 0;
    }

    function _rewardUser(address user, uint8 rarity) private {
        if (rarity == 3) {
            payable(user).transfer(address(this).balance / 2);
            return;
        }
        result = _randomPercentile(opening[user].atBlock, 10);
        if (result < 10) {
            userInventory[user].loot[3 + 3 * rarity] += 1;
        } else if (result < 30) {
            userInventory[user].loot[2 + 3 * rarity] += 1;
        } else if (result < 60) {
            userInventory[user].loot[1 + 3 * rarity] += 1;
        } else {
            userInventory[user].loot[3 * rarity] += 1;
        }
        if (_randomPercentile(opening[user].atBlock + 10, 10) < 10) {
            userInventory[user].keys[rarity + 1] += 1;
        }
    }

    function _discoverVicinity(int x, int y, address user) private {
        if (!dungeon[x][y+1].found) {
            rarity = _generateRarity(opening[user].atBlock + 20);
            dungeon[x][y+1] = { true, false, rarity };
            emit NewRoom(x, y+1);
            if (y + 1 > top) {
                top = y + 1;
            }
        }
        if (!dungeon[x][y-1].found) {
            rarity = _generateRarity(opening[user].atBlock + 25);
            dungeon[x][y-1] = { true, false, rarity };
            emit NewRoom(x, y-1);
            if (y - 1 < bottom) {
                bottom = y - 1;
            }
        }
        if (!dungeon[x+1][y].found) {
            rarity = _generateRarity(opening[user].atBlock + 30);
            dungeon[x+1][y] = { true, false, rarity };
            emit NewRoom(x+1, y);
            if (x + 1 > right) {
                right = x + 1;
            }
        }
        if (!dungeon[x-1][y].found) {
            rarity = _generateRarity(opening[user].atBlock + 35);
            dungeon[x-1][y] = { true, false, rarity };
            emit NewRoom(x-1, y);
            if (x - 1 < left) {
                left = x - 1;
            }
        }
    }

    function _generateRarity(uint startBlock) private returns(uint8) {
        uint8 memory rarity = 0;
        uint8 result = _randomPercentile(startBlock, 5);
        if (result >= diamond()):
            rarity = 3;
            lastRarityAt[3] = totalRooms;
        else if (result >= gold()):
            rarity = 2;
            lastRarityAt[2] = totalRooms;
        else if (result >= iron()):
            rarity = 1;
            lastRarityAt[1] = totalRooms;
        totalRooms += 1;
        return rarity;
    }

    function diamond() public returns(uint8) {
        return 100 - (((totalRooms - lastRarityAt[3]) / 100) - 10);
    }

    function gold() public returns(uint8) {
        return 100 - (((totalRooms - lastRarityAt[2]) / 4) - 25);
    }

    function iron() public returns(uint8) {
        return 100 - (((totalRooms - lastRarityAt[1]) * 5) - 50);
    }

    function _randomPercentile(uint startBlock, uint8 len) private returns(uint8) {
        bytes memory b;
        for (uint8 i = 0; i < len; i++) {
            b = bytes.concat(b, blockhash(startBlock + i));
        }
        uint256 memory result = uint256(keccak256(b));
        return uint8(result % 100);
    }
}
