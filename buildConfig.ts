import { IClientConfigBuilder } from "@polywrap/client-config-builder-js";

export function configure(builder: IClientConfigBuilder): IClientConfigBuilder {
  return builder
    .addDefaults()
    .removePackage("wrap://ens/ethereum.polywrap.eth")
    .addRedirect(
      "wrap://ens/ethereum.polywrap.eth",
      "wrap://ipfs/QmPV4sG9zaVVv686Z9bXDFcysUEFfQwME5ayneWQTabNUe",
    )
}