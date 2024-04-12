// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

contract MergeSort {
    function sort(
        uint256[] memory unsorted
    ) public pure returns (uint256[] memory) {
        if (unsorted.length < 2) {
            return unsorted;
        }
        uint256 m = unsorted.length / 2;
        uint256[] memory leftUnsorted = new uint256[](m);
        uint256[] memory rightUnsorted = new uint256[](unsorted.length - m);
        for (uint256 l = 0; l < m; l++) {
            leftUnsorted[l] = unsorted[l];
        }
        for (uint256 r = 0; r < unsorted.length - m; r++) {
            rightUnsorted[r] = unsorted[m + r];
        }

        uint256[] memory leftSorted = sort(leftUnsorted);
        uint256[] memory rightSorted = sort(rightUnsorted);
        uint256[] memory sorted = new uint256[](unsorted.length);

        uint256 li = 0;
        uint256 ri = 0;
        uint256 ui = 0;
        while (li < leftSorted.length || ri < rightSorted.length) {
            if (li == leftSorted.length) {
                sorted[ui++] = rightSorted[ri++];
                continue;
            } else if (ri == rightSorted.length) {
                sorted[ui++] = leftSorted[li++];
                continue;
            }

            if (leftSorted[li] < rightSorted[ri]) {
                sorted[ui++] = leftSorted[li++];
            } else {
                sorted[ui++] = rightSorted[ri++];
            }
        }

        return sorted;
    }
}
