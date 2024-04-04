import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type InsertionSort as Contract } from "_typechain/InsertionSort";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "InsertionSort";

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

      describe("loop", () => {
        [
          [3, 2, 1],
          [3, 2, 1, 1],
          [3, 2, 1, 3],
          [1, 1, 1, 1],
          [1, 2, 3, 4, 5],
          Array(100)
            .fill(null)
            .map((_, i) => i),
          Array(100)
            .fill(null)
            .map((_, i) => i)
            .reverse(),
        ].forEach((unsorted) => {
          it(`Can sort ${unsorted.join(", ")}`, async () => {
            const response = await instance.loop(unsorted);
            const expected = unsorted
              .sort((a, b) => a - b)
              .map((n) => BigInt(n));
            expect(response).to.deep.eq(expected);
          });
        });
      });
    });
  });
});
