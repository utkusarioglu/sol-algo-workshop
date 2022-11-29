import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Caching } from "_typechain/Caching";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Caching";

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ index, describeMessage }) => {
    let instance: Caching;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<Caching>(
          CONTRACT_NAME,
          [],
          index
        );
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("Gas comparison", () => {
        it("Saves gas", async () => {
          const noCacheResponse = await instance.noCache();
          const cacheResponse = await instance.cache();
          console.log(await instance.estimateGas.cache());
          console.log(await instance.estimateGas.noCache());
          expect(noCacheResponse).to.equal(cacheResponse);
        });
      });
    });
  });
});
