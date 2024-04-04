// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "./Math.lib.sol";

contract CountingSort {

  function loop(uint16[] memory unsorted) external pure returns(uint16[] memory) {
    uint16 minValue = Math.min(unsorted);
    uint16 maxValue = Math.max(unsorted);

    uint16[] memory counts = new uint16[](maxValue - minValue + 1);
    for(uint16 i = 0; i < unsorted.length; i++) {
      uint16 val = unsorted[i];
      counts[val - minValue] += 1; 
    }
    uint16[] memory sorted = new uint16[](unsorted.length);
    uint256 sortedIndex = 0;
    for(uint16 c = 0; c < counts.length; c++) {
      uint256 noCount = counts[c];
      if(noCount > 0) {
        uint16 value = minValue + c;
        for(uint256 j = 0; j < noCount; j++) {
          sorted[sortedIndex] = value;
          sortedIndex++;
        }
      }
    }
    return sorted;
  }
}
