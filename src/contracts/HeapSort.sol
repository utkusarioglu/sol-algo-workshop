// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./MaxHeap.sol";

contract HeapSort {
  MaxHeap private maxHeap;
  uint16[] private sorted;

  constructor(MaxHeap _maxHeap) {
    maxHeap = _maxHeap;
  }

  function insert(uint16 newElement) external {
    maxHeap.insert(newElement);
  }

  function sortReverse() external {
    uint256 unsortedLength = maxHeap.getHeapLength();
    for(uint256 i = 0; i < unsortedLength; i++) {
      uint16 head = maxHeap.getHead();
      sorted.push(head);
      maxHeap.popHead();
    }
  }

  function sort() external {
    uint256 unsortedLength = minHeap.getHeapLength();
    for(uint256 i = 0; i < unsortedLength; i++) {
      uint16 head = minHeap.getHead();
      sorted.push(head);
      minHeap.popHead();
    }
  }

  function getSorted() external view returns(uint16[] memory) {
    return sorted;
  }
}
