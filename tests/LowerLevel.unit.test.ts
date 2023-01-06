import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type Storage } from "_typechain/Storage";
import { beforeEachFacade, expect, testAccounts } from "_services/test.service";
import { ethers } from "hardhat";
import { storageLayout } from "_deployments/localhost/Storage.json";
import { Event } from "ethers";
import { inspect } from "util";
// import { write, writeFileSync } from "fs";

const CONTRACT_NAME = "ConstructorLog";

const {
  BigNumber,
  provider: { getStorageAt, send },
  utils: { solidityKeccak256, arrayify, hexlify, toUtf8String, zeroPad },
  getContractFactory,
} = ethers;

const { storage } = storageLayout;

const setStorageAt = async (...args: [string, string, string]) =>
  send("hardhat_setStorageAt", args);

const getSlot = (label: string): number =>
  +storage.filter((s: any) => s.label === label)[0]!.slot;

describe(CONTRACT_NAME, () => {
  // testAccounts.forEach(({ index, describeMessage }) => {
  testAccounts.forEach(({}) => {
    let instance: Storage;
    let signer: SignerWithAddress;

    // describe(describeMessage, () => {
    //   beforeEach(async () => {
    //     const common = await beforeEachFacade<Storage>(
    //       CONTRACT_NAME,
    //       [],
    //       index
    //     );
    //     instance = common.signerInstance;
    //     signer = common.signer;
    //   });

    describe("Deployment", () => {
      it("Deploys with event", async () => {
        //
        const ConstructorLog = await getContractFactory("ConstructorLog");
        const instance = await ConstructorLog.deploy(7);
        const deployTransaction = instance.deployTransaction;
        const receipt = await deployTransaction.wait();
        // TODO find type `ContractTransactionReceipt`
        // @ts-ignore
        const event = receipt.events[0] as Event;
        const decoded = event.decode!(event.data);
        // const filter = {
        //   address: instance.address,
        //   topics: receipt.logs[0]?.topics,
        // };
        const filter1 = instance.filters["Creation(address,uint256,uint256)"]();
        const filter2 = instance.filters["Creation"](null, null, null);
        const filter3 = instance.filters["Creation"](instance.address);
        const filter4 = instance.filters["CreationAnon"](
          "0x" +
            Array(10)
              .fill(null)
              .map((_, i) => i)
              .join("")
              .repeat(4),
          3
        );
        const longString =
          "this is a very very very very very veryveryveryveryveryvery veryveryveryveryveryevry long string that is very very veryveryveryveryevryevryervy long";
        const filter5 = instance.filters["LongAnon"](longString);
        const eventSignature1 = solidityKeccak256(
          ["string"],
          ["Creation(address,uint256,uint256)"]
        );
        const eventSignature2 = solidityKeccak256(["string"], ["Creation"]);
        const varHash = solidityKeccak256(["string"], [longString]);

        const queryFilter = await instance.queryFilter(filter3);
        console.log({
          // deployTransaction: instance.deployTransaction,
          filter1,
          filter2,
          filter3,
          filter4,
          filter5,
          varHash,
          queryFilter,
          eventSignature1,
          eventSignature2,
          // receipt,
          // event,
          // queryFilter,
          // decoded,
        });
        expect(true).to.eq(false);
      });

      it.only("Gas left", async () => {
        const factory = await getContractFactory("ConstructorLog");
        const instance = await factory.deploy(8);
        const response = instance.delegator();
        // const request = await instance.delegator();
        try {
          const transaction = await response;
          // const trace = await ethers.provider.send("debug_traceTransaction", [
          //   transaction.hash,
          // ]);
          const receipt = await transaction.wait();
          console.log({
            transaction,
            // receipt,
          });
          // writeFileSync("./trace", JSON.stringify(trace, null, 2));
          console.log(
            inspect(receipt, {
              showHidden: false,
              depth: null,
              colors: true,
            })
          );
        } catch (e) {
          console.log(e);
        }
        return expect(response).to.be.reverted;
      });
    });
  });
});
