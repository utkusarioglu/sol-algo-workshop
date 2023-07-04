// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

interface INextjsGrpcSubscription {
  /// @notice Subscribes the `msg.sender` to the service for a
  /// certain amount of time
  /// @dev You need a better way to provide time for this method
  function subscribe(uint256 subscriptionSeconds) external payable;

  /// @notice Returns the remaining balance for the user that is making the call
  /// @dev -
  function getSubscription() external view returns (UserSubscription memory);

  /// @notice Allows the owner of the contract to withdraw accrued funds;
  /// @dev -
  function withdraw(uint256 _amount) external;
}

struct UserSubscription {
  uint256 expiration; // epoch
  uint256 balance;
}

error NotAFunction();
error NotImplemented();
error FeeRequired();
error InsufficientFee();
error OnlyOwner();

contract NextjsGrpcSubscription is INextjsGrpcSubscription {
  uint256 public immutable epochCost;
  address public immutable owner;
  mapping(address => UserSubscription) public balances;

  constructor(uint256 _epochCost) {
    owner = msg.sender;
    epochCost = _epochCost;
  }

  modifier onlyOwner() {
    if (msg.sender != owner) {
      revert OnlyOwner();
    }
    _;
  }

  event Subscription(
    address indexed subscriber,
    uint256 indexed expiration,
    uint256 balance
  );

  event Withdrawal(address beneficiary, uint256 amount);

  // fallback() external {
  //   revert NotAFunction();
  // }

  // receive() external payable {
  //   revert NotImplemented();
  // }

  function withdraw(uint256 _amount) external onlyOwner {
    payable(msg.sender).transfer(_amount);
    emit Withdrawal(msg.sender, _amount);
  }

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
