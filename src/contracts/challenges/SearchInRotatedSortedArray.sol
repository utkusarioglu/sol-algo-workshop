// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract SearchInRotatedSortedArray {
  function bisect(int256[] memory arr, int256 target, uint256 start, uint256 end) private view returns(int256) {
    int256 ABSENT = -1;
    if(start == end) {
      return arr[end] == target ? int256(end) : ABSENT;
    } else {
      uint256 mid = (end + start) / 2;
      int256 left = bisect(arr, target, start, mid);
      int256 right = bisect(arr, target, mid + 1, end);
      return left == ABSENT ? right : left;
    }
  } 

  function handle(int256[] memory arr, int256 target) public view returns(int256) {
    return bisect(arr, target, 0, arr.length -1);
  }
}
