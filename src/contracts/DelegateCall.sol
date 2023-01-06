// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

library DelegatedLibrary {
  event SomeEvent(address caller, uint256 testValue);

  // uint256 num = 3;

  function delegated(uint256 num) public {
    emit SomeEvent(msg.sender, num);
  }

  function staticDelegation(uint256 num) public pure returns (uint256) {
    return num * num;
  }

  function returnSender() public view returns (address) {
    return msg.sender;
  }

  function returnOrigin() public view returns (address) {
    return tx.origin;
  }
}

contract DelegatedContract {
  function returnSender() public view returns (address) {
    return msg.sender;
  }

  function returnOrigin() public view returns (address) {
    return tx.origin;
  }
}

contract DelegateCall {
  event DelegationStatus(bool status, bytes res);

  uint256 internal num = 13;
  DelegatedContract delegatedContract = new DelegatedContract();

  function delegator() external {
    bool status;
    bytes memory res;
    (status, res) = address(DelegatedLibrary).delegatecall(
      abi.encodeWithSelector(bytes4(keccak256("delegated(uint256)")), 4)
    );
    require(status, "delegatecallFail");
    emit DelegationStatus(status, res);
  }

  function staticCaller() external {
    bool status;
    bytes memory res;
    (status, res) = address(DelegatedLibrary).staticcall(
      abi.encodeWithSelector(bytes4(keccak256("staticDelegation(uint256)")), 3)
    );
    require(status, "staticcallFail");
    emit DelegationStatus(status, res);
  }

  function normal() external {
    DelegatedLibrary.delegated(num);
  }

  function staticAddressLibrary() external view returns (bytes memory) {
    bool status;
    bytes memory response;
    (status, response) = address(DelegatedLibrary).staticcall(
      abi.encodeWithSelector(bytes4(keccak256("returnSender()")))
    );
    require(status, "staticcallFail");
    return response;
  }

  function delegateAddressLibrary() external {
    bool status;
    bytes memory res;
    (status, res) = address(DelegatedLibrary).delegatecall(
      abi.encodeWithSelector(bytes4(keccak256("returnSender()")))
    );
    require(status, "delegatecallFail");
    emit DelegationStatus(status, res);
  }

  function delegateAddressContract() external {
    bool status;
    bytes memory res;
    (status, res) = address(delegatedContract).delegatecall(
      abi.encodeWithSelector(bytes4(keccak256("returnSender()")))
    );
    require(status, "delegatecallFail");
    emit DelegationStatus(status, res);
  }

  // function delegatedOriginLibrary() external {
  //   bool status;
  //   bytes memory res;
  //   (status, res) = address(DelegatedLibrary).delegatecall();
  // }
}
