import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type SearchInRotatedSortedArray as Contract } from "_typechain/SearchInRotatedSortedArray";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "SearchInRotatedSortedArray";

describe(CONTRACT_NAME, () => {
  testAccounts.slice(0, 1).forEach(({ index, describeMessage }) => {
    let instance: Contract;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<Contract>(
          CONTRACT_NAME,
          [],
          index,
        );
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("handle", () => {
        [
          {
            params: {
              arr: [4n, 5n, 6n, 7n, 0n, 1n, 2],
              target: 0n,
            },
            expected: 4n,
          },
          {
            params: {
              arr: [4n, 5n, 6n, 7n, 0n, 1n, 2],
              target: 3n,
            },
            expected: -1n,
          },
          {
            params: {
              arr: [1n],
              target: 0n,
            },
            expected: -1n,
          },
        ].forEach(({ params, expected }) => {
          const description = [
            params.arr.map((v) => Number(v)),
            ", ",
            Number(params.target),
            " => ",
            expected.toString(),
          ].join("");

          it(description, async () => {
            const response = await instance.handle(params.arr, params.target);
            expect(response).to.equal(expected);
          });
        });
      });
    });
  });
});
