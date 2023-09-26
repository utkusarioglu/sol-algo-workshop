import { simpleDeploy } from "_services/deployment.service";
import { basename } from "path";

const contractName = basename(__filename).split(".")[0]!;
export default simpleDeploy(true, contractName, []);
