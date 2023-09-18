import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type MinHeap as Contract } from "_typechain/MinHeap";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers } from "hardhat";
import type { ContractTransactionResponse } from "ethers";

const CONTRACT_NAME = "MinHeap";

function BigIntMin(...bigInts: bigint[]) {
  return BigIntSort(bigInts).at(0);
}

function BigIntSort(bigIntArray: bigint[]): bigint[] {
  return bigIntArray.sort((a, b) => Number(a - b)).map((v) => BigInt(v));
}

function insertParamList(
  instance: Contract,
  modifiedParamList: bigint[]
): Promise<ContractTransactionResponse[]> {
  return Promise.all(modifiedParamList.map((param) => instance.insert(param)));
}

const ARRAY_MODIFIERS = [<T>(v: T[]) => v, <T>(v: T[]) => v.reverse()];

const PARAM_LISTS = [
  [3n, 5n],
  [3n, 5n, 1n],
  [3n, 5n, 9n, 1n, 1n],
  [3n, 5n, 9n, 1n, 1n, 13n, 21n, 2n, 11n, 16n],
  Array(20).fill(1n),
  Array(30)
    .fill(null)
    .map((_, i) => BigInt(i))
    .reverse(),
  Array(30)
    .fill(null)
    .map((_, i) => BigInt(i)),
];

describe(CONTRACT_NAME, () => {
  testAccounts.slice(0, 1).forEach(({ index, describeMessage }) => {
    let instance: Contract;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        const common = await beforeEachFacade<Contract>(
          CONTRACT_NAME,
          [],
          index
        );
        instance = common.signerInstance;
        signer = common.signer;
      });

      describe("Insert", () => {
        describe("Single", () => {
          it("Inserts", async () => {
            const param = 3n;
            await instance.insert(3);
            const response = await instance.getHead();
            const expected = param;

            expect(response).to.eq(expected);
          });
        });

        PARAM_LISTS.forEach((paramList) => {
          describe(`${paramList.length} Elements`, () => {
            ARRAY_MODIFIERS.forEach((modifier) => {
              const modifiedParamList = modifier(paramList);

              it(
                [
                  "Inserts ",
                  paramList.length,
                  " (",
                  modifiedParamList.join(", "),
                  ")",
                ].join(""),
                async () => {
                  await insertParamList(instance, modifiedParamList);
                  const response = await instance.getHead();
                  const expected = BigIntMin(...modifiedParamList);

                  expect(response).to.eq(expected);
                }
              );

              it(
                [
                  "Removes and reorders ",
                  paramList.length,
                  " elements: (",
                  paramList.join(", "),
                  ")",
                ].join(""),
                async () => {
                  const modifiedParamList = modifier(paramList);
                  const sortedParamList = BigIntSort(paramList);
                  const responses: bigint[] = [];
                  await insertParamList(instance, modifiedParamList);
                  await sortedParamList.reduce(async (acc) => {
                    acc = acc.then(async () => {
                      const response = await instance.getHead();
                      responses.push(response);
                      await instance.popHead();
                    });
                    return acc;
                  }, Promise.resolve());

                  expect(responses).to.deep.eq(sortedParamList);
                }
              );
            });
          });
        });
      });
    });
  });
});
