import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type ContainerWithMostWater as Contract } from "_typechain/ContainerWithMostWater";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "ContainerWithMostWater";

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
            params: [1, 8, 6, 2, 5, 4, 8, 3, 7].map((v) => BigInt(v)),
            expected: 49n,
          },
          {
            params: [1n, 1n],
            expected: 1n,
          },
        ].forEach(({ params, expected }) => {
          it("", async () => {
            const response = await instance.handle(params);
            expect(response).to.equal(expected);
          });
        });
      });
    });
  });
});
