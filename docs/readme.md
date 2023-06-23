# The ENS wrap

The ENS wrap provides you with methods for easy interaction with the ENS registry.

## Integrate

### Step 1: Polywrap Client

In order to integrate ENS into your applications, the first thing you'll need is a Polywrap client. Currently Polywrap has clients available in:
- JavaScript / TypeScript
- Python
- Rust
- Swift

### Step 2: Client Config 

ENS depends upon the [ethereum wrap](https://github.com/polywrap/ethers), which in-turn requires an [ethereum-provider plugin](https://github.com/polywrap/ethereum-wallet). Plugins are added directly to the client using its config.

[Here's an example](https://github.com/polywrap/ethers/blob/36e6f3331264732e73f3e236004416e82930ed64/provider/implementations/js/tests/index.spec.ts#L15-L30) of setting up a JavaScript / TypeScript client with the ethereum-provider plugin.

You can learn more about Polywrap clients & configs in the docs [here](https://docs.polywrap.io/tutorials/use-wraps/configure-client).

### Step 3: Run!

With your client successfully configured, you can now run any function on the ENS wrap with ease.

You can execute functions in TypeScript with the `client.invoke(...)` syntax like so:
```typescript
await client.invoke({
  uri: "wrap://ens/wraps.eth:ens@1.1.0",
  method: "getContentHash",
  args: {...}
});
```

Or you can keep it type-safe by using Polywrap's `codegen` like so:
```typescript
await Ens.getContentHash({...});
```

If you'd like to generate typings for the ENS wrap, you can see an example of this in [Polywrap's Quick Start guide](https://docs.polywrap.io/quick-start#generating-types-codegen).


## Available methods

### getResolver

Returns the address of the current [resolver]() set for the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    domain: "mydomain.eth",
  }
})
```

### getOwner

Returns the address of the current owner of the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    domain: "mydomain.eth",
  }
})
```

### getContentHash

Returns the current content hash set on the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    resolverAddress: "0x...",
    domain: "mydomain.eth",
  }
})
```

### getExpiryTimes

Returns the expiry time for the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registrarAddress: "0x...",
    domain: "mydomain.eth",
  }
})
```

### getReverseResolver

Returns the address of the current [reverse resolver]() set for the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    domain: "mydomain.eth",
  }
})
```

### getTextRecord

Returns the current text record set for the given key, on the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    resolverAddress: "0x...",
    domain: "mydomain.eth",
    key: "myKey"
  }
})
```

### setResolver

Sets a resolver for the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    resolverAddress: "0x...",
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    domain: "mydomain.eth"
  }
})
```

### registerDomain

Registers a new domain for the given owner.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registrarAddress: "0x...",
    domain: "mydomain.eth",
    owner: "0x..."
  }
})
```

### setOwner

Sets a new owner for the given domain.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    domain: "mydomain.eth",
    newOwner: "0x..."
  }
})
```

### setSubdomainOwner

Sets a new owner for the given subdomain. This method assumes the root domain is registered and its controller address matches the transaction sender's. This method can register a new subdomain, but will not set a resolver or ttl for it. For new subdomain registrations [setSubdomainRecord](#setsubdomainrecord) might be more useful.

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    subdomain: "mysubdomain.mydomain.eth",
    owner: "0x..."
  }
})
```

### setSubdomainOwner

Sets a new owner for the given subdomain, along with a resolver and ttl. This method assumes the root domain is registered and its controller address matches the transaction sender's. If you wish to register a new domain and subdomain in a single method call, see [registerDomainAndSubdomainsRecursively](#registerDomainAndSubdomainsRecursively).

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    resolverAddress: "0x...",
    label: "mysubdomain",
    domain: "mydomain.eth",
    owner: "0x...",
    ttl: "0"
  }
})
```

### registerDomainAndSubdomainsRecursively

Registers a new domain and subdomains in sequence for the given owner. If it receives `foo.bar.mydomain.eth` it will send 3 transactions: the first one will register `mydomain.eth`, the second one will register `bar` as a `mydomain.eth` subdomain, and the third will register `foo` as a `bar.mydomain.eth` subdomain. If the root domain is already registered and you'd wish to only register subdomains for it, see [registerSubdomainsRecursively](#registerSubdomainsRecursively).

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    registrarAddress: "0x...",
    resolverAddress: "0x...",
    domain: "foo.bar.mydomain.eth",
    owner: "0x...",
    ttl: "0"
  }
})
```

### registerSubdomainsRecursively

Registers all subdomains, of the given domain, in sequence for the given owner. If it receives `foo.bar.mydomain.eth` it will send 2 transactions: the first one will register `bar` as a `mydomain.eth` subdomain, and the second will register `foo` as a `bar.mydomain.eth` subdomain. This method assumes the root domain is registered and its controller address matches the transaction sender's. If you wish to register the root domain along with its subdomains in a single method call, see [registerDomainAndSubdomainsRecursively](#registerDomainAndSubdomainsRecursively).

```js
const address = await client.invoke({
  uri: 'ens/ens.wraps.eth@0.1.0',
  method: 'getAddress',
  args: {
    registryAddress: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
    resolverAddress: "0x...",
    label: "mysubdomain",
    domain: "mydomain.eth",
    owner: "0x...",
    ttl: "0"
  }
})
```

## Support

For any questions or problems related to the ENS wrap or Polywrap at large, please visit our [Discord](https://discord.polywrap.io).
