// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

/// @title Heap contract (min, max)
/// @author Utku Sarioglu
/// @notice Interface for the min and max heap contracts that manage a heap
/// data structure
interface IHeap {
    /// @notice Inserts a new element into the heap
    function insert(uint16 newElement) external;

    /// @notice Removes the head from the heap. Does not return the
    /// head to the user, that needs to be done with `getHead` before
    /// calling this function
    function popHead() external;

    /// @notice Returns the current head of the heap
    function getHead() external view returns (uint16);

    /// @notice Returns the length of the heap array. It doesn't return
    /// the depth of the heap, just the length of the heap array.
    function getHeapLength() external view returns (uint256);
}
