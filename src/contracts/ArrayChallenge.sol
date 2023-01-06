// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "hardhat/console.sol";

library MathLibrary {
  function median(uint256[] calldata inputArray) public pure returns (uint256) {
    if (inputArray.length % 2 == 0) {
      uint256 indexSecond = inputArray.length / 2;
      uint256 indexFirst = indexSecond - 1;
      return (inputArray[indexFirst] + inputArray[indexSecond]) / 2;
    } else {
      uint256 index = inputArray.length / 2;
      return inputArray[index];
    }
  }

  function min(int256 val1, int256 val2) public pure returns (int256) {
    return val1 < val2 ? val1 : val2;
  }

  function max(int256 val1, int256 val2) public pure returns (int256) {
    return val1 > val2 ? val1 : val2;
  }
}

library ArrayLibrary {
  function sort(
    uint256[] calldata data,
    uint256 setSize
  ) public pure returns (uint256[] memory) {
    uint256 dataLength = data.length;
    uint256[] memory sorted = new uint256[](dataLength);
    bool[] memory set = new bool[](setSize);
    for (uint256 i = 0; i < dataLength; i++) {
      set[data[i]] = true;
    }
    uint256 n = 0;
    for (uint256 i = 0; i < setSize; i++) {
      if (set[i]) {
        sorted[n] = i;
        if (++n >= dataLength) break;
      }
    }
    return sorted;
  }

  function slice(
    uint256[] calldata inputArray,
    uint256 startIndex,
    uint256 endIndex
  ) public pure returns (uint256[] memory) {
    return inputArray[startIndex:endIndex];
  }
}

contract ArrayChallenge {
  function arrayChallenge(
    uint256[] calldata inputArray
  ) external pure returns (uint256[] memory) {
    uint256 windowSize = inputArray[0];
    require(windowSize > 0, "IllegalWindowSize");
    uint256[] memory values = inputArray[1:];
    uint256[] memory medians = new uint256[](values.length);
    int256 maxValue = 0;
    uint256 medianSize = 0;
    for (uint256 end = 0; end < values.length; end++) {
      maxValue = MathLibrary.max(maxValue, int256(values[end]));
      int256 startInt = MathLibrary.max(
        int256(end) - int256(windowSize) + 1,
        0
      );
      uint256 start = uint256(startInt);
      uint256[] memory slice = ArrayLibrary.slice(values, start, end + 1);
      uint256[] memory sortedSlice = ArrayLibrary.sort(
        slice,
        uint256(maxValue + 1)
      );
      uint256 median = MathLibrary.median(sortedSlice);
      medians[medianSize++] = median;
    }
    return medians;
  }
}
