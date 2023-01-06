import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Assembly as ContractType } from "_typechain/Assembly";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { BigNumber } from "ethers";

const CONTRACT_NAME = "Assembly";

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ index, describeMessage }) => {
    let instance: ContractType;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const b = await beforeEachFacade<ContractType>(
          CONTRACT_NAME,
          [],
          index
        );
        instance = b.signerInstance;
        signer = b.signer;
      });

      describe("Isolated ops", () => {
        it("add", async () => {
          const args: [number, number] = [2, 3];
          const response = await instance.add(...args);
          const expected = args.reduce((p, c) => p + c, 0);
          expect(response).to.eq(BigNumber.from(expected));
        });

        it.only("Return string", async () => {
          const response = await instance.greeting();
          const expected = "Hello bun!";
          expect(response).to.eq(expected);
        });
      });
    });
  });
});
