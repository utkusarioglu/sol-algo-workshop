import type { DeployFunction } from "hardhat-deploy/dist/types";
import { strict as assert } from "assert";
import { simpleDeploy } from "_services/deployment.service";

const ENABLED = true;

const deployer: DeployFunction = async ({
  deployments: { deploy },
  getNamedAccounts,
  // @ts-ignore
  storageLayout,
}) => {
  if (!ENABLED) {
    console.log(
      "Skipping deployment as this particular deployment is disabled"
    );
    return;
  }

  const { deployer } = await getNamedAccounts();
  assert(!!deployer, "Deployer not available");
  const maxHeapInstance = (await deploy("MaxHeap", {
    from: deployer,
  })) as any; // #1
  const minHeapInstance = await deploy("MinHeap", {
    from: deployer,
  });
  const heapSortInstance = await deploy("HeapSort", {
    from: deployer,
    args: [maxHeapInstance.address, minHeapInstance.address],
  });

  if (!!storageLayout && !!storageLayout.export) {
    await storageLayout.export();
  }
  console.log(`"MaxHeap" deployed at ${maxHeapInstance.address}`);
  console.log(`"MinHeap" deployed at ${minHeapInstance.address}`);
  console.log(`"HeapSort" deployed at ${heapSortInstance.address}`);
};

export default deployer;
