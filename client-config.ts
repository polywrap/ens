import {
  ethereumWalletPlugin,
  Connection,
  Connections,
} from "@polywrap/ethereum-wallet-js";
import { ClientConfigBuilder } from "@polywrap/client-config-builder-js";
import { ETH_ENS_IPFS_MODULE_CONSTANTS } from "polywrap";

export function configure(builder: ClientConfigBuilder): ClientConfigBuilder {
  return builder.addDefaults().setPackage(
    "wrapscan.io/polywrap/ethereum-wallet@1.0",
    ethereumWalletPlugin({
      connections: new Connections({
        networks: {
          testnet: new Connection({
            provider: ETH_ENS_IPFS_MODULE_CONSTANTS.ethereumProvider,
          }),
        },
        defaultNetwork: "testnet",
      }),
    }),
  );
}
