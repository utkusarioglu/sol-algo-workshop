import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Mapping } from "_typechain/Mapping";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";
import { storageLayout } from "_deployments/localhost/Mapping.json";

const CONTRACT_NAME = "Mapping";

const {
  BigNumber,
  provider: { getStorageAt, send },
  utils: { solidityKeccak256, arrayify, hexlify, toUtf8String, zeroPad },
} = ethers;

const { storage } = storageLayout;

const setStorageAt = async (...args: [string, string, string]) =>
  send("hardhat_setStorageAt", args);

const getSlot = (label: string): number =>
  +storage.filter((s: any) => s.label === label)[0]!.slot;

let instance: Mapping;
let signer: SignerWithAddress;

before(async () => {
  const common = await beforeEachFacade<Mapping>(CONTRACT_NAME, [], 0);
  instance = common.signerInstance;
  signer = common.signer;
});

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ describeMessage }) => {
    describe(describeMessage, () => {
      beforeEach(async () => {});

      describe("", () => {
        it("Gets the already existing value", async () => {
          const expected = "13";
          const key = 1;
          const slot = getSlot("store");
          const storageAddress = solidityKeccak256(
            ["uint256", "uint256"],
            [key, slot]
          );
          const storageValue = await getStorageAt(
            instance.address,
            storageAddress
          );
          const byteLength = storageValue.at(-1);
          if (!byteLength) throw new Error("byteLength empty");
          const stringValue = toUtf8String(
            storageValue.slice(0, +byteLength + 2)
          );
          expect(stringValue).to.eq(expected);
        });
      });
    });
  });
});
