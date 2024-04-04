// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "../src/contracts/NextjsGrpcSubscription.sol";

contract NextjsGrpcSubscriptionFuzz is NextjsGrpcSubscription {
  constructor() NextjsGrpcSubscription(2) {}

  // event AssertionFailed();

  function echidna_balance_expiration(
    uint256 subscriptionSeconds
  ) public returns (bool) {
    subscribe(subscriptionSeconds);
    return
      balances[msg.sender].expiration >= block.timestamp + subscriptionSeconds;
  }

  // function echidna_always_fail() public pure returns (bool) {
  //   return false;
  // }
}
