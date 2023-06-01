// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

interface INextjsGrpcSubscription {
  /// @notice Subscribes the `msg.sender` to the service for a
  /// certain amount of time
  /// @dev -
  function subscribe(uint256 subscriptionSeconds) external payable;

  /// @notice Returns the remaining balance for the user that is making the call
  /// @dev -
  function getSubscription() external view returns (UserSubscription memory);
}

struct UserSubscription {
  uint256 expiration; // epoch
  uint256 balance;
}

error NotAFunction();
error NotImplemented();
error FeeRequired();
error InsufficientFee();

contract NextjsGrpcSubscription is INextjsGrpcSubscription {
  uint256 public immutable epochCost = 2;
  mapping(address => UserSubscription) public balances;

  event Subscription(
    address indexed subscriber,
    uint256 indexed expiration,
    uint256 balance
  );

  // fallback() external {
  //   revert NotAFunction();
  // }

  // receive() external payable {
  //   revert NotImplemented();
  // }

  function subscribe(uint256 subscriptionSeconds) public payable {
    if (msg.value <= 0) {
      revert FeeRequired();
    }
    uint256 subscriptionCost = subscriptionSeconds * epochCost;
    if (subscriptionCost > msg.value) {
      revert InsufficientFee();
    }
    uint256 deposit = msg.value - subscriptionCost;
    uint256 newBalance = balances[msg.sender].balance + deposit;

    uint256 oldExpiration = balances[msg.sender].expiration;
    uint256 baseExpiration = oldExpiration > block.timestamp
      ? oldExpiration
      : block.timestamp;
    uint256 newExpiration = baseExpiration + subscriptionSeconds;
    balances[msg.sender] = UserSubscription(newExpiration, newBalance);
    emit Subscription(msg.sender, newExpiration, newBalance);
  }

  function getSubscription() external view returns (UserSubscription memory) {
    return balances[msg.sender];
  }
}
