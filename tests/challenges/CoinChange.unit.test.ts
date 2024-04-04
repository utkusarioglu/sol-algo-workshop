import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type CoinChange as Contract } from "_typechain/CoinChange";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "CoinChange";

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
              denominations: [1n, 2n, 5n],
              amount: 11n,
            },
            expected: 3n,
          },
          {
            params: {
              denominations: [2n],
              amount: 3n,
            },
            expected: -1n,
          },
          {
            params: {
              denominations: [1n],
              amount: 0n,
            },
            expected: 0n,
          },
        ].forEach(({ params: { denominations, amount }, expected }) => {
          const description = [
            denominations.map(Number),
            ", ",
            Number(amount),
            " => ",
            Number(amount),
          ].join("");

          it(description, async () => {
            const response = await instance.handle(denominations, amount);
            expect(response).to.equal(expected);
          });
        });
      });
    });
  });
});
