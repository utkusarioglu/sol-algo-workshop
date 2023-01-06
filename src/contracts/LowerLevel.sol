// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

contract ConstructorLog {
  event Creation(
    address indexed creator,
    uint256 indexed time,
    uint256 inputNumber
  );
  event CreationAnon(
    address indexed creator,
    uint256 indexed time,
    uint256 inputNumber
  ) anonymous;
  event LongAnon(string indexed veryLong, uint256 indexed manyNumber) anonymous;
  event GasLeftConstructorLog(uint256 gasLeft);

  Asserter public asserter;

  constructor(uint256 inputNumber) {
    emit Creation(msg.sender, block.timestamp, inputNumber);
    emit CreationAnon(msg.sender, block.timestamp, inputNumber);
    emit LongAnon(
      "this is a very very very very very veryveryveryveryveryvery veryveryveryveryveryevry long string that is very very veryveryveryveryevryevryervy long",
      0x1111111111111111111111111111111111111111111111111111111111111111
    );
    asserter = new Asserter();
  }

  function delegator() public {
    // emit GasLeftConstructorLog(gasleft());
    bool status;
    bytes memory res;
    (status, res) = address(asserter).delegatecall(
      abi.encodeWithSelector(bytes4(keccak256("delegate()")))
    );
    // asserter.delegate();
    // emit GasLeftConstructorLog(gasleft());
  }
}

contract Asserter {
  event GasLeftAsserter(uint256 gasLeft);
  event Who(address sender, bytes value, uint256 val);

  function delegate() public {
    // emit GasLeftAsserter(gasleft());
    emit Who(msg.sender, msg.data, 7);
  }
}
