// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

library Math {
  function min(uint16[] memory arr) internal pure returns(uint16) {
    uint16 current = type(uint16).max;
    for (uint16 i = 0; i < arr.length; i++) {
      if(current > arr[i]) {
        current = arr[i];
      }
    } 
    return current;
  }

  function max(uint16[] memory arr) internal pure returns(uint16) {
    uint16 current = type(uint16).min;
    for (uint16 i = 0; i < arr.length; i++) {
      if(current < arr[i]) {
        current = arr[i];
      }
    } 
    return current;
  }
}
