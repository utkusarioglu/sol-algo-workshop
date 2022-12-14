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

      describe("uint256ToStringStore", () => {
        it("Single Level", () => {
          it("Gets the already existing value", async () => {
            const expected = "13";
            const key = 1;
            const slot = getSlot("uint256ToStringStore");
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
            const slot = getSlot("uint256ToStringStore");
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
            const slot = getSlot("uint256ToStringStore");
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
            const slot = getSlot("uint256ToStringStore");
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
          const slot = getSlot("uint256ToStringStore");
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

      describe("uint256ToUint8Store", () => {
        describe("Single Level", () => {
          it("Reads number", async () => {
            const slot = getSlot("uint256ToUint8Store");
            const key = 1;
            const expected = 3;
            const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
            const keyHex = await getStorageAt(instance.address, keyP);
            const keyVal = BigNumber.from(keyHex).toNumber();
            expect(keyVal).to.eq(expected);
          });
        });
      });

      describe("uint256ToUint64ArrStore", () => {
        describe("Reads dynamic array", () => {
          /**
           * Reads a dynamic array using a simple reducer that requires two
           * `reverse` operations to get the data in the right order.
           */
          it("Reads dynamic array 1", async () => {
            const slotSize = 32;
            const elemSize = 8; // 64 bits
            const slot = getSlot("uint256ToUint64ArrStore");
            const key = 1;
            const expected = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
            const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
            const keyHex = await getStorageAt(instance.address, keyP);
            const keyArrayified = arrayify(keyHex);
            const elemCount = keyArrayified.at(-1);
            assert(elemCount);
            const elemPerSlot = slotSize / elemSize;
            const chunksLength = Math.ceil(elemCount / elemPerSlot);
            const chunkP1 = solidityKeccak256(["uint256"], [keyP]);
            const chunks = await Promise.all(
              Array(chunksLength)
                .fill(null)
                .map(async (_, i) =>
                  getStorageAt(
                    instance.address,
                    BigNumber.from(chunkP1).add(i).toHexString()
                  )
                )
            );

            const flatReducer = (p: number[], c: string) => {
              for (let i = 0; i < elemPerSlot; i++) {
                const lowerBound = i * elemSizeHex + 2;
                const upperBound = (i + 1) * elemSizeHex + 2;
                const hexVal = "0x" + c.slice(lowerBound, upperBound);
                const decimalVal = BigNumber.from(hexVal).toNumber();
                p.push(decimalVal);
              }
              return p;
            };

            const elemSizeHex = elemSize * 2;
            const values = chunks
              .reverse()
              .reduce(flatReducer, [] as number[])
              .reverse()
              .slice(0, elemCount);
            expect(values).to.deep.eq(expected);
          });

          /**
           * Reads a dynamic array using a reducer that reads the data in
           * reverse, avoiding the need for using the `reverse` function.
           * Uses the `slotIndex` variable to track the elements of the final
           * array, manipulates inside the `for` block to find their location
           * inside the hex chunk.
           */
          it("Reads dynamic array 2", async () => {
            const slotSize = 32;
            const elemSize = 8; // 64 bits
            const slot = getSlot("uint256ToUint64ArrStore");
            const key = 1;
            const expected = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
            const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
            const keyHex = await getStorageAt(instance.address, keyP);
            const keyArrayified = arrayify(keyHex);
            const elemCount = keyArrayified.at(-1);
            assert(elemCount);
            const elemPerSlot = slotSize / elemSize;
            const chunksLength = Math.ceil(elemCount / elemPerSlot);
            const chunkP1 = solidityKeccak256(["uint256"], [keyP]);
            const chunks = await Promise.all(
              Array(chunksLength)
                .fill(null)
                .map(async (_, i) =>
                  getStorageAt(
                    instance.address,
                    BigNumber.from(chunkP1).add(i).toHexString()
                  )
                )
            );

            const reverseReducer = (
              p: number[],
              c: string,
              chunkIndex: number
            ) => {
              loop: for (
                let slotIndex = elemPerSlot - 1;
                slotIndex >= 0;
                slotIndex--
              ) {
                if (
                  chunkIndex === chunksLength - 1 &&
                  slotIndex < emptyBlocks
                ) {
                  continue loop;
                }
                const lowerBound = slotIndex * elemSizeHex + 2;
                const upperBound = (slotIndex + 1) * elemSizeHex + 2;
                const hexVal = "0x" + c.slice(lowerBound, upperBound);
                const decimalVal = BigNumber.from(hexVal).toNumber();
                p.push(decimalVal);
              }
              return p;
            };

            const elemSizeHex = elemSize * 2;
            const emptyBlocks = chunksLength * elemPerSlot - elemCount;
            const values = chunks.reduce(reverseReducer, [] as number[]);
            expect(values).to.deep.eq(expected);
          });

          /**
           * Reads a dynamic array using a reverse reducer that uses hex string
           * indexing rather than indexing for the uint64 sections of the slot
           * that represent each number. Unlike the previous reducer, this one
           * handles all determination required for locating the numbers in the
           * hex string inside the `for()` statement.
           */
          it("Reads dynamic array 3", async () => {
            const slotSize = 32;
            const elemSize = 8; // 64 bits
            const slot = getSlot("uint256ToUint64ArrStore");
            const key = 1;
            const expected = [2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
            const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
            const keyHex = await getStorageAt(instance.address, keyP);
            const keyArrayified = arrayify(keyHex);
            const elemCount = keyArrayified.at(-1);
            assert(elemCount);
            const elemPerSlot = slotSize / elemSize;
            const chunksLength = Math.ceil(elemCount / elemPerSlot);
            const chunkP1 = solidityKeccak256(["uint256"], [keyP]);
            const chunks = await Promise.all(
              Array(chunksLength)
                .fill(null)
                .map(async (_, i) =>
                  getStorageAt(
                    instance.address,
                    BigNumber.from(chunkP1).add(i).toHexString()
                  )
                )
            );

            const reverseLoopHeavyReducer = (
              p: number[],
              c: string,
              chunkIndex: number
            ) => {
              const padding = "0x";
              loop: for (
                let hexIndex = (elemPerSlot - 1) * elemSizeHex + padding.length;
                hexIndex >= padding.length;
                hexIndex = hexIndex - elemSizeHex
              ) {
                if (
                  chunkIndex === chunksLength - 1 &&
                  hexIndex < emptyBlocks * elemSizeHex + padding.length
                ) {
                  continue loop;
                }
                const hexVal =
                  padding + c.slice(hexIndex, hexIndex + elemSizeHex);
                const decimalVal = BigNumber.from(hexVal).toNumber();
                p.push(decimalVal);
              }
              return p;
            };

            const elemSizeHex = elemSize * 2;
            const emptyBlocks = chunksLength * elemPerSlot - elemCount;
            const values = chunks.reduce(
              reverseLoopHeavyReducer,
              [] as number[]
            );

            expect(values).to.deep.eq(expected);
          });
        });

        it("Reads short uint64 array", async () => {
          const slotSize = 32;
          const elemByteSize = 8; // 64 bits
          const elemHexSize = elemByteSize * 2;
          const slotMaxElemCount = slotSize / elemByteSize;
          assert(Number.isInteger(slotMaxElemCount));
          const slot = getSlot("uint256ToUint64ArrStore");
          const key = 2;
          const expected = [21, 32];
          const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
          const keyHex = await getStorageAt(instance.address, keyP);
          const elemCount = arrayify(keyHex).at(-1);
          assert(elemCount);
          const blobP = solidityKeccak256(["uint256"], [keyP]);
          const blobHex = await getStorageAt(instance.address, blobP);
          const padding = "0x";
          const members = Array(elemCount)
            .fill(null)
            .map((_, i) => {
              const start =
                padding.length + (slotMaxElemCount - i - 1) * elemHexSize;
              const end = padding.length + (slotMaxElemCount - i) * elemHexSize;
              return BigNumber.from(
                padding + blobHex.slice(start, end)
              ).toNumber();
            });
          expect(members).to.deep.eq(expected);
        });
      });

      describe("uint256ToUint128StaticStore", () => {
        it("Reads static uint128 array in mapping", async () => {
          const slotByteSize = 32;
          const elemByteSize = 16;
          const elemHexSize = elemByteSize * 2;
          const elemPerSlot = slotByteSize / elemByteSize;
          assert(Number.isInteger(elemPerSlot));
          const slot = getSlot("uint256ToUint128StaticStore");
          const key = 4;
          const expected = [7, 13];
          const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
          const keyHex = await getStorageAt(instance.address, keyP);
          const hexIndicator = "0x";
          const members = Array(expected.length)
            .fill(null)
            .map((_, i) => {
              const start =
                hexIndicator.length + (elemPerSlot - i - 1) * elemHexSize;
              const end = hexIndicator.length + (elemPerSlot - i) * elemHexSize;
              const hexValue = hexIndicator + keyHex.slice(start, end);
              return BigNumber.from(hexValue).toNumber();
            });
          expect(members).to.eq(expected);
        });
      });

      describe("uint256ToBoolStaticStore", () => {
        it.only("Reads bool static bool values in mapping", async () => {
          const slotByteSize = 32;
          const slot = getSlot("uint256ToBoolStaticStore");
          const key = 17;
          const expected = [true, true, false, true];
          const keyP = solidityKeccak256(["uint256", "uint256"], [key, slot]);
          const keyHex = await getStorageAt(instance.address, keyP);
          const keyArrayified = arrayify(keyHex);
          const members = keyArrayified.slice(-expected.length).reverse();
          assert(members.length == 4);
          const response = Array.from(members).map((n) => !!n);
          expect(response).to.deep.eq(expected);
        });
      });
    });
  });
});
