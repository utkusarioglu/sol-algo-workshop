import { strict as assert } from "assert";
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
  const delegatedLibraryInstance = await deploy("DelegatedLibrary", {
    from: deployer!,
    args: [],
  });

  const delegateCallInstance = await deploy("DelegateCall", {
    from: deployer!,
    args: [],
    libraries: {
      Delegated: delegatedLibraryInstance.address,
    },
  });
  console.log(
    [
      `Delegated Library deployed at ${delegatedLibraryInstance.address}`,
      `DelegateCall Contract deployed at ${delegateCallInstance.address}`,
    ].join("\n")
  );
};

export default deploy;
