import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type Bfs as Contract } from "_typechain/search/bfs.sol";
import {
  asEvmObject,
  beforeEachFacade,
  getSigner,
  expect,
  testAccounts,
} from "_services/test.service";
import { ethers, run } from "hardhat";
import type { ContractTransactionResponse } from "ethers";

const CONTRACT_NAME = "Bfs";

describe(CONTRACT_NAME, () => {
  testAccounts.slice(0, 1).forEach(({ index, describeMessage }) => {
    let instance: Contract;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        await run("compile", { quiet: true, noTypechain: true });
        const deployer = await getSigner(0);
        const setMethodsLf = await ethers.getContractFactory(
          "SetMethods",
          deployer,
        );

        const setMethodsLi = await setMethodsLf.deploy();

        const queueMethodsLf = await ethers.getContractFactory(
          "QueueMethods",
          deployer,
        );

        const queueMethodsLi = await queueMethodsLf.deploy();

        const bfsCf = await ethers.getContractFactory("Bfs", {
          signer: deployer,
          libraries: {
            SetMethods: await setMethodsLi.getAddress(),
            QueueMethods: await queueMethodsLi.getAddress(),
          },
        });

        instance = (await bfsCf.deploy()) as Contract;
        signer = await getSigner(index);
        //   const common = await beforeEachFacade<Contract>(
        //     CONTRACT_NAME,
        //     [],
        //     index,
        //   );
        //   instance = common.signerInstance;
        //   signer = common.signer;
      });

      describe("Insert", () => {
        describe("Single", () => {
          [
            {
              name: "10 -> 11 -> 12",
              params: {
                rawNodes: [
                  {
                    value: 10,
                    edges: {
                      members: [1],
                    },
                  },
                  {
                    value: 11,
                    edges: {
                      members: [2],
                    },
                  },
                  {
                    value: 12,
                    edges: {
                      members: [],
                    },
                  },
                ],
                startIndex: 0,
              },
              expected: [10n, 11n, 12n],
            },

            {
              name: `
                10 -> 11
                   -> 12
              `,
              params: {
                rawNodes: [
                  {
                    value: 10,
                    edges: {
                      members: [1, 2],
                    },
                  },
                  {
                    value: 11,
                    edges: {
                      members: [],
                    },
                  },
                  {
                    value: 12,
                    edges: {
                      members: [],
                    },
                  },
                ],
                startIndex: 0,
              },
              expected: [10, 11, 12],
            },

            {
              name: `
                10 -> 11 -> 13
                   -> 12
              `,
              params: {
                rawNodes: [
                  {
                    value: 10,
                    edges: {
                      members: [1, 2],
                    },
                  },
                  {
                    value: 11,
                    edges: {
                      members: [3],
                    },
                  },
                  {
                    value: 12,
                    edges: {
                      members: [],
                    },
                  },
                  {
                    value: 13,
                    edges: {
                      members: [],
                    },
                  },
                ],
                startIndex: 0,
              },
              expected: [10, 11, 12, 13],
            },

            {
              name: `
                10 -> 11 -> 13
                   -> 12 -> 14
              `,
              params: {
                rawNodes: [
                  {
                    value: 10,
                    edges: {
                      members: [1, 2],
                    },
                  },
                  {
                    value: 11,
                    edges: {
                      members: [3],
                    },
                  },
                  {
                    value: 12,
                    edges: {
                      members: [4],
                    },
                  },
                  {
                    value: 13,
                    edges: {
                      members: [],
                    },
                  },
                  {
                    value: 14,
                    edges: {
                      members: [],
                    },
                  },
                ],
                startIndex: 0,
              },
              expected: [10, 11, 12, 13, 14],
            },

            {
              name: `
                10 -> 11 -> 13 -> 15
                               -> 16
                   -> 12 -> 14
              `,
              params: {
                rawNodes: [
                  {
                    value: 10,
                    edges: {
                      members: [1, 2],
                    },
                  },
                  {
                    value: 11,
                    edges: {
                      members: [3],
                    },
                  },
                  {
                    value: 12,
                    edges: {
                      members: [4],
                    },
                  },
                  {
                    value: 13,
                    edges: {
                      members: [5, 6],
                    },
                  },
                  {
                    value: 14,
                    edges: {
                      members: [],
                    },
                  },
                  {
                    value: 15,
                    edges: {
                      members: [],
                    },
                  },
                  {
                    value: 16,
                    edges: {
                      members: [],
                    },
                  },
                ],
                startIndex: 0,
              },
              expected: [10, 11, 12, 13, 14, 15, 16],
            },

            {
              name: "10 <- 11 <- 12",
              params: {
                rawNodes: [
                  {
                    value: 10,
                    edges: {
                      members: [],
                    },
                  },
                  {
                    value: 11,
                    edges: {
                      members: [0],
                    },
                  },
                  {
                    value: 12,
                    edges: {
                      members: [1],
                    },
                  },
                ],
                startIndex: 2,
              },
              expected: [12, 11, 10],
            },

            {
              name: `
                11 -> 10
                   -> 12
              `,
              params: {
                rawNodes: [
                  {
                    value: 10,
                    edges: {
                      members: [],
                    },
                  },
                  {
                    value: 11,
                    edges: {
                      members: [0, 2],
                    },
                  },
                  {
                    value: 12,
                    edges: {
                      members: [],
                    },
                  },
                ],
                startIndex: 1,
              },
              expected: [11, 10, 12],
            },
          ].forEach(({ name, params: { rawNodes, startIndex }, expected }) => {
            it(name, async () => {
              const response = await instance.search(rawNodes, startIndex);
              expect(response).to.deep.equal(expected);
            });
          });
        });
      });
    });
  });
});
