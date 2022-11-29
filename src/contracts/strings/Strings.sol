// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

library Str {
  function concat(
    bytes calldata str1,
    bytes calldata str2
  ) internal pure returns (bytes memory) {
    bytes memory result = abi.encodePacked(str1, str2);
    return result;
  }

  function unicodeStrings() internal pure returns (bytes32) {
    // string memory uni = unicode"hello 🌍";
    bytes32 u = bytes32(unicode"hello 🌍");
    return u;
  }
}
