import {runCli} from "@polywrap/cli-js";
import axios from "axios";
import {
  ClientConfigBuilder,
  CoreClientConfig,
} from "@polywrap/client-js";
import { ethereumProviderPlugin, Connections, Connection } from "@polywrap/ethereum-provider-js";
import {Wallet} from "ethers";
import {configure} from "../../client-config";

export function getClientConfig(signer?: Wallet): CoreClientConfig {
  const config = configure(new ClientConfigBuilder());
  if (signer) {
    config.addPackage(
      "wrap://ens/wraps.eth:ethereum-provider@2.0.0",
      ethereumProviderPlugin({
        connections: new Connections({
          networks: {
            testnet: new Connection({
              provider: "http://localhost:8546" ,
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
    args: ["infra", "up", "--verbose"]
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to start test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }

  const success = await awaitResponse(
    `http://localhost:8546`,
    '"jsonrpc":',
    "post",
    2000,
    20000,
    '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}'
  );
  if (!success) {
    throw Error("initInfra: Ganache failed to start");
  }

  return Promise.resolve();
}

export async function stopInfra(): Promise<void> {
  const { exitCode, stderr, stdout } = await runCli({
    args: ["infra", "down", "--verbose"]
  });

  if (exitCode) {
    throw Error(
      `initInfra failed to stop test environment.\nExit Code: ${exitCode}\nStdErr: ${stderr}\nStdOut: ${stdout}`
    );
  }

  return Promise.resolve();
}

async function awaitResponse(
  url: string,
  expectedRes: string,
  getPost: "get" | "post",
  timeout: number,
  maxTimeout: number,
  data?: string
) {
  let time = 0;

  while (time < maxTimeout) {
    const request = getPost === "get" ? axios.get(url) : axios.post(url, data);
    const success = await request
      .then(function (response) {
        const responseData = JSON.stringify(response.data);
        return responseData.indexOf(expectedRes) > -1;
      })
      .catch(function () {
        return false;
      });

    if (success) {
      return true;
    }

    await new Promise<void>(function (resolve) {
      setTimeout(() => resolve(), timeout);
    });

    time += timeout;
  }

  return false;
}