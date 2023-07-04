import { type SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { type NextjsGrpcSubscription } from "_typechain/NextjsGrpcSubscription.sol";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";

const CONTRACT_NAME = "NextjsGrpcSubscription";
const EPOCH_COST = 2n;

describe(CONTRACT_NAME, () => {
  testAccounts.forEach(({ index, describeMessage }) => {
    let instance: NextjsGrpcSubscription;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<NextjsGrpcSubscription>(
          CONTRACT_NAME,
          [EPOCH_COST],
          index
        );
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("constructor", () => {
        it("Has expected epochCost", async () => {
          const response = await instance.epochCost();
          const expected = 2n;
          expect(response).to.eq(expected);
        });
      });

      /**
       * Tests the subscription feature but doesn't test anything related
       * to how the balance is handled. This block only cares about
       * whether the contract can handle subscriptions in normal and edge
       * cases.
       */
      describe("subscribe", () => {
        it("Reverts when given no value", async () => {
          const inFlight = instance.subscribe(1n, { value: 0n });
          return expect(inFlight).to.be.revertedWithCustomError(
            { interface: instance.interface },
            "FeeRequired"
          );
        });

        /**
         * @dev
         * #1 `-1n` means that the given value is 1 less than what is needed
         *    for this transaction.
         */
        it("Reverts when given insufficient value", async () => {
          const subscriptionSeconds = 1n;
          const inFlight = instance.subscribe(1n, {
            value: subscriptionSeconds * EPOCH_COST - 1n, // #1
          });
          return expect(inFlight).to.be.revertedWithCustomError(
            { interface: instance.interface },
            "InsufficientFee"
          );
        });

        /**
         * @dev
         * TODO discover the true meaning of the `+ 1n`
         * #1 The involvement of `+ 1n` here may be due to the `latest` block
         *    still being the block prior to the mining of the block that
         *    carries the transaction we care about. If that's the case, this
         *    `+ 1n` value should fail on a live network (or even on ganache)
         *     at least occasionally.
         */
        it("Subscribes as expected when given exact amount", async () => {
          const subscriptionSeconds = 100n;
          const receipt = instance.subscribe(subscriptionSeconds, {
            value: subscriptionSeconds * EPOCH_COST,
          });

          return expect(receipt)
            .to.emit(instance, "Subscription")
            .withArgs(
              signer.address,
              await (async () =>
                BigInt(
                  (await ethers.provider.getBlock("latest"))?.timestamp || 0
                ) +
                subscriptionSeconds +
                1n)(), // #1
              0n
            );
        });
      });

      /**
       * Tests the balance handling. This includes balance handling
       * during subscriptions. Such as, the correct balance being registered
       * when the user makes a new deposit.
       */
      describe("getBalance", () => {
        it("Has 0 balance when there is no subscription", async () => {
          const response = await instance.getSubscription();
          const expected = asEvmObject({
            expirationEpoch: 0n,
            balance: 0n,
          }).struct;
          expect(response).to.deep.equal(expected);
        });

        it("Has 0 balance when the subscription seconds matches the value", async () => {
          const subscriptionSeconds = 1n;
          await instance.subscribe(subscriptionSeconds, {
            value: subscriptionSeconds * EPOCH_COST,
          });
          const latestBlock = await ethers.provider.getBlock("latest");
          if (!latestBlock) {
            throw new Error("Latest block cannot be retrieved");
          }
          const blockTimestamp = BigInt(latestBlock.timestamp);
          const response = await instance.getSubscription();
          const expected = asEvmObject({
            expirationEpoch: blockTimestamp + subscriptionSeconds,
            balance: 0n,
          }).struct;
          expect(response).to.deep.equal(expected);
        });

        [1n, 10n, 100n, 1000n].forEach((extraValue) => {
          it(`Has ${extraValue} balance when paid beyond subscription seconds`, async () => {
            const subscriptionSeconds = 1n;
            await instance.subscribe(subscriptionSeconds, {
              value: subscriptionSeconds * EPOCH_COST + extraValue,
            });
            const latestBlock = await ethers.provider.getBlock("latest");
            if (!latestBlock) {
              throw new Error("Latest block cannot be retrieved");
            }
            const blockTimestamp = BigInt(latestBlock.timestamp);
            const response = await instance.getSubscription();
            const expected = asEvmObject({
              expirationEpoch: blockTimestamp + subscriptionSeconds,
              balance: extraValue,
            }).struct;
            expect(response).to.deep.equal(expected);
          });
        });
      });

      describe("owner", () => {
        it("Assigns expected owner", async () => {
          // @ts-expect-error
          // FIX typechain is not working as expected in 0.8.18
          const response = await instance.owner();
          expect(response).to.equal(testAccounts[0]?.address);
        });
      });

      describe("withdraw", () => {
        it.only("Only allows the owner to withdraw", async () => {
          const expectedCustomError = "OnlyOwner";
          const customErrorArgs: [any, string] = [
            { interface: instance.interface },
            expectedCustomError,
          ];
          // @ts-expect-error
          // FIX typechain is not working as expected in 0.8.18
          const tx = instance.withdraw(1n);
          if (signer.address === testAccounts[0]?.address) {
            return expect(tx).to.not.be.revertedWithCustomError(
              ...customErrorArgs
            );
          } else {
            return expect(tx).to.be.revertedWithCustomError(...customErrorArgs);
          }
        });
      });
    });
  });
});
