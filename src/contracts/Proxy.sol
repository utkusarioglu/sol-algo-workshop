// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract Proxy {
  bytes32 internal constant IMPLEMENTATION_SLOT =
    0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;
  event Hit(address caller);

  constructor() {
    assert(
      IMPLEMENTATION_SLOT ==
        bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1)
    );
  }

  // receive() external payable {}

  fallback() external {
    delegate(getCurrentImplementation());
  }

  struct AddressSlot {
    address value;
  }

  function getAddressSlot(
    bytes32 slot
  ) internal pure returns (AddressSlot storage r) {
    assembly {
      r.slot := slot
    }
  }

  function getCurrentImplementation() internal view returns (address) {
    return getAddressSlot(IMPLEMENTATION_SLOT).value;
  }

  function delegate(address implementation) internal {
    emit Hit(msg.sender);
    // address implementation = address(implementationAddress);
    assembly {
      let ptr := mload(0x40)

      // (1) copy incoming call data
      calldatacopy(ptr, 0, calldatasize())

      // (2) forward call to logic contract
      let result := delegatecall(
        gas(),
        implementation,
        ptr,
        calldatasize(),
        0,
        0
      )
      let size := returndatasize()

      // (3) retrieve return data
      returndatacopy(ptr, 0, size)

      // (4) forward return data back to caller
      switch result
      case 0 {
        revert(ptr, size)
      }
      default {
        return(ptr, size)
      }
    }
  }
}

contract Target {
  uint256 constant someUnusedValue = 3;
  string someString = "hello man";

  function someBehavior() public view returns (string memory) {
    return someString;
  }
}
