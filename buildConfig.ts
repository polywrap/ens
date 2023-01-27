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
      "wrap://ipfs/QmPV4sG9zaVVv686Z9bXDFcysUEFfQwME5ayneWQTabNUe",
    )
    .addRedirect(
      "wrap://ens/wrappers.polywrap.eth:uts46-lite@1.0.0",
      "wrap://ipfs/QmPL9Njg3rGkpoJyoy8pZ5fTavjvHxNuuuiGRApzyGESZB"
    )
    .addRedirect(
      "wrap://ens/wrappers.polywrap.eth:sha3@1.0.0",
      "wrap://ipfs/QmThRxFfr7Hj9Mq6WmcGXjkRrgqMG3oD93SLX27tinQWy5"
    )
    .addPackage({
        uri: "wrap://plugin/ethereum-provider",
        package: ethereumProviderPlugin({
          connections: new Connections({ networks: {} })
        }),
      });
}