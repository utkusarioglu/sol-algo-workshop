import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Mapping } from "_typechain/Mapping";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";
import { storageLayout } from "_deployments/localhost/Mapping.json";
import { strict as assert } from "assert";

const CONTRACT_NAME = "Mapping";

const {
  BigNumber,
  provider: { getStorageAt, send },
  utils: {
    solidityKeccak256,
    arrayify,
    hexlify,
    toUtf8String,
    zeroPad,
    toUtf8Bytes,
  },
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

      describe("Single level", () => {
        it("Gets the already existing value", async () => {
          const expected = "13";
          const key = 1;
          const slot = getSlot("uintStore");
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

        it("Puts short string value", async () => {
          const key = 2;
          const value = "hello bunny";
          const slot = getSlot("uintStore");
          const keyAddress = solidityKeccak256(
            ["uint256", "uint256"],
            [key, slot]
          );
          const binStr = toUtf8Bytes(value);
          const binLength = binStr.length * 2;
          const bytes = new Uint8Array(32);
          bytes.set(binStr);
          bytes[bytes.length - 1] = binLength;
          const binValue = hexlify(bytes);
          await setStorageAt(instance.address, keyAddress, binValue);
          const response = await instance.getItem(2);
          expect(response).to.eq(value);
        });
      });

      describe("Two levels", () => {
        it("Reads long string value", async () => {
          const slot = getSlot("uintStore");
          const key = 3;
          const stringLength = 120;
          const value = "1".repeat(stringLength);
          await instance.setItem(key, value);
          const mappingAddress = solidityKeccak256(
            ["uint256", "uint256"],
            [key, slot]
          );
          const mappingValue = await getStorageAt(
            instance.address,
            mappingAddress
          );
          const bytesLength = arrayify(mappingValue).at(-1);
          if (!bytesLength) throw new Error("Empty bytesLength");
          const dataAddresses = Array(Math.ceil(stringLength / 32))
            .fill(null)
            .map((_, i) =>
              BigNumber.from(solidityKeccak256(["uint256"], [mappingAddress]))
                .add(i)
                .toHexString()
            );
          const binValues = await Promise.all(
            dataAddresses.map(async (dataAddress) => ({
              dataAddress,
              value: await getStorageAt(instance.address, dataAddress),
            }))
          );
          const binAggregate = (
            binValues.reduce((p, c) => {
              p += c.value.slice(2);
              return p;
            }, "0x") as string
          ).slice(0, bytesLength + 2 - 1);
          const response = toUtf8String(binAggregate);
          expect(response).to.eq(value);
        });

        // FIX this only seems to throw an error when the `key` is 3.
        // Figure out why that is.
        it("Writes long string value in mapping", async () => {
          const slotSize = 32;
          const slot = getSlot("uintStore");
          const key = 3;
          const input = "-".repeat(120);
          const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
          const binInput = new TextEncoder().encode(input);
          const binInputLength = binInput.length;
          const hexStringInputLength = binInputLength * 2;
          const binInputByteValue = hexStringInputLength + 1;
          const hexStorageSlotsCount = Math.ceil(binInputLength / slotSize);
          const chunksP1 = solidityKeccak256(["address"], [keyP]);
          const chunksVal = Array(hexStorageSlotsCount)
            .fill(null)
            .map((_, i) => {
              const address: string = BigNumber.from(chunksP1)
                .add(i)
                .toHexString();
              const lowerBound = i * slotSize;
              const upperBound = Math.min(
                (i + 1) * slotSize,
                hexStorageSlotsCount * slotSize
              );
              const binInputSlice = binInput.slice(lowerBound, upperBound);
              const bytesSlice = new Uint8Array(slotSize);
              bytesSlice.set(binInputSlice);
              const value = hexlify(bytesSlice);
              return {
                address,
                value,
              };
            });
          const keyAddressBytes = new Uint8Array(slotSize);
          keyAddressBytes[keyAddressBytes.length - 1] = binInputByteValue;
          const keyVal = hexlify(keyAddressBytes);
          console.log({
            keyP,
            keyVal,
            binInputByteValue,
            chunksP1,
            chunksVal,
          });
          await setStorageAt(instance.address, keyP, keyVal);
          await Promise.all(
            chunksVal.map(({ address, value }) => {
              return setStorageAt(instance.address, address, value);
            })
          );
          const response = await instance.getItem(key);
          expect(response).to.eq(input);
        });
      });

      it("Reads long string in mapping", async () => {
        const slotSize = 32;
        const slot = getSlot("uintStore");
        const key = 10;
        const expected = "-".repeat(120);
        const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
        const keyVal = await getStorageAt(instance.address, keyP);
        const keyArr = arrayify(keyVal);
        const blobHexLenByte = keyArr.at(-1);
        assert(blobHexLenByte);
        const blobHexLen = blobHexLenByte - 1;
        assert(blobHexLen % 2 === 0);
        const blobByteLen = blobHexLen / 2;
        const blobSlotCount = Math.ceil(blobByteLen / slotSize);
        const chunkP1 = solidityKeccak256(["uint256"], [keyP]);
        const chunksHex = await Promise.all(
          Array(blobSlotCount)
            .fill(null)
            .map((_, i) => {
              const chunkP = BigNumber.from(chunkP1).add(i).toHexString();
              return getStorageAt(instance.address, chunkP);
            })
        );
        const blob = chunksHex
          .reduce((p, c) => {
            p += c.slice(2);
            return p;
          }, "0x")
          .slice(0, blobHexLen + 2);
        console.log({ chunksHex, chunkP1, blobHexLenByte, keyVal, keyP });
        const response = toUtf8String(blob);
        expect(response).to.eq(expected);
      });
    });
  });
});
