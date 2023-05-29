// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "../src/contracts/NextjsGrpcSubscription.sol";

contract NextjsGrpcSubscriptionFuzz is NextjsGrpcSubscription {
  // uint256 public subscriptionSeconds;

  event AssertionFailed();

  // function echidna_epochCostIsStable() public pure {
  //   assert(epochCost == 2);
  // }

  // function echidna_balancesAlwaysPositive() public view returns (bool) {
  //   return balances[msg.sender].balance >= 0;
  // }

  function aaaa(uint256 subscriptionSeconds) public {
    subscribe(subscriptionSeconds);
    if (
      balances[msg.sender].expiration >= block.timestamp + subscriptionSeconds
    ) {
      emit AssertionFailed();
    }
  }
}
