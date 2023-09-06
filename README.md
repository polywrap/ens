# The ENS wrap

The ENS wrap provides you with methods for easy interaction with the ENS registry.

## Requirements

To run the ENS wrap you'll need a Polywrap client in your application. See here for installation information: [https://docs.polywrap.io/clients](https://docs.polywrap.io/clients)

### Configuration

ENS depends upon the [ethereum wrap](https://github.com/polywrap/ethers), which in-turn requires an [ethereum-wallet plugin](https://github.com/polywrap/ethereum-wallet). Plugins are added directly to the client using its config.

[Here's an example](https://github.com/polywrap/ethereum-wallet/blob/main/implementations/js/tests/index.spec.ts#L17-L32) of setting up a JavaScript / TypeScript client with the ethereum-wallet plugin.

You can learn more about Polywrap clients & configs in the docs [here](https://docs.polywrap.io/tutorials/use-wraps/configure-client).

## Run!

With your client successfully configured, you can now run any function on the ENS wrap with ease.

You can check out the ENS wrap's schema for a list of methods, or [check out its tests](https://github.com/polywrap/ens/blob/main/src/__tests__/e2e.spec.ts) for detailed usage examples.

## Support

For any questions or problems related to the ENS wrap or Polywrap at large, please visit our [Discord](https://discord.polywrap.io).
