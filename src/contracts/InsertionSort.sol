// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

contract InsertionSort {
  function loop(uint16[] memory unsorted) external pure returns(uint16[] memory) {
    for (uint256 i = 1; i < unsorted.length; i++) {
      for(uint256 j = i; j > 0; j--) {
        if(unsorted[j - 1] > unsorted[j]) {
          uint16 temp = unsorted[j];
          unsorted[j] = unsorted[j-1];
          unsorted[j-1] = temp;
        } else {
          continue;
        }
      }
    }
    return unsorted;
  }
}
