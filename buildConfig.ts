import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { Connections, ethereumProviderPlugin } from "ethereum-provider-js";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  return builder
    .addDefaults()
    .removePackage("wrap://ens/ethereum.polywrap.eth")
    .addInterfaceImplementation(
      "wrap://ens/iprovider.polywrap.eth",
      "wrap://plugin/ethereum-provider"
    )
    .addRedirect(
      "wrap://ens/ethereum.polywrap.eth",
      "wrap://ipfs/QmdEMfomFW1XqoxcsCEnhujn9ebQezUXw8pmwLtecyR6F6",
      )
    .addPackage({
        uri: "wrap://plugin/ethereum-provider",
        package: ethereumProviderPlugin({
          connections: new Connections({ networks: {} })
        }),
      });
}