import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Storage } from "_typechain/Storage";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";
import { storageLayout } from "_deployments/localhost/Storage.json";

const CONTRACT_NAME = "Storage";

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

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ index, describeMessage }) => {
    let instance: Storage;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<Storage>(
          CONTRACT_NAME,
          [],
          index
        );
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("Storage slot manipulation", () => {
        it("Manipulates Numbers", async () => {
          const input = 13;
          const arg = hexlify(
            zeroPad(BigNumber.from(input).toHexString(), 32)
          ).toString();
          await setStorageAt(instance.address, "0x1", arg);
          await ethers.provider.send("evm_mine", []);
          const response = await instance.getNum();
          expect(response).to.eq(ethers.BigNumber.from(input));
        });

        it("Manipulates single level mapping", async () => {
          const key = 6;
          const value = 3;
          const slot = 0;
          const index = ethers.utils.solidityKeccak256(
            ["uint256", "uint256"],
            [key, slot]
          );
          const binaryValue = ethers.utils
            .hexlify(
              ethers.utils.zeroPad(
                ethers.BigNumber.from(value).toHexString(),
                32
              )
            )
            .toString();
          await setStorageAt(instance.address, index, binaryValue);
          const response = await instance.map(key);
          const expected = ethers.BigNumber.from(value);
          expect(response).to.equal(expected);
        });

        it("Manipulates single level array", async () => {
          const slot = getSlot("arr");
          const value = 7;
          const binaryValue = hexlify(
            zeroPad(BigNumber.from(value).toHexString(), 32)
          );
          const arrayDataIndex = hexlify(
            zeroPad(solidityKeccak256(["uint256"], [slot]), 32)
          );
          const arrLengthRaw = await getStorageAt(instance.address, slot);
          const arrayLengthNew = hexlify(
            zeroPad(BigNumber.from(arrLengthRaw).add(1).toHexString(), 32)
          );
          const arraySlotIndex = `0x${slot}`;
          await setStorageAt(instance.address, arraySlotIndex, arrayLengthNew);
          await setStorageAt(instance.address, arrayDataIndex, binaryValue);
          const response = await instance.peek(0);
          const expected = ethers.BigNumber.from(value);
          expect(response).to.eq(expected);
        });

        it("Reads string", async () => {
          const slot = getSlot("str");
          const pointerBinValue = await getStorageAt(instance.address, slot);
          const expected = "hello";
          const byteArray = arrayify(pointerBinValue);
          const byteLength = byteArray.at(-1);
          if (!byteLength) throw "Indeterminate byte length";
          const response = toUtf8String(
            pointerBinValue.slice(0, byteLength + 2)
          );
          expect(response).to.equal(expected);
        });

        it("Reads single slot string", async () => {
          const slot = getSlot("str");
          const expected = "0123456789".repeat(3) + "A";
          const expectedLength = expected.length;
          await instance.setStr(expected);
          const pointerBinValue = await getStorageAt(instance.address, slot);
          const pointerBinArray = arrayify(pointerBinValue);
          const binValueLength = pointerBinArray.at(-1);
          if (!binValueLength) throw "Indeterminate byte length";
          const binStringLength = binValueLength / 2;
          const binString = toUtf8String(pointerBinArray.slice(0, -1));
          expect(binStringLength).to.eq(expectedLength);
          expect(binString).to.eq(expected);
        });

        it("Manipulates single slot string", async () => {
          const slot = getSlot("str");
          const input = "0".repeat(31);
          const bytes = new Uint8Array(32);
          new TextEncoder().encodeInto(input, bytes);
          bytes[bytes.length - 1] = input.length * 2;
          await setStorageAt(instance.address, `0x${slot}`, hexlify(bytes));
          const response = await instance.str();
          expect(response).to.eq(input);
        });

        it("Reads multi-slot string", async () => {
          const slot = getSlot("str");
          const expected = "-".repeat(100);
          await instance.setStr(expected);
          const pointerBin = await getStorageAt(instance.address, slot);
          const pointerArray = arrayify(pointerBin);
          const binLength = pointerArray.slice(-1)[0]! - 1;
          const charLength = binLength / 2;
          const dataStartAddress = solidityKeccak256(["uint256"], [slot]);

          const dataSeriesLength = Math.ceil(binLength / 32);
          const addresses = Array(dataSeriesLength)
            .fill(dataStartAddress)
            .map((address, i) => {
              return BigNumber.from(address).add(i).toHexString();
            });
          const chunks = await Promise.all(
            addresses.map(async (address) => {
              const dataBin = await getStorageAt(instance.address, address);
              return arrayify(dataBin);
            })
          );
          const chunksLengths = chunks.map((chunk) => chunk.length);
          const getSeriesLen = (index: number) => {
            return chunksLengths.slice(0, index).reduce((p, c) => p + c, 0);
          };
          const bytes = chunks.reduce((p, c, i) => {
            p.set(c, getSeriesLen(i));
            return p;
          }, new Uint8Array(getSeriesLen(chunksLengths.length)));
          const response = new TextDecoder().decode(bytes).slice(0, charLength);
          expect(response).to.eq(expected);
        });
      });
    });
  });
});
