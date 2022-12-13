// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract Mapping {
  mapping(uint256 => string) public uintStore;

  constructor() {
    uintStore[1] = "13";
    uintStore[
      10
    ] = "------------------------------------------------------------------------------------------------------------------------";
  }

  function setItem(uint256 key, string calldata value) external {
    uintStore[key] = value;
  }

  function getItem(uint256 key) external view returns (string memory) {
    return uintStore[key];
  }
}
