import { PolywrapClientConfigBuilder, CoreClientConfig } from "@polywrap/client-js";
import { ETH_ENS_IPFS_MODULE_CONSTANTS, runCli } from "@polywrap/cli-js";
import { configure } from "../../client-config";
import { Wallet } from "ethers";
import {
  Connection,
  Connections,
  ethereumWalletPlugin,
} from "@polywrap/ethereum-wallet-js";

export function getClientConfig(signer?: Wallet): CoreClientConfig {
  const config = configure(new PolywrapClientConfigBuilder());
  if (signer) {
    config.setPackage(
      "wrapscan.io/polywrap/ethereum-wallet@1.0",
      ethereumWalletPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({
              provider: ETH_ENS_IPFS_MODULE_CONSTANTS.ethereumProvider,
              signer,
            }),
          },
          defaultNetwork: "testnet",
        }),
      })
    );
  }
  return config.build();
}

export async function initInfra(): Promise<void> {
  const { exitCode, stderr, stdout } = await runCli({
    args: ["infra", "up", "--verbose", "--modules", "eth-ens-ipfs"],
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to start test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }

  await new Promise<void>(function (resolve) {
    setTimeout(() => resolve(), 5000);
  });

  return Promise.resolve();
}

export async function stopInfra(): Promise<void> {
  const { exitCode, stderr, stdout } = await runCli({
    args: ["infra", "down", "--verbose", "--modules", "eth-ens-ipfs"],
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to stop test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }
  return Promise.resolve();
}
