import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type MinimumRotatedSortedArray as Contract } from "_typechain/MinimumRotatedSortedArray";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "MinimumRotatedSortedArray";

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
            params: [3n, 1n, 2n],
            expected: 1n,
          },
          {
            params: [4n, 5n, 6n, 7n, 0n, 1n, 2],
            expected: 0n,
          },
          {
            params: [11n, 13n, 15n, 17n],
            expected: 11n,
          },
        ].forEach(({ params, expected }) => {
          const description = [
            JSON.stringify(params.map((v) => Number(v))),
            "=>",
            expected.toString(),
          ].join(" ");

          it(description, async () => {
            const response = await instance.handle(params);
            expect(response).to.equal(expected);
          });
        });
      });
    });
  });
});
