import {
  ethereumProviderPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-provider-js";
import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { ETH_ENS_IPFS_MODULE_CONSTANTS } from "polywrap";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  return builder.addDefaults().addPackages({
    "wrap://ens/wraps.eth:ethereum-provider@2.0.0": ethereumProviderPlugin({
      connections: new Connections({
        networks: {
          testnet: new Connection({
            provider: ETH_ENS_IPFS_MODULE_CONSTANTS.ethereumProvider,
          }),
        },
        defaultNetwork: "testnet",
      }),
    }),
  });
}
