import { strict as assert } from "assert";
import { DeployFunction } from "hardhat-deploy/dist/types";

type SimpleDeployFactory = (
  enabled: boolean,
  contractName: string,
  args: any[]
) => DeployFunction;

/**
 * Handles the deployment of a single contract
 *
 * @dev
 * #1 Typechain types are not used here to avoid type issues due to
 * #  outdated or yet absent types. The first run of hardhat ensures
 * #  the types are created or fixed.
 * #2 This is needed because `storageLayout` is by default disabled
 * #  in hardhat config
 */
export const simpleDeploy: SimpleDeployFactory =
  (enabled, contractName, args) =>
  async ({
    deployments: { deploy },
    getNamedAccounts,
    // @ts-ignore #2
    storageLayout,
  }) => {
    if (!enabled) {
      console.log(
        `Skipping contract "${contractName}" as it is set as disabled`
      );
      return;
    }
    const { deployer } = await getNamedAccounts();
    assert(!!deployer, "Deployer not available");
    const instance = (await deploy(contractName, {
      from: deployer,
      args,
    })) as any; // #1

    if (!!storageLayout && !!storageLayout.export) {
      await storageLayout.export();
    }
    console.log(`"${contractName}" deployed at ${instance.address}`);
  };
