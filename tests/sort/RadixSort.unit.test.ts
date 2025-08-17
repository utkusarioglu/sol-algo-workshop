import { type SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { type RadixSort as Contract } from "_typechain/RadixSort";
import {
  asEvmObject,
  beforeEachFacade,
  expect,
  getSigner,
  testAccounts,
} from "_services/test.service";
import { ethers, run } from "hardhat";

const CONTRACT_NAME = "RadixSort";

describe(CONTRACT_NAME, () => {
  testAccounts.slice(0, 1).forEach(({ index, describeMessage }) => {
    let instance: Contract;
    let signer: SignerWithAddress;

    describe(describeMessage, () => {
      beforeEach(async () => {
        await run("compile", { quiet: true, noTypeChain: true });
        const deployer = await getSigner(0);
        const libProps = {
          signer: deployer,
        };
        const keysLibFactory = await ethers.getContractFactory(
          "KeysLib",
          libProps,
        );
        const keysLibInstance = await keysLibFactory.deploy();

        const arrayLibFactory = await ethers.getContractFactory("ArrayLib", {
          ...libProps,
          // libraries: {
          //   KeysLib: await keysLibInstance.getAddress(),
          // },
        });
        const arrayLibInstance = await arrayLibFactory.deploy();

        const contractFactory = await ethers.getContractFactory(CONTRACT_NAME, {
          signer: deployer,
          libraries: {
            KeysLib: await keysLibInstance.getAddress(),
            ArrayLib: await arrayLibInstance.getAddress(),
          },
        });

        instance = await contractFactory.deploy();
        signer = await getSigner(index);
      });

      describe("sort", () => {
        [
          // [],
          // [1],
          // [1, 2, 3],
          // [3, 2, 1],
          // [3, 2, 1, 1],
          // [3, 2, 1, 3],
          // [1, 1, 1, 1],
          // [1, 2, 3, 4, 5],
          [
            9582, 56, 37252, 763, 404, 252, 72198, 71706, 83181, 5498, 21319,
            635, 9, 239, 9053, 13482, 8, 20, 61053, 21170,
          ],
          // [
          //   40458, 41862, 24131, 5578, 19640, 96, 9, 55922, 472, 1529, 93536,
          //   38161, 5989, 2, 695, 4237, 85556, 72840, 79178, 20831,
          // ],
          // [
          //   63541, 73829, 17660, 6644, 77066, 36966, 29894, 88802, 29426, 96628,
          //   97985, 27161, 24469, 61011, 88479, 30508, 18883, 69307, 6239, 39060,
          // ],
          // [
          //   72816, 75241, 15531, 84314, 67479, 63276, 86878, 59650, 39617,
          //   79278, 53159, 39414, 91482, 68134, 59089, 14231, 82065, 49724,
          //   97318, 40412,
          // ],
          // [
          //   9928, 57202, 4473, 82760, 55327, 37950, 98413, 16220, 5045, 80864,
          //   95950, 6501, 78924, 74201, 42986, 91752, 23738, 5545, 13790, 50813,
          // ],
          // [
          //   24563, 71730, 34396, 36307, 4981, 72827, 20162, 94239, 85230, 11904,
          //   68989, 81585, 41199, 84502, 17403, 27832, 50968, 38234, 71724,
          //   74936,
          // ],
          // [
          //   46226, 43181, 90618, 33737, 56623, 18527, 84462, 78283, 55986,
          //   91794, 85210, 23697, 39342, 84389, 42185, 77996, 97457, 53368, 7752,
          //   68190,
          // ],
          // [
          //   24765, 75900, 44299, 57651, 6615, 53258, 35806, 63147, 94853, 46564,
          //   90927, 39917, 34391, 75550, 95945, 86516, 54526, 87607, 74812,
          //   61404,
          // ],
          // [
          //   73517, 97133, 82968, 95663, 52796, 58411, 28963, 47344, 80546,
          //   45667, 43335, 19148, 74115, 82680, 513, 80884, 99103, 30338, 6145,
          //   29167,
          // ],
          // [
          //   50562, 90742, 46906, 76691, 33607, 88517, 59425, 89534, 71909,
          //   52110, 38528, 20146, 5724, 81584, 75042, 51892, 63790, 18282, 55332,
          //   74467,
          // ],
          // Array(100)
          //   .fill(null)
          //   .map((_, i) => i),
          // Array(100)
          //   .fill(null)
          //   .map((_, i) => i)
          //   .reverse(),
        ].forEach((unsorted) => {
          it(`Can sort ${unsorted.join(", ")}`, async () => {
            const response = await instance.sort(unsorted);
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
