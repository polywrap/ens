# Polywrap ENS Wrap

## Table of contents
* [Installation](#installation)
* [Getting Started](#getting-started)
* [ENS Wrap Reference](#ens-wrap)
## <a name="installation">Installation</a>

Install the package with yarn or npm:

```bash
yarn add polywrap
npm install polywrap
```

## <a name="getting-started">Getting Started</a>

The following steps show how to set up the Polywrap Client, register a new domain, register subdomains, set resolvers, as well as setting and getting content hashes.

### Note

As per the [ENS documentation](https://docs.ens.domains/ens-deployments), ENS's registry contract is deployed at `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`. This same address is used across Mainnet and Goerli.

## <a name="ens-wrap">ENS Wrap Reference</a>

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