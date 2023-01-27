import { Connection, Connections, ethereumProviderPlugin } from "ethereum-provider-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ClientConfigBuilder } from "@polywrap/client-js";
import { providers as testEnvProviders } from "@polywrap/test-env-js";

const wrappers = {
  ethereum: "wrap://ipfs/QmdEMfomFW1XqoxcsCEnhujn9ebQezUXw8pmwLtecyR6F6",
  uts46: "wrap://ipfs/QmPL9Njg3rGkpoJyoy8pZ5fTavjvHxNuuuiGRApzyGESZB",
  sha3: "wrap://ipfs/QmThRxFfr7Hj9Mq6WmcGXjkRrgqMG3oD93SLX27tinQWy5"
};

export function getConfig(
  ethereum: string,
  ensAddress: string,
  ipfsProvider: string,
  signer?: string,
): any {
  const connections = new Connections({
    networks: {
      testnet: new Connection({
        provider: ethereum,
        signer,
      }),
    },
    defaultNetwork: "testnet"
  })

  return new ClientConfigBuilder()
    .addDefaults()
    .removePackage("wrap://ens/ethereum.polywrap.eth")
    .addPackages(
      [
        {
          uri: "wrap://plugin/ethereum-provider",
          package: ethereumProviderPlugin({ connections }),
        },
        {
          uri: "ens/ipfs-resolver.polywrap.eth",
          package: ipfsResolverPlugin({}),
        },
        {
          uri: "ens/ipfs.polywrap.eth",
          package: ipfsPlugin({}),
        },
        {
          uri: "ens/ens-resolver.polywrap.eth",
          package: ensResolverPlugin({ addresses: { testnet: ensAddress } }),
        },
      ]
    )
    .addRedirects(
    [
      {
        from: "wrap://ens/ethereum.polywrap.eth",
        to: wrappers.ethereum,
      },
      {
        from: "wrap://ens/wrappers.polywrap.eth:uts46-lite@1.0.0",
        to: wrappers.uts46,
      },
      {
        from:"wrap://ens/wrappers.polywrap.eth:sha3@1.0.0",
        to: wrappers.sha3,
      },
    ]
  ).addEnvs(
    [{
      uri: "ens/ipfs.polywrap.eth",
      env: {
        provider: testEnvProviders.ipfs,
        fallbackProviders: ["https://ipfs.wrappers.io"]
      },
    }]
  ).addInterfaceImplementations(
    "wrap://ens/iprovider.polywrap.eth",
      ["wrap://plugin/ethereum-provider"]
  ).buildCoreConfig()
}
