import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  getSigner,
  testAccounts,
} from "_services/test.service";
import { ethers, run } from "hardhat";
import { type BigNumberish } from "ethers";
import type { Dijkstra as Contract } from "_typechain/Dijkstra.sol";

const CONTRACT_NAME = "Dijkstra";

interface ShortestPathTestCase {
  args: [BigNumberish[], BigNumberish];
  expected: BigNumberish;
}

interface ShortestPathNodesTestCase {
  args: [BigNumberish[], BigNumberish];
  expected: BigNumberish[];
}

const SHORTEST_PATH_TEST_CASES: ShortestPathTestCase[] = [
  {
    // prettier-ignore
    args: [
      [
        0n, 6n, 2n, 0n, 
        0n, 0n, 0n, 1n, 
        0n, 3n, 0n, 5n, 
        0n, 0n, 0n, 0n,
      ],
      4n,
    ],
    expected: 6n,
  },
];

const SHORTEST_PATH_NODES_TEST_CASES: ShortestPathNodesTestCase[] = [
  {
    // prettier-ignore
    args: [
      [
        0n, 6n, 2n, 0n, 
        0n, 0n, 0n, 1n, 
        0n, 3n, 0n, 5n, 
        0n, 0n, 0n, 0n,
      ],
      4n,
    ],
    expected: [0n, 2n, 1n, 3n],
  },
];

describe(CONTRACT_NAME, () => {
  testAccounts.slice(0, 1).forEach(({ index, describeMessage }) => {
    let instance: Contract;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        await run("compile", { quiet: true, noTypechain: true });
        const deployer = await getSigner(0);
        const arrayLibraryFactory = await ethers.getContractFactory(
          "Array",
          deployer
        );
        const arrayLibraryInstance = arrayLibraryFactory.deploy();

        const graphHelperLibraryFactory = await ethers.getContractFactory(
          "GraphHelper",
          deployer
        );

        const graphHelperLibraryInstance = graphHelperLibraryFactory.deploy();

        const dijkstraContractFactory = await ethers.getContractFactory(
          "Dijkstra",
          {
            signer: deployer,
            libraries: {
              Array: await (await arrayLibraryInstance).getAddress(),
              GraphHelper: await (
                await graphHelperLibraryInstance
              ).getAddress(),
            },
          }
        );
        const dijkstraLibraryInstance =
          (await dijkstraContractFactory.deploy()) as Contract;

        instance = dijkstraLibraryInstance;
        signer = await getSigner(index);
        // signer = .signer;
      });

      describe("shortestPath", () => {
        SHORTEST_PATH_TEST_CASES.forEach(({ args, expected }) => {
          it("Does", async () => {
            const response = await instance.shortestPath(...args);
            expect(response).to.deep.eq(expected);
          });
        });
      });

      describe.only("shortestPathNodes", () => {
        SHORTEST_PATH_NODES_TEST_CASES.forEach(({ args, expected }) => {
          it("Does", async () => {
            const response = await instance.shortestPathNodes(...args);

            expect(response).to.deep.eq(expected);
          });
        });
      });
    });
  });
});
