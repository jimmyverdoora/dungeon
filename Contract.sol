pragma solidity 0.8.24;

contract DungeonEngine {
    uint public fee;
    int public top;
    int public bottom;
    int public left;
    int public right;
    uint[11] public lootValue;
    struct Room {
        bool found;
        bool open;
        uint8 rarity;
        address opener;
    }
    struct Position {
        int x;
        int y;
    }
    struct Inventory {
        uint[5] keys;
        uint[11] loot;
    }
    struct OpeningData {
        bool isOpening;
        int x;
        int y;
    }
    mapping(int => mapping(int => Room)) public dungeon; // x y
    mapping(int => uint8[]) public dungeonSerialized;
    // 0 -> not found
    // 1 -> bronze not opened
    // 2 -> silver not opened
    // 3 -> gold not opened
    // 4 -> diamond not opened
    // 5 -> mythic not opened
    // 6 -> bronze opened
    // 7 -> silver opened
    // 8 -> gold opened
    // 9 -> diamond opened
    // 10 -> mythic opened
    mapping(address => bool) public isInside;
    mapping(address => Position) public userPosition;
    mapping(address => Inventory) userInventory;
    mapping(address => OpeningData) public opening;
    mapping(int => mapping(int => uint)) public openingAtBlock;
    uint public totalInside;
    uint public totalRooms;
    uint[4] public lastRarityAt;
    uint8 public mythicKeysDropped;

    address public dungeonToken;

    bool gameOver;

    // for scaling down money requirements on testnet
    uint reducer;

    event NewRoom(int x, int y);
    event RandomNumber(uint8 n);
    event RoomOpened(int x, int y, address opener);
    event KeyFound(address user, uint8 rarity);

    constructor(address _dt, bool _isTestnet) {
        dungeonToken = _dt;
        fee = 11 ether;
        top = 1;
        bottom = -1;
        left = -1;
        right = 1;
        dungeon[-1][0] = Room(true, false, 0, address(0x00));
        dungeon[1][0] = Room(true, false, 0, address(0x00));
        dungeon[0][0] = Room(true, true, 0, address(0x00));
        dungeon[0][1] = Room(true, false, 0, address(0x00));
        dungeon[0][-1] = Room(true, false, 0, address(0x00));
        dungeonSerialized[-1] = [0, 1, 0];
        dungeonSerialized[0] = [1, 6, 1];
        dungeonSerialized[1] = [0, 1, 0];
        totalRooms = 4;
        mythicKeysDropped = 0;
        gameOver = false;
        lootValue = [
            1 ether,
            2 ether,
            5 ether,
            10 ether,
            20 ether,
            50 ether,
            100 ether,
            200 ether,
            500 ether,
            1000 ether,
            2500 ether
        ];
        if (_isTestnet) {
            reducer = 10000;
            userInventory[msg.sender].keys[4] = 4;
        } else {
            reducer = 1;
        }
    }

    modifier mustBeInside() {
        require(isInside[msg.sender], "You have to enter the dungeon first!");
        require(!gameOver, "Game is ended!!!");
        _;
    }

    modifier mustBeAtStart() {
        require(
            userPosition[msg.sender].x == 0 && userPosition[msg.sender].y == 0,
            "Go to the map entrance to buy from merchant!"
        );
        _;
    }

    modifier notOpening() {
        require(
            !opening[msg.sender].isOpening ||
                block.number >
                openingAtBlock[opening[msg.sender].x][opening[msg.sender].y] +
                    256,
            "You are opening a door!"
        );
        opening[msg.sender] = OpeningData(false, 0, 0);
        _;
    }

    function getInventory(address user) public view returns (Inventory memory) {
        return userInventory[user];
    }

    function getDungeonRow(int y) public view returns (uint8[] memory) {
        return dungeonSerialized[y];
    }

    function enter() public {
        if (!isInside[msg.sender]) {
            totalInside += 1;
            userPosition[msg.sender] = Position(0, 0);
        }
        isInside[msg.sender] = true;
    }

    function move(int x, int y) public payable mustBeInside notOpening {
        Position memory start = userPosition[msg.sender];
        uint price = routePrice(start.x, start.y, x, y);
        require(price <= msg.value, "Not enough money provided for moving!");
        require(dungeon[x][y].open, "Cannot go to a closed room!");
        userPosition[msg.sender] = Position(x, y);
    }

    function openRoom(int x, int y) public mustBeInside notOpening {
        require(isAdjacent(msg.sender, x, y), "Must be adjacent to the room!");
        require(!dungeon[x][y].open, "Room is already open!");
        require(dungeon[x][y].found, "Room is not discovered yet!");
        require(
            block.number > openingAtBlock[x][y] + 256,
            "Someone else is already opening this room!"
        );
        require(
            userInventory[msg.sender].keys[dungeon[x][y].rarity] > 0,
            "Key missing!"
        );
        userInventory[msg.sender].keys[dungeon[x][y].rarity] -= 1;
        opening[msg.sender] = OpeningData(true, x, y);
        openingAtBlock[x][y] = block.number;
    }

    function completeOpening() public mustBeInside {
        if (!opening[msg.sender].isOpening) {
            return;
        }
        int x = opening[msg.sender].x;
        int y = opening[msg.sender].y;
        require(
            block.number >= openingAtBlock[x][y] + 40,
            "Must wait 40 blocks before complete opening!"
        );
        if (block.number <= openingAtBlock[x][y] + 256) {
            userPosition[msg.sender] = Position(x, y);
            dungeon[x][y].open = true;
            dungeon[x][y].opener = msg.sender;
            emit RoomOpened(x, y, msg.sender);
            dungeonSerialized[y][uint(x - left)] =
                dungeonSerialized[y][uint(x - left)] +
                5;
            if (dungeon[x][y].rarity == 4) {
                _checkEndGame();
            } else {
                _rewardUser(msg.sender, dungeon[x][y].rarity);
            }
            _discoverVicinity(x, y, msg.sender);
        }
        opening[msg.sender] = OpeningData(false, 0, 0);
    }

    function buyKeys(
        uint number
    ) public payable mustBeInside notOpening mustBeAtStart {
        require(
            msg.value >= (number * fee) / reducer,
            "You have to send enough money to buy the key(s)!"
        );
        payable(dungeonToken).transfer(msg.value / 11);
        userInventory[msg.sender].keys[0] += number;
    }

    function sellLoot() public mustBeInside notOpening mustBeAtStart {
        uint money = 0;
        for (uint8 i = 0; i < 11; i++) {
            money +=
                (userInventory[msg.sender].loot[i] * lootValue[i]) /
                reducer;
            userInventory[msg.sender].loot[i] = 0;
        }
        if (money > 0) {
            payable(msg.sender).transfer(money);
        }
    }

    function isAdjacent(address user, int x, int y) public view returns (bool) {
        Position memory pos = userPosition[user];
        return
            (pos.x == x && (pos.y == y - 1 || pos.y == y + 1)) ||
            (pos.y == y && (pos.x == x - 1 || pos.x == x + 1));
    }

    function routePrice(
        int fromX,
        int fromY,
        int toX,
        int toY
    ) public view returns (uint) {
        return
            ((numDigits(fromX - toX) + numDigits(fromY - toY)) *
                10_000_000_000_000_000) / reducer; // 0.01 MATIC per digit;
    }

    function numDigits(int number) public pure returns (uint8) {
        uint8 digits = 0;
        while (number != 0) {
            number /= 10;
            digits++;
        }
        return digits;
    }

    function _rewardUser(address user, uint8 rarity) private {
        uint8 result = _randomPercentile(
            openingAtBlock[opening[user].x][opening[user].y],
            10
        );
        if (rarity == 3) {
            uint8 limit = mythicKeysDropped < 4 ? uint8(8 - 2 * mythicKeysDropped) : 2;
            if (result < limit) {
                userInventory[user].keys[4] += 1;
                emit KeyFound(user, 4);
            } else {
                userInventory[user].loot[10] += 1;
            }
            return;
        }
        if (result < 10) {
            userInventory[user].loot[3 + 3 * rarity] += 1;
        } else if (result < 30) {
            userInventory[user].loot[2 + 3 * rarity] += 1;
        } else if (result < 60) {
            userInventory[user].loot[1 + 3 * rarity] += 1;
        } else {
            userInventory[user].loot[3 * rarity] += 1;
        }
        if (
            _randomPercentile(
                openingAtBlock[opening[user].x][opening[user].y] + 10,
                10
            ) < 10
        ) {
            userInventory[user].keys[rarity + 1] += 1;
            emit KeyFound(user, rarity + 1);
        }
    }

    function _discoverVicinity(int x, int y, address user) private {
        if (!dungeon[x][y + 1].found) {
            uint8 rarity = abs(x) == 10 && abs(y + 1) == 10
                ? 4
                : _generateRarity(openingAtBlock[x][y] + 20);
            _createRoom(x, y + 1, rarity);
        }
        if (!dungeon[x][y - 1].found) {
            uint8 rarity = abs(x) == 10 && abs(y - 1) == 10
                ? 4
                : _generateRarity(openingAtBlock[x][y] + 25);
            _createRoom(x, y - 1, rarity);
        }
        if (!dungeon[x + 1][y].found) {
            uint8 rarity = abs(x + 1) == 10 && abs(y) == 10
                ? 4
                : _generateRarity(openingAtBlock[x][y] + 30);
            _createRoom(x + 1, y, rarity);
        }
        if (!dungeon[x - 1][y].found) {
            uint8 rarity = abs(x - 1) == 10 && abs(y) == 10
                ? 4
                : _generateRarity(openingAtBlock[x][y] + 35);
            _createRoom(x - 1, y, rarity);
        }
    }

    function _createRoom(int x, int y, uint8 rarity) private {
        dungeon[x][y] = Room(true, false, rarity, address(0x00));
        _expandSerialization(x, y, rarity);
        emit NewRoom(x, y);
    }

    function _expandSerialization(int x, int y, uint8 rarity) private {
        if (y > top) {
            top = y;
            dungeonSerialized[y] = new uint8[](uint(right - left) + 1);
        }

        if (y < bottom) {
            bottom = y;
            dungeonSerialized[y] = new uint8[](uint(right - left) + 1);
        }

        if (x > right) {
            right = x;
            for (int i = top; i >= bottom; i--) {
                dungeonSerialized[i].push(0);
            }
        }

        if (x < left) {
            left = x;
            for (int i = top; i >= bottom; i--) {
                dungeonSerialized[i].push(
                    dungeonSerialized[i][uint(right - left - 1)]
                );
                for (int j = right - 1; j > left; j--) {
                    dungeonSerialized[i][uint(j - left)] = dungeonSerialized[i][
                        uint(j - left - 1)
                    ];
                }
                dungeonSerialized[i][0] = 0;
            }
        }

        dungeonSerialized[y][uint(x - left)] = rarity + 1;
    }

    function _generateRarity(uint startBlock) private returns (uint8) {
        uint8 rarity = 0;
        uint8 result = _randomPercentile(startBlock, 5);
        if (result >= diamond()) {
            rarity = 3;
            lastRarityAt[3] = totalRooms;
        } else if (result >= gold()) {
            rarity = 2;
            lastRarityAt[2] = totalRooms;
        } else if (result >= silver()) {
            rarity = 1;
            lastRarityAt[1] = totalRooms;
        }
        totalRooms += 1;
        return rarity;
    }

    function _checkEndGame() private {
        if (
            dungeon[10][10].open &&
            dungeon[10][-10].open &&
            dungeon[-10][10].open &&
            dungeon[-10][-10].open
        ) {
            uint amount = address(this).balance / 5;            
            payable(dungeon[10][10].opener).transfer(amount);
            payable(dungeon[10][-10].opener).transfer(amount);
            payable(dungeon[-10][10].opener).transfer(amount);
            payable(dungeon[-10][-10].opener).transfer(amount);
            payable(dungeonToken).transfer(amount);
            gameOver = true;
        }
    }

    function diamond() public view returns (uint8) {
        int res = 100 - (((int(totalRooms) - int(lastRarityAt[3])) / 100) - 10);
        return res >= 0 ? uint8(uint(res)) : 0;
    }

    function gold() public view returns (uint8) {
        int res = 100 - (((int(totalRooms) - int(lastRarityAt[2])) / 4) - 25);
        return res >= 0 ? uint8(uint(res)) : 0;
    }

    function silver() public view returns (uint8) {
        int res = 100 - (((int(totalRooms) - int(lastRarityAt[1])) * 5) - 50);
        return res >= 0 ? uint8(uint(res)) : 0;
    }

    function _randomPercentile(
        uint startBlock,
        uint8 len
    ) private returns (uint8) {
        bytes memory b;
        for (uint8 i = 0; i < len; i++) {
            b = bytes.concat(b, blockhash(startBlock + i));
        }
        uint256 preResult = uint256(keccak256(b));
        uint8 result = uint8(preResult % 100);
        emit RandomNumber(result);
        return result;
    }

    function abs(int x) private pure returns (uint) {
        return x >= 0 ? uint(x) : uint(-x);
    }
}
