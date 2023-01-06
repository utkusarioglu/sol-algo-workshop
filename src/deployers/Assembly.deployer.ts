import { strict as assert } from "assert";
import { type DeployFunction } from "hardhat-deploy/dist/types";

const ENABLED = false;

const deploy: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}) => {
  if (!ENABLED) {
    return;
  }
  const { deployer } = await getNamedAccounts();
  assert(deployer, "Named account deployer not available");
  const instance = await deploy("Assembly", {
    from: deployer,
    args: [],
  });
  console.log(`Assembly available at ${instance.address}`);
};

export default deploy;
