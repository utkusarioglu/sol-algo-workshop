import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type SetMatrixZeroes as Contract } from "_typechain/SetMatrixZeroes";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { type BigNumberish } from "ethers";

const CONTRACT_NAME = "SetMatrixZeroes";

interface TestCase {
  params: BigNumberish[][];
  expected: BigNumberish[][];
}

const TEST_CASES: TestCase[] = [
  {
    params: [[1]],
    expected: [[1]],
  },
  {
    params: [[0]],
    expected: [[0]],
  },
  {
    params: [[1, 0, 1]],
    expected: [[0, 0, 0]],
  },
  {
    params: [
      [0, 1, 2],
      [1, 2, 3],
    ],
    expected: [
      [0, 0, 0],
      [0, 2, 3],
    ],
  },
  {
    params: [
      [1, 2, 3],
      [0, 4, 5],
    ],
    expected: [
      [0, 2, 3],
      [0, 0, 0],
    ],
  },
  {
    params: [[1], [2], [0]],
    expected: [[0], [0], [0]],
  },
  {
    params: [
      [1, 2, 0],
      [1, 2, 0],
    ],
    expected: [
      [0, 0, 0],
      [0, 0, 0],
    ],
  },
  {
    params: [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ],
    expected: [
      [1, 0, 1],
      [0, 0, 0],
      [1, 0, 1],
    ],
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

      describe("findDepth", () => {
        TEST_CASES.forEach(({ params, expected }, i) => {
          it(`Works with test case ${i}`, async () => {
            const response = await instance.doubleLoop(params);
            // console.log({ params, response });
            expect(response).to.deep.eq(expected);
          });
        });
      });
    });
  });
});
