import { Connection, Connections, ethereumProviderPlugin } from "ethereum-provider-js";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ClientConfigBuilder } from "@polywrap/client-js";
import { providers as testEnvProviders } from "@polywrap/test-env-js";

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
          uri: "ens/ens-resolver.polywrap.eth",
          package: ensResolverPlugin({ addresses: { testnet: ensAddress } }),
        },
      ]
    )
  .addEnvs(
    [{
      uri: "ens/ipfs.polywrap.eth",
      env: {
        provider: testEnvProviders.ipfs,
        fallbackProviders: ["https://ipfs.wrappers.io"]
      },
    }]
  ).addInterfaceImplementations(
    "wrap://ens/wrappers.polywrap.eth:ethereum-provider@1.0.0",
      ["wrap://plugin/ethereum-provider"]
  ).buildCoreConfig()
}
