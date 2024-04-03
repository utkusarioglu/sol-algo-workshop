// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract ContainerWithMostWater {
  function handle(uint256[] memory heights) public pure returns(uint256) {
    require(heights.length > 0, "EMPTY_ARRAY");

    uint256 left = 0;
    uint256 right = heights.length - 1;
    uint256 maxValue = 0;

    while(left < right) {
      uint256 x = right - left;
      uint256 y = heights[left] > heights[right] ? heights[right] : heights[left];
      uint256 currValue = x * y;
      if(currValue > maxValue) {
        maxValue = currValue;
      }
      if(heights[left] > heights[right]) {
        right--;
      } else {
        left++;
      }
    }

    return maxValue;
  }
}
