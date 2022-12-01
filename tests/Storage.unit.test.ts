import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Storage } from "_typechain/Storage";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "Storage";

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
          const arg = ethers.utils
            .hexlify(
              ethers.utils.zeroPad(
                ethers.BigNumber.from(input).toHexString(),
                32
              )
            )
            .toString();
          await ethers.provider.send("hardhat_setStorageAt", [
            instance.address,
            "0x1",
            arg,
          ]);
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
          ethers.provider.send("hardhat_setStorageAt", [
            instance.address,
            index,
            binaryValue,
          ]);
          const response = await instance.map(key);
          const expected = ethers.BigNumber.from(value);
          expect(response).to.equal(expected);
        });

        it("Manipulates single level array", async () => {
          const {
            storageLayout,
          } = require("artifacts/deployments/localhost/Storage.json");
          const slot = +storageLayout.storage.filter(
            (item: any) => item.label === "arr"
          )[0].slot;
          const value = 7;
          const binaryValue = ethers.utils.hexlify(
            ethers.utils.zeroPad(ethers.BigNumber.from(value).toHexString(), 32)
          );
          const arrayDataIndex = ethers.utils.hexlify(
            ethers.utils.zeroPad(
              ethers.utils.solidityKeccak256(["uint256"], [slot]),
              32
            )
          );
          const arrLengthRaw = await ethers.provider.getStorageAt(
            instance.address,
            slot
          );
          const arrayLengthNew = ethers.utils.hexlify(
            ethers.utils.zeroPad(
              ethers.BigNumber.from(arrLengthRaw).add(1).toHexString(),
              32
            )
          );
          const arraySlotIndex = `0x${slot}`;
          await ethers.provider.send("hardhat_setStorageAt", [
            instance.address,
            arraySlotIndex,
            arrayLengthNew,
          ]);
          await ethers.provider.send("hardhat_setStorageAt", [
            instance.address,
            arrayDataIndex,
            binaryValue,
          ]);
          const response = await instance.peek(0);
          const expected = ethers.BigNumber.from(value);
          expect(response).to.eq(expected);
        });

        it.only("Manipulates string", async () => {
          const { BigNumber } = ethers;
          const { arrayify, toUtf8String } = ethers.utils;
          const {
            storageLayout,
          } = require("artifacts/deployments/localhost/Storage.json");
          const slot = +storageLayout.storage.filter(
            (item: any) => item.label === "str"
          )[0].slot;
          const pointerBinValue = await ethers.provider.getStorageAt(
            instance.address,
            slot
          );
          const expected = "hello";
          const byteArray = arrayify(pointerBinValue);
          const stringLength = BigNumber.from(
            Array.from(byteArray)
              .reverse()
              .reduce((p, c, i, a) => {
                if (c === 0) {
                  a.splice(i);
                } else {
                  p.push(c);
                }
                return p;
              }, [] as number[])
          )
            .div(2)
            .toNumber();
          const response = toUtf8String(
            pointerBinValue.slice(0, stringLength * 2 + 2)
          );
          console.log({ byteArray, stringLength, stringBinary: response });
          expect(response).to.equal(expected);
        });
      });
    });
  });
});
