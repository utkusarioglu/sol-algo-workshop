// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "../data-structures/MaxHeap.sol";
import "../data-structures/MinHeap.sol";

contract HeapSort {
    MaxHeap private maxHeap;
    MinHeap private minHeap;
    uint16[] private sorted;
    uint16[] private insertPool;

    constructor(MaxHeap _maxHeapAddress, MinHeap _minHeapAddress) {
        maxHeap = _maxHeapAddress;
        minHeap = _minHeapAddress;
    }

    function insert(uint16 newElement) external {
        insertPool.push(newElement);
        // maxHeap.insert(newElement);
    }

    function sortReverse() external {
        for (uint256 i = 0; i < insertPool.length; i++) {
            maxHeap.insert(insertPool[i]);
        }
        uint256 unsortedLength = maxHeap.getHeapLength();
        for (uint256 i = 0; i < unsortedLength; i++) {
            uint16 head = maxHeap.getHead();
            sorted.push(head);
            maxHeap.popHead();
        }
    }

    function sort() external {
        for (uint256 i = 0; i < insertPool.length; i++) {
            minHeap.insert(insertPool[i]);
        }
        uint256 unsortedLength = minHeap.getHeapLength();
        for (uint256 i = 0; i < unsortedLength; i++) {
            uint16 head = minHeap.getHead();
            sorted.push(head);
            minHeap.popHead();
        }
    }

    function getSorted() external view returns (uint16[] memory) {
        return sorted;
    }
}
