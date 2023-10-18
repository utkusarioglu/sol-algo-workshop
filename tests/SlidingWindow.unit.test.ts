import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type SlidingWindow as Contract } from "_typechain/SlidingWindow";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";
import { type BigNumberish } from "ethers";

const CONTRACT_NAME = "SlidingWindow";

type List = BigNumberish[];
type Range = [BigNumberish, BigNumberish];

interface SmallestSumTestCase {
  args: [List, BigNumberish];
  expected: BigNumberish;
}

interface SmallestRangeTestCase {
  args: [List, BigNumberish];
  expected: Range;
}

const SMALLEST_SUM_TEST_CASES: SmallestSumTestCase[] = [
  {
    args: [[10n, 2n, 3n, 4n, 5n, 6n, 7n, 8n], 3n],
    expected: 9n,
  },
];

const SMALLEST_RANGE_TEST_CASES: SmallestRangeTestCase[] = [
  {
    args: [[1n, 2n, 3n, 4n, 5n], 7n],
    expected: [2n, 3n],
  },
  {
    args: [[1n, 2n, 3n, 4n, 5n, 7n, 8n], 16n],
    expected: [3n, 5n],
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

      describe("smallestSum", () => {
        SMALLEST_SUM_TEST_CASES.forEach(({ args, expected }) => {
          const name = `List: [${args[0].join(",")}], WindowSize: ${args[1]}`;
          it(name, async () => {
            const response = await instance.smallestSum(...args);
            expect(response).to.deep.eq(expected);
          });
        });
      });

      describe("smallestRange", () => {
        SMALLEST_RANGE_TEST_CASES.forEach(({ args, expected }) => {
          const name = `List: [${args[0].join(",")}], Target: ${args[1]}`;
          it(name, async () => {
            const response = await instance.smallestRange(...args);
            expect(response).to.deep.eq(expected);
          });
        });
      });
    });
  });
});
