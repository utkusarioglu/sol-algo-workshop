import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type MinCoins as Contract } from "_typechain/MinCoins";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";
import { type BigNumberish } from "ethers";

const CONTRACT_NAME = "MinCoins";

interface TestCase {
  params: [BigNumberish, [BigNumberish, BigNumberish, BigNumberish]];
  expected: BigNumberish;
}

const MIN_COINS_TEST_CASES: TestCase[] = [
  {
    params: [13n, [1n, 4n, 5n]],
    expected: 3n,
  },
  {
    params: [150n, [1n, 4n, 5n]],
    expected: 30n,
  },
];

const WAY_COINS_TEST_CASES: TestCase[] = [
  {
    params: [5n, [1n, 4n, 5n]],
    expected: 4n,
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

      describe("minCoins", () => {
        MIN_COINS_TEST_CASES.map(({ params, expected }) => {
          it(`Expects ${expected.toString()}`, async () => {
            const response = await instance.minCoins(...params);

            expect(response).to.deep.equal(expected);
          });
        });
      });

      describe("wayCoins", () => {
        WAY_COINS_TEST_CASES.map(({ params, expected }) => {
          it(`Expects ${expected.toString()}`, async () => {
            const response = await instance.waysCoins(...params);

            expect(response).to.deep.equal(expected);
          });
        });
      });
    });
  });
});
