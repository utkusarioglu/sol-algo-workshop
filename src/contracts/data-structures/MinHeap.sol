// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./Heap.sol";
import "./IHeap.sol";

contract MinHeap is Heap, IHeap {
    function insert(uint16 newElement) external {
        heapArray.push(newElement);
        heapLength++;
        uint256 currentIndex = getLastIndex();
        while (currentIndex > 0) {
            uint256 parentIndex = getParentIndex(currentIndex);
            uint16 parentValue = heapArray[parentIndex];
            uint16 currentValue = heapArray[currentIndex];
            if (parentValue < currentValue) {
                return;
            }
            swap(parentIndex, currentIndex);
            currentIndex = parentIndex;
        }
    }

    function popHead() external {
        if (heapLength == 0) {
            return;
        }
        uint256 lastIndex = getLastIndex();
        heapArray[0] = heapArray[lastIndex];
        delete heapArray[lastIndex];
        heapLength--;
        if (heapLength < 2) {
            return;
        }
        reorder(0);
    }

    function getHead() external view returns (uint16) {
        return heapArray[0];
    }

    function getHeapLength() external view returns (uint256) {
        return heapLength;
    }

    /// @dev reorders the heap array after the head has been popped
    function reorder(uint256 currentIndex) private {
        uint256 lastIndex = getLastIndex();
        uint256 leftChildIndex = getLeftChildIndex(currentIndex);
        if (leftChildIndex > lastIndex) {
            return;
        }
        uint16 leftChildValue = heapArray[leftChildIndex];
        uint256 rightChildIndex = getRightChildIndex(currentIndex);
        uint16 rightChildValue = rightChildIndex > lastIndex
            ? 2 ** 16 - 1
            : heapArray[rightChildIndex];
        uint256 significantChildIndex = leftChildValue < rightChildValue
            ? leftChildIndex
            : rightChildIndex;
        uint16 significantChildValue = heapArray[significantChildIndex];
        uint16 currentValue = heapArray[currentIndex];
        if (currentValue < significantChildValue) {
            return;
        }
        swap(significantChildIndex, currentIndex);
        reorder(significantChildIndex);
    }
}
