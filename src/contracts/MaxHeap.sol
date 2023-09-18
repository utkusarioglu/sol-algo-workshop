// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./IHeap.sol";
import "./Heap.sol";

contract MaxHeap is Heap, IHeap {
    function insert(uint16 newElement) external {
        heapArray.push(newElement);
        heapLength++;
        uint256 currentIndex = heapLength - 1;
        while (currentIndex > 0) {
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

    function getHead() external view returns (uint16) {
        return heapArray[0];
    }

    function getHeapLength() external view returns (uint256) {
        return heapLength;
    }

    function popHead() external {
        if (heapLength < 1) {
            return;
        }
        uint256 lastIndex = heapLength - 1;
        if (lastIndex != 0) {
            heapArray[0] = heapArray[lastIndex];
        }
        delete heapArray[lastIndex];
        heapLength--;
        if (heapLength < 2) {
            return;
        }
        reorder(0);
    }

    /// @dev reorders the heap array after the head has been popped
    function reorder(uint256 index) private {
        uint256 rightChildIndex = getRightChildIndex(index);
        uint256 leftChildIndex = getLeftChildIndex(index);
        uint256 lastIndex = heapLength - 1;
        if (lastIndex < leftChildIndex) {
            return;
        }
        uint16 leftChildValue = heapArray[leftChildIndex];
        uint16 rightChildValue = heapLength < rightChildIndex
            ? 0
            : heapArray[rightChildIndex];
        uint256 largerChildIndex = leftChildValue > rightChildValue
            ? leftChildIndex
            : rightChildIndex;
        uint256 largerChildValue = heapArray[largerChildIndex];
        if (largerChildValue > heapArray[index]) {
            swap(largerChildIndex, index);
        }
        reorder(largerChildIndex);
    }
}
