import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Main } from "_typechain/Main";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Main";

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ index, describeMessage }) => {
    let instance: Main;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<Main>(CONTRACT_NAME, [], index);
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("concat", () => {
        it("Merges two strings as expected", async () => {
          const input = ["hi", "ho"];
          const expected = input.join("");
          const args = input.map((arg) => ethers.utils.toUtf8Bytes(arg));
          const responseRaw = await instance.concat(args[0]!, args[1]!);
          const response = ethers.utils.toUtf8String(responseRaw);
          expect(response).to.eq(expected);
        });
      });

      describe("unicodeStrings", () => {
        it("Draws unicode as expected", async () => {
          const expected = "hello 🌍";
          const responseRaw = await instance.unicodeStrings();
          const response = ethers.utils.parseBytes32String(responseRaw);
          expect(response).to.eq(expected);
        });
      });
    });
  });
});
