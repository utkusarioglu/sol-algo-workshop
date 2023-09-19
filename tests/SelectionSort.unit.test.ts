import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type SelectionSort as Contract } from "_typechain/SelectionSort";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";
import type { ContractTransactionResponse } from "ethers";

const CONTRACT_NAME = "SelectionSort";

const PARAM_LISTS = [
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

      describe("Insert", () => {
        describe("Single", () => {
          PARAM_LISTS.forEach((paramList) => {
            it(`Sorts ${paramList.length} elements ${paramList.join(
              ","
            )}`, async () => {
              const unsorted = paramList;
              const sorted = await instance.sort(unsorted);
              const expected = unsorted
                .sort((a, b) => Number(a - b))
                .map(BigInt);
              expect(sorted).to.deep.eq(expected);
            });
          });
        });
      });
    });
  });
});
