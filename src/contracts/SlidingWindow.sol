// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

contract SlidingWindow {
    function smallestSum(
        uint256[] calldata list,
        uint256 windowSize
    ) public pure returns (uint256) {
        uint256 smallest;
        for (uint256 i = 0; i < windowSize; i++) {
            smallest = smallest + list[i];
        }
        for (uint256 i = 1; i < list.length - windowSize; i++) {
            uint256 drop = i - 1;
            uint256 add = i + windowSize - 1;
            uint256 current = smallest - list[drop] + list[add];
            if (current < smallest) {
                smallest = current;
            }
        }
        return smallest;
    }

    function smallestRange(
        int256[] calldata list,
        int256 target
    ) public pure returns (uint256[] memory) {
        uint256[] memory range = new uint256[](2);
        range[1] = list.length;

        int256 currentSum = 0;
        uint256 start = 0;
        uint256 end = 0;

        while (end < list.length) {
            currentSum += list[end];
            end++;

            while (start < end && currentSum >= target) {
                currentSum -= list[start];
                start++;

                if (range[1] - range[0] > end - start) {
                    range[0] = start - 1;
                    range[1] = end - 1;
                }
            }
        }

        return range;
    }
}
