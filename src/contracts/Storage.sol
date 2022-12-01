// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract Storage {
  mapping(uint256 => uint256) public map;
  uint256 private num;
  uint256[] public arr;
  string public str = "hello";

  function getNum() external view returns (uint256) {
    return num;
  }

  function addToMap(uint256 key, uint256 value) external {
    map[key] = value;
  }

  function peek(uint256 index) external view returns (uint256) {
    return arr[index];
  }

  function push(uint256 value) external {
    arr.push(value);
  }

  function setStr(string calldata newStr) external {
    str = newStr;
  }
}
