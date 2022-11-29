// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract Caching {
  uint256 upperLimit = 1000;

  function noCache() external view returns (uint256) {
    uint256 counter = 0;
    for (uint256 i = 0; i < upperLimit; i++) {
      counter += i;
    }
    return counter;
  }

  function cache() external view returns (uint256) {
    uint256 upperLimitCache = upperLimit;
    uint256 counter = 0;
    for (uint256 i = 0; i < upperLimitCache; i++) {
      counter += i;
    }
    return counter;
  }
}
