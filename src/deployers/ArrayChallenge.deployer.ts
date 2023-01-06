import type { DeployFunction } from "hardhat-deploy/dist/types";

const ENABLED = false;

const deploy: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
}) => {
  if (!ENABLED) {
    return;
  }
  const { deployer } = await getNamedAccounts();
  const mathLibraryInstance = await deploy("MathLibrary", {
    from: deployer!,
    args: [],
  });
  const arrayLibraryInstance = await deploy("ArrayLibrary", {
    from: deployer!,
    args: [],
  });
  const arrayChallengeInstance = await deploy("ArrayChallenge", {
    from: deployer!,
    args: [],
    libraries: {
      MathLibrary: mathLibraryInstance.address,
      ArrayLibrary: arrayLibraryInstance.address,
    },
  });
  console.log(
    [
      `ArrayChallenge deployed at ${arrayChallengeInstance.address}`,
      `MathLibrary deployed at ${mathLibraryInstance.address}`,
      `ArrayLibrary deployed at ${arrayLibraryInstance.address}`,
    ].join("\n")
  );
};

export default deploy;
