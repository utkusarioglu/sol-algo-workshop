import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type DelegateCall as ContractType } from "_typechain/DelegateCall.sol";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";
import { storageLayout } from "_deployments/localhost/DelegateCall.json";
import { inspect } from "util";

const CONTRACT_NAME = "DelegateCall";

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
  testAccounts.forEach(({ index, describeMessage, address }) => {
    let instance: ContractType;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        signer = (await ethers.getSigners())[index]!;
        const libraryFactory = await ethers.getContractFactory(
          "DelegatedLibrary",
          {
            signer,
          }
        );
        const libraryInstance = await libraryFactory.deploy();
        const contractFactory = await ethers.getContractFactory(
          "DelegateCall",
          {
            signer,
            libraries: {
              DelegatedLibrary: libraryInstance.address,
            },
          }
        );
        instance = await contractFactory.deploy();
      });

      describe("Library calls", () => {
        it("delegatecall", async () => {
          const trDelegated = await instance.delegator();
          const rcDelegated = await trDelegated.wait();
          const trNormal = await instance.normal();
          const rcNormal = await trNormal.wait();
          console.log({
            d: rcDelegated.events,
            n: rcNormal.events,
          });

          expect(false).to.equal(true);
        });

        it.only("staticcall", async () => {
          const trDelegated = await instance.staticAddressLibrary();
          // const rcDelegated = await trDelegated.wait();
          // const trNormal = await instance.normal();
          // const rcNormal = await trNormal.wait();
          console.log(trDelegated);
          const response = "0x" + trDelegated.slice(-40);
          console
            .log
            // inspect(rcNormal.events, false, 2, true),
            // inspect(rcDelegated.events, false, 2, true)
            ();
          expect(response).to.equal(address);
        });

        it("staticAddress", async () => {
          const response = await instance.staticAddressLibrary();
          const sender = `0x${response.slice(-40)}`;
          expect(sender).to.eq(address);
        });

        // TODO this returns an address with only a single char
        // difference from the signer. Find out why
        it("delegateAddressLibrary", async () => {
          const transaction = await instance.delegateAddressLibrary();
          const receipt = await transaction.wait();
          const sender = `0x${receipt.events![0]?.data.slice(-40)}`;
          expect(sender).to.eq(address);
        });

        // TODO this returns an address with only a single char
        // difference from the signer. Find out why
        it("delegateAddressContract", async () => {
          const transaction = await instance.delegateAddressContract();
          const receipt = await transaction.wait();
          const sender = `0x${receipt.events![0]?.data.slice(-40)}`;
          expect(sender).to.eq(address);
        });

        // it("delegatedOriginLibrary", async () => {

        // });
      });
    });
  });
});
