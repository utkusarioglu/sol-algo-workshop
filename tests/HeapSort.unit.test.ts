import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type HeapSort as Contract } from "_typechain/HeapSort";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  testAccounts,
  getSigner,
} from "_services/test.service";
import { ethers, run } from "hardhat";
import type { BaseContract } from "ethers";

const CONTRACT_NAME = "HeapSort";

const PARAM_LISTS = [
  [3, 2, 1],
  [3, 2, 1, 1],
  [3, 2, 1, 3],
  [1, 1, 1, 1],
  [1, 2, 3, 4, 5],
  Array(100)
    .fill(null)
    .map((_, i) => i),
  Array(100)
    .fill(null)
    .map((_, i) => i)
    .reverse(),
];

describe(CONTRACT_NAME, () => {
  testAccounts.slice(0, 1).forEach(({ index, describeMessage }) => {
    let instance: Contract;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        await run("compile", { quiet: true, noTypechain: true });
        const deployer = await getSigner(0);
        const currentSigner = await getSigner(index);
        const maxHeapContractFactory = await ethers.getContractFactory(
          "MaxHeap",
          deployer
        );
        const maxHeapInstance = await maxHeapContractFactory.deploy();
        const heapSortContractFactory = await ethers.getContractFactory(
          "HeapSort",
          deployer
        );
        const heapSortInstance = await heapSortContractFactory.deploy(
          await maxHeapInstance.getAddress()
        );
        const signerInstance = heapSortInstance.connect(currentSigner);
        instance = signerInstance;
        signer = currentSigner;
      });

      describe("sortReverse", () => {
        PARAM_LISTS.forEach((unsorted) => {
          it(`Can sort ${unsorted.join(", ")}`, async () => {
            await unsorted.reduce((acc, curr) => {
              acc = acc.then(() => {
                instance.insert(curr);
              });
              return acc;
            }, Promise.resolve());
            await instance.sortReverse();
            const response = await instance.getSorted();
            const expected = unsorted
              .sort((a, b) => a - b)
              .map((n) => BigInt(n))
              .reverse();
            expect(response).to.deep.eq(expected);
          });
        });
      });

      describe("sort", () => {
        PARAM_LISTS.forEach((unsorted) => {
          it(`Can sort ${unsorted.join(", ")}`, async () => {
            await unsorted.reduce((acc, curr) => {
              acc = acc.then(() => {
                instance.insert(curr);
              });
              return acc;
            }, Promise.resolve());
            await instance.sort();
            const response = await instance.getSorted();
            const expected = unsorted
              .sort((a, b) => a - b)
              .map((n) => BigInt(n));
            expect(response).to.deep.eq(expected);
          });
        });
      });
    });
  });
});
