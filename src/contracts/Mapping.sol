// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract Mapping {
  mapping(uint256 => string) public uint256ToStringStore;
  mapping(uint256 => uint8) public uint256ToUint8Store;
  mapping(uint256 => uint64[]) public uint256ToUint64ArrStore;
  mapping(uint256 => uint128[2]) public uint256ToUint128StaticStore;
  mapping(uint256 => bool[4]) public uint256ToBoolStaticStore;

  constructor() {
    uint256ToStringStore[1] = "13";
    uint256ToStringStore[
      10
    ] = "------------------------------------------------------------------------------------------------------------------------";
    uint256ToUint8Store[1] = 3;
    uint256ToUint64ArrStore[1] = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
    uint256ToUint64ArrStore[2] = [21, 32];
    uint256ToUint128StaticStore[4] = [7, 13];
    uint256ToBoolStaticStore[17] = [true, true, false, true];
  }

  function setItem(uint256 key, string calldata value) external {
    uint256ToStringStore[key] = value;
  }

  function getItem(uint256 key) external view returns (string memory) {
    return uint256ToStringStore[key];
  }
}
