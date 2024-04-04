import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type MaxDepthOfBinaryTree as Contract } from "_typechain/MaxDepthOfBinaryTree";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { type BigNumberish } from "ethers";

const CONTRACT_NAME = "MaxDepthOfBinaryTree";

interface TestCase {
  params: BigNumberish[];
  expected: BigNumberish;
}

const NULL = 0n;

const TEST_CASES: TestCase[] = [
  {
    params: [],
    expected: 0n,
  },
  {
    params: [NULL],
    expected: 0n,
  },
  {
    params: [1n],
    expected: 1n,
  },
  {
    params: [5n, 1n],
    expected: 2n,
  },
  {
    params: [5n, 6n, 7n],
    expected: 2n,
  },
  {
    params: [1n, 7n, 6n, 85n],
    expected: 3n,
  },
  {
    params: [3n, 9n, 20n, NULL, NULL, 15n, 7n],
    expected: 3n,
  },
  {
    params: [1n, NULL, 2n],
    expected: 2n,
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
        TEST_CASES.forEach(({ params, expected }) => {
          it(`Works with ${params.join(",")}`, async () => {
            const response = await instance.findDepth(params);

            expect(response).to.deep.eq(expected);
          });
        });
      });
    });
  });
});
