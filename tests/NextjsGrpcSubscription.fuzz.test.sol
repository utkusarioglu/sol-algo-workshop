// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "../src/contracts/NextjsGrpcSubscription.sol";

contract NextjsGrpcSubscriptionFuzz is NextjsGrpcSubscription {
  event AssertionFailed();

  function aaaa(uint256 subscriptionSeconds) public {
    subscribe(subscriptionSeconds);
    if (
      balances[msg.sender].expiration >= block.timestamp + subscriptionSeconds
    ) {
      emit AssertionFailed();
    }
  }
}
