require("dotenv").config();
import { type HardhatUserConfig } from "hardhat/types";
import "tsconfig-paths/register";
// TODO this one breaks tests while using with ethers v6
// import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-ethers";
import "hardhat-spdx-license-identifier";
import "@nomicfoundation/hardhat-chai-matchers";
import "solidity-coverage";
// TODO causes issues with ethers v6
// import "@openzeppelin/hardhat-upgrades";
import "_tasks/account-balances.task";
import "_tasks/named-accounts.task";
import "_tasks/config-value.task";
// TODO This one is disabled because it keeps logging an object to the console
// import "hardhat-storage-layout";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";
import "@typechain/hardhat";
import "@typechain/ethers-v6";
import "hardhat-tracer";
import { removeConsoleLog } from "hardhat-preprocessor";
import config from "config";
import {
  gethAccounts,
  goerliAccounts,
  hardhatAccounts,
  mumbaiAccounts,
  namedAccounts,
} from "_services/account.service";

/**
 * @dev
 * #1 Storage layout is disabled unless it's needed. This is because
 * the library is very verbose on the console, to the point that it
 * hurts dx.
 */
const hardhatConfig: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  paths: {
    sources: "src/contracts",
    tests: "tests",
    cache: "artifacts/cache",
    artifacts: "artifacts/hardhat",
    imports: "artifacts/imports",
    deployments: "artifacts/deployments",
    deploy: "src/deployers",
    // @ts-ignore #1
    newStorageLayoutPath: "artifacts/storage-layout",
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      saveDeployments: true,
      accounts: hardhatAccounts(),
      tags: ["local"],
      chainId: 8545,
      forking: {
        enabled: config.get<boolean>("features.forking"),
        url: `https://polygon-mumbai.g.alchemy.com/v2/${config.get(
          "apiKeys.alchemy.polygon.mumbai"
        )}`,
      },
    },

    geth1: {
      url: config.get<string>("geth.instance1"),
      chainId: 8545,
      accounts: gethAccounts(),
      tags: ["local"],
    },

    geth2: {
      url: config.get<string>("geth.instance2"),
      chainId: 9545,
      accounts: gethAccounts(),
      tags: ["local"],
    },

    ...(config.has("accounts.goerli") && {
      goerli: {
        url: `https://goerli.infura.io/v3/${config.get<string>(
          "apiKeys.infura"
        )}`,
        accounts: goerliAccounts(),
      },

      mumbai: {
        url: `https://polygon-mumbai.g.alchemy.com/v2/${config.get<string>(
          "apiKeys.alchemy"
        )}`,
        accounts: mumbaiAccounts(),
      },
    }),
  },

  namedAccounts: namedAccounts(),

  typechain: {
    outDir: "./artifacts/typechain",
    target: "ethers-v6",
    alwaysGenerateOverloads: false,
  },
  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (hre) => !["localhost", "hardhat"].includes(hre.network.name)
    ),
  },

  ...(config.has("apiKeys.etherscan") && {
    etherscan: {
      apiKey: config.get<string>("apiKeys.etherscan"),
    },
  }),

  ...(config.has("apiKeys.coinMarketCap") && {
    gasReporter: {
      outputFile: `artifacts/gas-reporter/gas-usage.${Math.floor(
        Date.now() / 1e3
      )}.log`,
      token: config.get<string>("features.gasReporter.token"),
      enabled: config.get<boolean>("features.gasReporter.enabled"),
      noColors: true,
      coinmarketcap: config.get<string>("apiKeys.coinMarketCap"),
      currency: "USD",
    },
  }),
};

export default hardhatConfig;
