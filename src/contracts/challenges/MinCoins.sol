// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

contract MinCoins {
    function minNone(uint256 a, uint256 b) public pure returns (uint256) {
        if (a == 0) {
            return b;
        }
        if (b == 0) {
            return a;
        }
        return a < b ? a : b;
    }

    function minCoins(
        uint256 amount,
        uint256[3] calldata coins
    ) public pure returns (uint256) {
        if (amount == 0) {
            return 0;
        }

        uint256[] memory memo = new uint256[](amount + 1);
        uint256 SHIFT = 0x1 << 255;

        for (uint256 a = 1; a <= amount; a++) {
            for (uint256 c = 0; c < coins.length; c++) {
                if (a < coins[c]) {
                    continue;
                }
                uint256 subAmount = a - coins[c];
                uint256 min = minNone(memo[a], memo[subAmount] + 1) | SHIFT;
                memo[a] = min;
            }
        }

        return memo[amount] & ~SHIFT;
    }

    function waysCoins(
        uint256 amount,
        uint256[3] calldata coins
    ) public pure returns (uint256) {
        uint256[] memory memo = new uint256[](amount + 1);
        memo[0] = 1;

        for (uint256 a = 1; a <= amount; a++) {
            for (uint256 c = 0; c < coins.length; c++) {
                if (a < coins[c]) {
                    continue;
                }
                uint256 subAmount = a - coins[c];
                uint256 min = memo[a] + memo[subAmount];
                memo[a] = min;
            }
        }
        return memo[amount];
    }
}
