import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Proxy, type Target } from "_typechain/Proxy.sol";
import { expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";
// import { storageLayout } from "_deployments/localhost/Proxy.json";
import { inspect } from "util";
import {
  solidityKeccak256,
  solidityPack,
  toUtf8Bytes,
  zeroPad,
  hexlify,
  arrayify,
  toUtf8String,
} from "ethers/lib/utils";
import { BigNumber, providers } from "ethers";

const CONTRACT_NAME = "Proxy";

const {
  // BigNumber,
  provider: { getStorageAt, send },
  // utils: {
  // solidityKeccak256,
  // arrayify,
  // hexlify,
  // toUtf8String,
  // zeroPad,
  // solidityPack,
  // },
  provider: { call },
} = ethers;

// const { storage } = storageLayout;

// const setStorageAt = async (...args: [string, string, string]) =>
//   send("hardhat_setStorageAt", args);

// const getSlot = (label: string): number =>
//   +storage.filter((s: any) => s.label === label)[0]!.slot;

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ index, describeMessage }) => {
    let proxy: Proxy;
    let target: Target;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        signer = (await ethers.getSigners())[index]!;
        const targetFactory = await ethers.getContractFactory("Target", {
          signer,
        });
        const targetInstance = await targetFactory.deploy();
        const proxyFactory = await ethers.getContractFactory("Proxy", {
          signer,
          // args: [targetInstance.address],
          // libraries: {
          //   DelegatedLibrary: libraryInstance.address,
          // },
        });
        proxy = await proxyFactory.deploy(targetInstance.address);
        target = targetInstance;
      });

      describe("Library calls", () => {
        it("delegatecall", async () => {
          const expected = await target.someBehavior();
          const functionSignature = "someBehavior()";
          const functionSelector = ethers.utils
            .id(functionSignature)
            .slice(0, 10);
          const responseRaw = await call({
            to: proxy.address,
            data: solidityPack(["bytes4"], [functionSelector]),
          });
          const responseString = toUtf8String(responseRaw);
          expect(responseString).to.eq(expected);
        });
      });
    });
  });
});
