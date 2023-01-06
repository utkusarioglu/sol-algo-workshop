import { strict as assert } from "assert";
import type { DeployFunction } from "hardhat-deploy/dist/types";

const ENABLED = false;

const deploy: DeployFunction = async ({
  getNamedAccounts,
  deployments: { deploy },
}) => {
  if (!ENABLED) {
    return;
  }
  const { deployer } = await getNamedAccounts();
  assert(deployer, "Deployer account is undefined");
  const targetInstance = await deploy("Target", {
    from: deployer,
    args: [],
  });
  const proxyInstance = await deploy("Proxy", {
    from: deployer,
    args: [targetInstance.address],
  });
  console.log(
    [
      `Target  ${targetInstance.address}`,
      `Proxy:  ${proxyInstance.address}`,
    ].join("\n")
  );
};

export default deploy;
