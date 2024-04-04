// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

import "hardhat/console.sol";

contract MinimumRotatedSortedArray {
  function bisect(int256[] memory arr, uint256 start, uint256 end) public view returns(int256) {
    if(start == end) {
      return arr[end];
    } else if(start + 1 == end) {
      return arr[end] > arr[start] ? arr[start] : arr[end];
    } else {
      uint256 mid = (end + start) / 2;
      int256 left = bisect(arr, start, mid);
      int256 right = bisect(arr, mid + 1, end);
      return left > right ? right : left;
    }
  }

  function handle(int256[] memory arr) public view returns(int256) {
    return bisect(arr, 0, arr.length - 1);
  }
}
