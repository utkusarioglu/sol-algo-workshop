// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

library KeysLib {
    function getKey(uint256 self, uint256 digit) public pure returns (uint256) {
        return (self / (10 ** digit)) % 10;
    }

    function uint2str(uint256 self) internal pure returns (string memory) {
        if (self == 0) {
            return "0";
        }
        uint256 j = self;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (self != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(self - (self / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            self /= 10;
        }
        return string(bstr);
    }
}

library ArrayLib {
    using KeysLib for uint;

    function getMaxDigit(uint256[] memory self) public pure returns (uint256) {
        uint256 maxDigit = 0;
        for (uint256 i = 0; i < self.length; i++) {
            uint256 current = self[i];
            uint256 currentDigit = 0;
            while (current > 0) {
                current /= 10;
                currentDigit++;
            }
            maxDigit = currentDigit > maxDigit ? currentDigit : maxDigit;
        }
        return maxDigit;
    }

    function init(
        uint256 size,
        uint256 value
    ) public pure returns (uint256[] memory) {
        uint256[] memory initialized = new uint256[](size);
        for (uint256 i = 0; i < size; i++) {
            initialized[i] = value;
        }
        return initialized;
    }

    function rollingSum(
        uint256[] memory self
    ) public pure returns (uint256[] memory) {
        for (uint256 i = 1; i < self.length; i++) {
            self[i] += self[i - 1];
        }
        return self;
    }

    function print(uint256[] memory self, string memory name) public pure {
        string memory SEP = "--";

        string memory begin = SEP;
        begin = string.concat(begin, name);
        begin = string.concat(begin, SEP);
        console.log(begin);

        string memory list;
        for (uint256 i = 0; i < self.length; i++) {
            if (i != 0) {
                list = string.concat(list, ", ");
            }
            // string memory value = string(abi.encode(self[i]));
            string memory value = self[i].uint2str();
            list = string.concat(list, value);
        }
        console.log(list);

        string memory end = SEP;
        end = string.concat(end, "end");
        end = string.concat(end, SEP);
        console.log(end);
    }
}

contract RadixSort {
    using ArrayLib for uint256[];
    using KeysLib for uint256;

    function sort(
        uint256[] memory sorted
    ) public pure returns (uint256[] memory) {
        if (sorted.length < 2) {
            return sorted;
        }
        uint256 maxDigit = sorted.getMaxDigit();
        // uint256[] memory newSort = new uint256[](sorted.length);
        uint256[] memory newSort = ArrayLib.init(sorted.length, 0);

        for (uint256 d = 0; d < maxDigit; d++) {
            uint256[] memory counts = ArrayLib.init(10, 0);
            for (uint256 si = 0; si < sorted.length; si++) {
                uint256 cKey = sorted[si].getKey(d);
                counts[cKey] += 1;
            }
            counts = counts.rollingSum();
            counts.print("Counts");
            for (uint256 pos = sorted.length; pos > 0; pos--) {
                console.log("--");
                console.log("d", d);
                console.log("pos", pos);
                uint256 si = pos - 1;
                console.log("si", si);
                uint256 value = sorted[si];
                console.log("value", value);
                uint256 key = value.getKey(d);
                console.log("key", key);
                uint256 ni = --counts[key];
                console.log("ni", ni);
                newSort[ni] = value;
            }
            sorted = newSort;
        }

        return sorted;
    }
}
