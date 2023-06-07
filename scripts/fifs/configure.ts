import { PolywrapClient, ClientConfigBuilder } from "@polywrap/client-js";
import { Wallet } from "ethers";
import {
  Connection,
  Connections,
  ethereumProviderPlugin,
} from "@polywrap/ethereum-provider-js";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const uri = `fs/${__dirname}/../../build`;
  const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  const network = "goerli";
  const domain = "open.polywrap.eth";
  const privKey = process.env.ETH_PRIV_KEY as string;

  if (!privKey) {
    throw Error("ETH_PRIV_KEY env variable is missing");
  }

  const builder = new ClientConfigBuilder();
  builder.addDefaults().addPackages({
    "wrap://ens/wraps.eth:ethereum-provider@2.0.0": ethereumProviderPlugin({
      connections: new Connections({
        networks: {
          [network]: new Connection({
            provider:
              "https://goerli.infura.io/v3/41fbecf847994df5a9652b1210effd8a",
            signer: new Wallet(privKey),
          }),
        },
        defaultNetwork: network,
      }),
    }),
  });
  const client = new PolywrapClient(builder.build());

  // Deploy a new instance of the FIFS registrar
  const deployFifs = await client.invoke<string>({
    uri,
    method: "deployFIFSRegistrar",
    args: {
      registryAddress: ensAddress,
      tld: domain,
      connection: {
        networkNameOrChainId: network,
      },
    },
  });

  if (!deployFifs.ok) {
    throw Error(`Failed to deploy FIFSRegistrar: ${deployFifs.error}`);
  } else {
    console.log("Deployed FIFSRegistrar!");
    console.log(deployFifs.value);
  }

  const fifsAddress = deployFifs.value;

  // Set the subdomain's owner to the FIFSRegistrar
  const setOwner = await client.invoke<string>({
    uri,
    method: "setOwner",
    args: {
      domain,
      newOwner: fifsAddress,
      registryAddress: ensAddress,
      connection: {
        networkNameOrChainId: network,
      },
    },
  });

  if (!setOwner.ok) {
    throw Error(`Failed to Set Owner: ${setOwner.error}`);
  } else {
    console.log("Set Owner Succeeded!");
    console.log(setOwner.value);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
