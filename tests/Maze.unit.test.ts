import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type Maze as Contract } from "_typechain/Maze";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";
import { type BigNumberish } from "ethers";

const CONTRACT_NAME = "Maze";

interface TestCase {
  params: [BigNumberish, BigNumberish];
  expected: BigNumberish;
}

const DOWN_RIGHT_TEST_CASES: TestCase[] = [
  {
    params: [2n, 3n],
    expected: 3n,
  },
  {
    params: [18n, 6n],
    expected: 26334n,
  },
  {
    params: [75n, 19n],
    expected: 5873182941643167150n,
  },
];

describe(CONTRACT_NAME, () => {
  testAccounts.slice(0, 1).forEach(({ index, describeMessage }) => {
    let instance: Contract;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<Contract>(
          CONTRACT_NAME,
          [],
          index
        );
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("downRight", () => {
        DOWN_RIGHT_TEST_CASES.map(({ params, expected }) => {
          it(`Expects ${expected.toString()}`, async () => {
            const response = await instance.downRight(...params, {
              gasLimit: 1e12,
            });

            expect(response).to.deep.equal(expected);
          });
        });
      });
    });
  });
});
