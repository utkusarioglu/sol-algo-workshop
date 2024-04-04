import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type LongestSubstring as Contract } from "_typechain/LongestSubstring";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "LongestSubstring";

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

      describe("< 32 bytes", () => {
        it("Does what's expected", async () => {
          const str = "cdededefghmnefzAAAZZZ";
          const stringBytes = ethers.encodeBytes32String(str);
          const response = await instance.arrayAsMap(stringBytes);
          const expected = 7n;
          expect(response).to.eq(expected);
        });
      });

      describe(">= 32 bytes", () => {
        it("Does what's expected", async () => {
          const str = "abc".repeat(100);
          const response = await instance.arrayAsMapLong(str);
          const expected = 3n;
          expect(response).to.eq(expected);
        });
      });
    });
  });
});
