// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract Heap {
    uint16[] internal heapArray;
    uint256 internal heapLength = 0;

    function swap(uint256 index1, uint256 index2) internal {
        uint16 temp = heapArray[index1];
        heapArray[index1] = heapArray[index2];
        heapArray[index2] = temp;
    }

    function getParentIndex(uint256 index) internal pure returns (uint256) {
        return (index - 1) / 2;
    }

    function getLeftChildIndex(uint256 index) internal pure returns (uint256) {
        return index * 2 + 1;
    }

    function getRightChildIndex(uint256 index) internal pure returns (uint256) {
        return index * 2 + 2;
    }

    function getLastIndex() internal view returns (uint256) {
        return heapLength - 1;
    }
}
