import { Connection, Connections, ethereumProviderPlugin } from "ethereum-provider-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
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
    .addEnvs(
    [{
      uri: "ens/ipfs.polywrap.eth",
      env: {
        provider: testEnvProviders.ipfs,
        fallbackProviders: ["https://ipfs.wrappers.io"]
      },
    }]
  ).addInterfaceImplementations(
    "wrap://ens/wraps.eth:ethereum-provider@1.1.0",
      ["wrap://plugin/ethereum-provider"]
  ).buildCoreConfig()
}
