// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract Mapping {
  mapping(uint256 => string) public store;

  constructor() {
    store[1] = "13";
  }

  function setItem(uint256 key, string calldata value) external {
    store[key] = value;
  }

  function getItem(uint256 key) external view returns (string memory) {
    return store[key];
  }
}
