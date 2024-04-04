// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract Maze {
    function getIndex(uint256 d, uint256 r) private pure returns (uint256) {
        return (d << 12) + r;
    }

    function downRight(
        uint256 down,
        uint256 right
    ) public pure returns (uint256) {
        uint256[] memory memo = new uint[](0x1 << 24);
        uint256 returnIndex = getIndex(down, right);

        for (uint256 d = 0; d < down + 1; d++) {
            memo[getIndex(d, 1)] = 1;
        }
        for (uint256 r = 0; r < right + 1; r++) {
            memo[getIndex(1, r)] = 1;
        }

        for (uint256 d = 2; d < down + 1; d++) {
            for (uint256 r = 2; r < right + 1; r++) {
                uint256 currentIndex = getIndex(d, r);
                uint256 subIndexD = getIndex(d - 1, r);
                uint256 subIndexR = getIndex(d, r - 1);
                memo[currentIndex] = memo[subIndexD] + memo[subIndexR];
            }
        }

        return memo[returnIndex];
    }
}
