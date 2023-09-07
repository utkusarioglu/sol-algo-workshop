// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

contract MaxHeap {
  uint16[] private heapArray;
  uint256 private heapLength = 0;

  function reorder(uint256 index) private {
    uint256 rightChildIndex = getRightChildIndex(index);
    uint256 leftChildIndex = getLeftChildIndex(index);
    uint256 lastIndex = heapLength - 1 ;
    if (lastIndex < leftChildIndex) {
      return;
    }
    uint16 leftChildValue = heapArray[leftChildIndex];
    uint16 rightChildValue = heapLength < rightChildIndex ? 0 : heapArray[rightChildIndex];
    uint256 largerChildIndex = leftChildValue > rightChildValue ? leftChildIndex : rightChildIndex;
    uint256 largerChildValue = heapArray[largerChildIndex];
    if(largerChildValue > heapArray[index]) {
      swap(largerChildIndex, index);
    } 
    reorder(largerChildIndex); 
  }

  function insert(uint16 newElement) public {
    heapArray.push(newElement);
    heapLength++;
    uint256 currentIndex = heapLength - 1; 
    while(currentIndex > 0) {
      uint256 parentIndex = getParentIndex(currentIndex);
      uint16 currentValue = heapArray[currentIndex];
      uint16 parentValue = heapArray[parentIndex];
      if (parentValue > currentValue) {
        break;
      }
      swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  function swap(uint256 index1, uint256 index2) private {
    uint16 temp = heapArray[index1];
    heapArray[index1] = heapArray[index2];
    heapArray[index2] = temp;
  }

  function getParentIndex(uint256 index) private pure returns(uint256){
    return (index - 1) / 2;
  }

  function getLeftChildIndex(uint256 index) private pure returns(uint256) {
    return index * 2 + 1;
  }

  function getRightChildIndex(uint256 index) private pure returns(uint256) {
    return index * 2 + 2;
  }
  
  function getHead() public view returns (uint16) {
    return heapArray[0];
  }

  function popHead() public {
    uint256 lastIndex = heapLength - 1;
    if(lastIndex == 0) {
      return;
    }
    heapArray[0] = heapArray[lastIndex];
    delete heapArray[lastIndex];
    heapLength--;
    if (heapLength < 2) {
      return;
    }
    reorder(0);
  }
}
