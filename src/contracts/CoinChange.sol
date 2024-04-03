// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract CoinChange {
  /// @notice Returns the minimum number of coins required to produce the given
  /// amount using the denominations provided.
  ///
  /// @dev Uses a greedy algorithm. The function does not know the
  /// denominations it uses to return the requested amount.
  /// 1. Initialization
  function handle(uint256[] calldata denominations, uint256 amount) public pure returns(int256) {
    int256[] memory memo = new int256[](amount + 1);
    int256 MAX_INT = 2 **128;

    // #1
    for(uint256 i = 1; i < memo.length; i++) {
      memo[i] = MAX_INT;
    }
    
    for (uint256 a = 1; a <= amount; a++) {
      for(uint256 di = 0; di < denominations.length; di++) {
        uint256 d = denominations[di];

         if (d <= a) {
          int256 curr = memo[a];
          int256 prev = memo[a - d];
          memo[a] = curr < prev + 1 ? curr : prev + 1; 
         }
      }
    }
    return memo[amount] == MAX_INT ? -1 : memo[amount];
  }
}
