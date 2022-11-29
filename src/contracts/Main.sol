// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import { Str } from "./strings/Strings.sol";
import "hardhat/console.sol";

contract Main {
  bytes public something;

  function concat(
    bytes calldata str1,
    bytes calldata str2
  ) public pure returns (bytes memory) {
    return Str.concat(str1, str2);
  }

  function unicodeStrings() external pure returns (bytes32) {
    return Str.unicodeStrings();
  }
}
