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
  const fifsAddress = "0x19c5cd5658d3a8ee1c18cd39a26af8879842b60e";
  //@TODO: Need to get address of resolver in goerli
  const resolverAddress = "0xf6305c19e814d2a75429Fd637d01F7ee0E77d615";
  const network = "goerli";
  const domain = "open.polywrap.eth";
  const label = "test";
  const privKey = process.env.ETH_PRIV_KEY as string;

  if (!privKey) {
    throw Error("ETH_PRIV_KEY env variable is missing");
  }

  const builder = new ClientConfigBuilder();
  const signer = new Wallet(privKey);
  builder.addDefaults().addPackages({
    "wrap://ens/wraps.eth:ethereum-provider@2.0.0": ethereumProviderPlugin({
      connections: new Connections({
        networks: {
          [network]: new Connection({
            provider:
              "https://goerli.infura.io/v3/41fbecf847994df5a9652b1210effd8a",
            signer,
          }),
        },
        defaultNetwork: network,
      }),
    }),
  });
  const client = new PolywrapClient(builder.build());

  const register = await client.invoke<string>({
    uri,
    method: "registerSubnodeOwnerWithFIFSRegistrar",
    args: {
      label,
      owner: await signer.getAddress(),
      fifsRegistrarAddress: fifsAddress,
      connection: {
        networkNameOrChainId: network,
      },
    },
  });

  if (!register.ok) {
    throw Error(`Failed to register subdomain: ${register.error}`);
  } else {
    console.log(`Registered Subdomain "${label}"!`);
    console.log(register.value);
  }

  const setResolver = await client.invoke<string>({
    uri,
    method: "setResolver",
    args: {
      domain: `${label}.${domain}`,
      resolverAddress,
      registryAddress: ensAddress,
      connection: {
        networkNameOrChainId: network,
      },
    },
  });

  if (!setResolver.ok) {
    throw Error(`Failed to set resolver: ${setResolver.error}`);
  } else {
    console.log(`Set Resolver!`);
    console.log(setResolver.value);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => process.exit(0));
