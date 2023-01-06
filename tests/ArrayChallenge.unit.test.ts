import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type ArrayChallenge as ContractType } from "_typechain/ArrayChallenge.sol";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";
import { storageLayout } from "_deployments/localhost/ArrayChallenge.json";
import { inspect } from "util";

const CONTRACT_NAME = "ArrayChallenge";

const {
  BigNumber,
  provider: { getStorageAt, send },
  utils: { solidityKeccak256, arrayify, hexlify, toUtf8String, zeroPad },
} = ethers;

// const { storage } = storageLayout;

// const setStorageAt = async (...args: [string, string, string]) =>
//   send("hardhat_setStorageAt", args);

// const getSlot = (label: string): number =>
//   +storage.filter((s: any) => s.label === label)[0]!.slot;

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ index, describeMessage }) => {
    let instance: ContractType;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        signer = (await ethers.getSigners())[index]!;
        const mathLibraryFactory = await ethers.getContractFactory(
          "MathLibrary",
          {
            signer,
          }
        );
        const mathLibraryInstance = await mathLibraryFactory.deploy();
        const arrayLibraryFactory = await ethers.getContractFactory(
          "ArrayLibrary",
          {
            signer,
          }
        );
        const arrayLibraryInstance = await arrayLibraryFactory.deploy();
        const contractFactory = await ethers.getContractFactory(
          "ArrayChallenge",
          {
            signer,
            libraries: {
              MathLibrary: mathLibraryInstance.address,
              ArrayLibrary: arrayLibraryInstance.address,
            },
          }
        );
        instance = await contractFactory.deploy();
      });

      describe("Library calls", () => {
        it("delegatecall", async () => {
          const inputArray = [3, 1, 3, 5, 10, 6, 4, 3, 1];
          const responseRaw = await instance.arrayChallenge(inputArray);
          const response = responseRaw.map((bn) => bn.toBigInt());
          const expected = ["1", "2", "3", "5", "6", "6", "4", "3"].map((n) =>
            BigInt(n)
          );
          expect(response).to.deep.eq(expected);
        });
      });
    });
  });
});
