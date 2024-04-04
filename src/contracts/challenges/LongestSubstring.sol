// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract LongestSubstring {
  /// @notice Uses an array as a map to solve the longest substring problem:
  /// https://leetcode.com/problems/longest-substring-without-repeating-characters
  /// @dev
  /// 1- This function is intended to work with ascii chars of range 0 - 127,
  ///    that range is covered by 2**7.
  function arrayAsMap(bytes32 s) public pure returns (uint256) {
    uint256[] memory positions = new uint256[](2 ** 7); // #1
    uint256 start = 0;
    uint256 end = 0;
    uint256 longest = 0;
    uint256 currentLength = 0;
    for (uint256 i = 0; i < 32; i++) {
      uint256 current = uint8(s[i]);
      if (current != 0x00) {
        uint256 lastIndex = positions[current];
        positions[current] = i;
        if (lastIndex >= start) {
          start = i;
          end = i;
        } else {
          end = i;
        }
        currentLength = end - start + 1;
        if (currentLength > longest) {
          longest = currentLength;
        }
      } else {
        break;
      }
    }
    return longest;
  }

  function arrayAsMapLong(string calldata s) public pure returns (uint256) {
    uint256[] memory positions = new uint256[](2 ** 7);
    uint256 start = 0;
    uint256 end = 0;
    uint256 longestLength = 0;
    uint256 currentLength = 0;
    bytes memory b = bytes(s);
    for (uint256 i = 0; i < b.length; i++) {
      uint256 current = uint8(b[i]);
      if (current == 0x00) {
        break;
      }
      uint256 lastIndex = positions[current];
      positions[current] = i;
      if (lastIndex >= start) {
        start = i;
        end = i;
      } else {
        end = i;
      }
      currentLength = end - start + 1;
      longestLength = currentLength > longestLength
        ? currentLength
        : longestLength;
    }
    return longestLength;
  }
}
