// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "hardhat/console.sol";

contract Main {
  string private greeting;
  uint256 private counter = 0;

  constructor() {
    greeting = "Hello World!";
  }

  function getGreeting() public view returns (string memory) {
    console.log("Sending greeting");
    return greeting;
  }

  function incrementCounter() public {
    console.log("Incrementing counter");
    counter += 1;
  }

  function getCounter() public view returns (uint256) {
    return counter;
  }
}
