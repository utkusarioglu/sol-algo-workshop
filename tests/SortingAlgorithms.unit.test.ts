import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type SortingAlgorithms as Contract } from "_typechain/SortingAlgorithms";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "SortingAlgorithms";

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

      describe("countingSort", () => {
        [
          [3, 2, 1],
          [3, 2, 1, 1],
          [3, 2, 1, 3],
          [1, 1, 1, 1],
        ].forEach((unsorted) => {
          it(`Can sort ${unsorted.join(", ")}`, async () => {
            // const unsorted = [3, 2, 1, 3];
            const response = await instance.countingSort(unsorted);
            const expected = unsorted.sort().map((n) => BigInt(n));
            expect(response).to.deep.eq(expected);
          });
        });
      });
    });
  });
});
