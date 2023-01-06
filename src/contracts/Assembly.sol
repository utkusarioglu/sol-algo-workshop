// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract Assembly {
  function add(uint256 num1, uint256 num2) external pure returns (uint256) {
    assembly {
      let result := add(num1, num2)
      mstore(0, result)
      return(0x0, 32)
    }
  }

  function greeting() external pure returns (string memory) {
    // assembly {
    //   // you need to say where in *the return data* (btw. not relative to your own memory) the string starts (aka where it's length is stored - here it's 0x20)
    //   mstore(0x00, 0x20)
    //   // then the length of the string, let's say it's 14 bytes
    //   mstore(0x20, 0xA)
    //   // the string to return in hex
    //   mstore(
    //     0x45,
    //     // 0x737461636B6F766572666C6F7721000000000000000000000000000000000000
    //     0x68656C6C6F
    //   )
    //   // 0x 73 74 61 63 6B 6F 76 65 72 66 6C 6F 77 21 000000000000000000000000000000000000
    //   // 0x 73 74 61 63 6B 6F 76 65 72 66 6C 6F 77 21
    //   return(0, 0x60)
    // }
    assembly {
      // let message := "Hello"
      mstore(0x20, 0x20)
      // mstore(0x45, 0x0568656C6C6F) // Hello
      mstore(0x45, 0x0568656C6C6F) // Hello
      // mstore(0x45, message) // Hello
      return(0x20, 0x60)
    }
  }
}
