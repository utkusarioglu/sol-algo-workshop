// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

struct MinElem {
    uint256 index;
    uint16 value;
}

contract SelectionSort {
    function sort(
        uint16[] memory unsorted
    ) public pure returns (uint16[] memory) {
        for (uint256 i = 0; i < unsorted.length - 1; i++) {
            uint16 current = unsorted[i];
            MinElem memory newMin = findMin(unsorted, i);
            unsorted[i] = newMin.value;
            unsorted[newMin.index] = current;
        }
        return unsorted;
    }

    function findMin(
        uint16[] memory arr,
        uint256 startIndex
    ) private pure returns (MinElem memory) {
        uint256 index = startIndex;
        uint16 value = arr[index];
        for (uint256 i = index; i < arr.length; i++) {
            if (arr[i] < value) {
                index = i;
                value = arr[i];
            }
        }
        return MinElem(index, value);
    }
}
