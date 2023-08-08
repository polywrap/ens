import { keccak256, namehash, parseTxOptions } from "./utils";
import {
  Args_checkIfRecordExists,
  Args_configureOpenDomain,
  Args_createSubdomainInOpenDomain,
  Args_createSubdomainInOpenDomainAndSetContentHash,
  Args_deployFIFSRegistrar,
  Args_getAddress,
  Args_getAddressFromDomain,
  Args_getContentHash,
  Args_getContentHashFromDomain,
  Args_getExpiryTimes,
  Args_getNameFromAddress,
  Args_getNameFromReverseResolver,
  Args_getOwner,
  Args_getResolver,
  Args_getReverseResolver,
  Args_getTextRecord,
  Args_registerDomain,
  Args_registerDomainAndSubdomainsRecursively,
  Args_registerSubdomainsRecursively,
  Args_registerSubnodeOwnerWithFIFSRegistrar,
  Args_reverseRegisterDomain,
  Args_setAddress,
  Args_setAddressFromDomain,
  Args_setContentHash,
  Args_setContentHashFromDomain,
  Args_setName,
  Args_setOwner,
  Args_setRecord,
  Args_setResolver,
  Args_setSubdomainOwner,
  Args_setSubdomainRecord,
  Args_setTextRecord,
  ConfigureOpenDomainResponse,
  CreateSubdomainInOpenDomainAndSetContentHashResponse,
  CreateSubdomainInOpenDomainResponse,
  Ethers_Module,
  Ethers_TxResponse,
  RegistrationResult,
  ModuleBase,
} from "./wrap";
import { abi, bytecode } from "./contracts/FIFSRegistrar";

export class Module extends ModuleBase {
  getResolver(args: Args_getResolver): string {
    const domain = namehash(args.domain);

    const resolverAddress = Ethers_Module.callContractView({
      address: args.registryAddress,
      method: "function resolver(bytes32 node) external view returns (address)",
      args: [domain],
      connection: args.connection,
    });

    return resolverAddress.unwrap();
  }

  getOwner(args: Args_getOwner): string {
    const owner = Ethers_Module.callContractView({
      address: args.registryAddress,
      method: "function owner(bytes32 node) external view returns (address)",
      args: [namehash(args.domain)],
      connection: args.connection,
    });

    return owner.unwrap();
  }

  checkIfRecordExists(args: Args_checkIfRecordExists): bool {
    const recordExists = Ethers_Module.callContractView({
      address: args.registryAddress,
      method:
        "function recordExists(bytes32 node) external view returns (address)",
      args: [namehash(args.domain)],
      connection: args.connection,
    });

    const result = recordExists.unwrap();

    return result == "0x0000000000000000000000000000000000000001";
  }

  getAddress(args: Args_getAddress): string {
    const address = Ethers_Module.callContractView({
      address: args.resolverAddress,
      method: "function addr(bytes32 node) external view returns (address)",
      args: [namehash(args.domain)],
      connection: args.connection,
    });

    return address.unwrap();
  }

  getContentHash(args: Args_getContentHash): string {
    const hash = Ethers_Module.callContractView({
      address: args.resolverAddress,
      method:
        "function contenthash(bytes32 node) external view returns (bytes)",
      args: [namehash(args.domain)],
      connection: args.connection,
    });

    return hash.unwrap();
  }

  getAddressFromDomain(args: Args_getAddressFromDomain): string {
    const resolverAddress = this.getResolver({
      registryAddress: args.registryAddress,
      domain: args.domain,
      connection: args.connection,
    });

    const address = Ethers_Module.callContractView({
      address: resolverAddress,
      method: "function addr(bytes32 node) external view returns (address)",
      args: [namehash(args.domain)],
      connection: args.connection,
    });

    return address.unwrap();
  }

  getContentHashFromDomain(args: Args_getContentHashFromDomain): string {
    const resolverAddress = this.getResolver({
      registryAddress: args.registryAddress,
      domain: args.domain,
      connection: args.connection,
    });

    const hash = Ethers_Module.callContractView({
      address: resolverAddress,
      method:
        "function contenthash(bytes32 node) external view returns (bytes)",
      args: [namehash(args.domain)],
      connection: args.connection,
    });

    return hash.unwrap();
  }

  getExpiryTimes(args: Args_getExpiryTimes): string {
    const label = args.domain.split(".")[0];

    const expiryTime = Ethers_Module.callContractView({
      address: args.registrarAddress,
      method:
        "function expiryTimes(bytes32 label) external view returns (uint256)",
      args: [keccak256(label)],
      connection: args.connection,
    });

    return expiryTime.unwrap();
  }

  getReverseResolver(args: Args_getReverseResolver): string {
    const address = namehash(args.address.substr(2) + ".resolver.ens.eth");

    const resolverAddress = Ethers_Module.callContractView({
      address: args.registryAddress,
      method: "function resolver(bytes32 node) external view returns (address)",
      args: [address],
      connection: args.connection,
    });

    return resolverAddress.unwrap();
  }

  getNameFromAddress(args: Args_getNameFromAddress): string {
    const address = namehash(args.address.substr(2) + ".addr.reverse");

    const resolverAddress = this.getReverseResolver({
      registryAddress: args.registryAddress,
      address: args.address,
      connection: args.connection,
    });

    const name = Ethers_Module.callContractView({
      address: resolverAddress,
      method: "function name(bytes32 node) external view returns (string)",
      args: [address],
      connection: args.connection,
    });

    return name.unwrap();
  }

  getNameFromReverseResolver(args: Args_getNameFromReverseResolver): string {
    const address = namehash(args.address.substr(2) + ".addr.reverse");

    const name = Ethers_Module.callContractView({
      address: args.resolverAddress,
      method: "function name(bytes32 node) external view returns (string)",
      args: [address],
      connection: args.connection,
    });

    return name.unwrap();
  }

  getTextRecord(args: Args_getTextRecord): string {
    const value = Ethers_Module.callContractView({
      address: args.resolverAddress,
      method:
        "function text(bytes32 node, string value) external view returns (string)",
      args: [namehash(args.domain), args.key],
      connection: args.connection,
    });

    return value.unwrap();
  }

  setResolver(args: Args_setResolver): Ethers_TxResponse {
    const setResolverTx = Ethers_Module.callContractMethod({
      address: args.registryAddress,
      method: "function setResolver(bytes32 node, address owner)",
      args: [namehash(args.domain), args.resolverAddress],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return setResolverTx.unwrap();
  }

  registerDomain(args: Args_registerDomain): Ethers_TxResponse {
    const label = args.domain.split(".")[0];
    const tx = Ethers_Module.callContractMethod({
      address: args.registrarAddress,
      // name, owner, duration, secret, resolver, data, reverseRecord, ownerControlledFuses
      method: "function register(string,address,uint256,bytes32,address,bytes[],bool,uint16)",
      args: [keccak256(label), args.owner, 28, ?, args.resolverAddress, [], false, 0],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return tx.unwrap();
  }

  registerDomainWithFifsRegistrar(args: Args_registerDomain): Ethers_TxResponse {
    const label = args.domain.split(".")[0];
    const tx = Ethers_Module.callContractMethod({
      address: args.registrarAddress,
      method: "function register(bytes32 label, address owner)",
      args: [keccak256(label), args.owner],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return tx.unwrap();
  }

  setOwner(args: Args_setOwner): Ethers_TxResponse {
    const tx = Ethers_Module.callContractMethod({
      address: args.registryAddress,
      method: "function setOwner(bytes32 node, address owner) external",
      args: [namehash(args.domain), args.newOwner],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return tx.unwrap();
  }

  setSubdomainOwner(args: Args_setSubdomainOwner): Ethers_TxResponse {
    const splitDomain = args.subdomain.split(".");
    const subdomainLabel = splitDomain[0];
    const domain = splitDomain.slice(1, splitDomain.length).join(".");

    const tx = Ethers_Module.callContractMethod({
      address: args.registryAddress,
      method:
        "function setSubnodeOwner(bytes32 node, bytes32 label, address owner) external",
      args: [namehash(domain), keccak256(subdomainLabel), args.owner],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return tx.unwrap();
  }

  setSubdomainRecord(args: Args_setSubdomainRecord): Ethers_TxResponse {
    const tx = Ethers_Module.callContractMethod({
      address: args.registryAddress,
      method:
        "function setSubnodeRecord(bytes32 node, bytes32 label, address owner, address resolver, uint64 ttl)",
      args: [
        namehash(args.domain),
        keccak256(args.label),
        args.owner,
        args.resolverAddress,
        args.ttl,
      ],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return tx.unwrap();
  }

  registerDomainAndSubdomainsRecursively(
    args: Args_registerDomainAndSubdomainsRecursively
  ): RegistrationResult[] {
    const registrationResults: RegistrationResult[] = [];
    const splitDomain = args.domain.split(".");

    if (splitDomain.length < 2) {
      throw new Error(
        "Expected subdomain/domain name. Examples: foo.eth, foo.bar.eth"
      );
    }

    let rootDomain = splitDomain.slice(-1)[0];
    let subdomains = splitDomain.slice(0, -1).reverse();

    for (let i = 0; i < subdomains.length; i++) {
      subdomains[i] = `${subdomains[i]}.${
        i === 0 ? rootDomain : subdomains[i - 1]
      }`;
    }

    for (let i = 0; i < subdomains.length; i++) {
      const result: RegistrationResult = {
        name: subdomains[i],
        didRegister: false,
        tx: null,
      };

      const isRegistered = this.checkIfRecordExists({
        registryAddress: args.registryAddress,
        domain: subdomains[i],
        connection: args.connection,
      });

      if (!isRegistered) {
        if (i === 0) {
          // Main domain case
          result.tx = this.registerDomain({
            domain: subdomains[i],
            registrarAddress: args.registrarAddress,
            owner: args.owner,
            connection: args.connection,
            txOptions: args.txOptions,
          });

          this.setResolver({
            domain: subdomains[i],
            registryAddress: args.registryAddress,
            resolverAddress: args.resolverAddress,
            connection: args.connection,
            txOptions: args.txOptions,
          });
        } else {
          // Subdomain case
          const label = subdomains[i].split(".")[0];
          const domain = subdomains[i].split(".").slice(1).join(".");

          result.tx = this.setSubdomainRecord({
            domain,
            label,
            owner: args.owner,
            resolverAddress: args.resolverAddress,
            ttl: args.ttl,
            registryAddress: args.registryAddress,
            connection: args.connection,
            txOptions: args.txOptions,
          });
        }

        result.didRegister = true;
      }

      registrationResults.push(result);
    }

    return registrationResults;
  }

  registerSubdomainsRecursively(
    args: Args_registerSubdomainsRecursively
  ): RegistrationResult[] {
    const registrationResults: RegistrationResult[] = [];
    const splitDomain = args.domain.split(".");

    if (splitDomain.length < 3) {
      throw new Error("Expected subdomain name. Example: foo.bar.eth");
    }

    let rootDomain = splitDomain.slice(-2).join(".");
    let subdomains = splitDomain.slice(0, -2).reverse();

    for (let i = 0; i < subdomains.length; i++) {
      subdomains[i] = `${subdomains[i]}.${
        i === 0 ? rootDomain : subdomains[i - 1]
      }`;
    }

    for (let i = 0; i < subdomains.length; i++) {
      const result: RegistrationResult = {
        name: subdomains[i],
        didRegister: false,
        tx: null,
      };

      const isRegistered = this.checkIfRecordExists({
        registryAddress: args.registryAddress,
        domain: subdomains[i],
        connection: args.connection,
      });

      if (!isRegistered) {
        const label = subdomains[i].split(".")[0];
        const domain = subdomains[i].split(".").slice(1).join(".");

        result.tx = this.setSubdomainRecord({
          domain,
          label,
          owner: args.owner,
          resolverAddress: args.resolverAddress,
          ttl: args.ttl,
          registryAddress: args.registryAddress,
          connection: args.connection,
          txOptions: args.txOptions,
        });

        result.didRegister = true;
      }

      registrationResults.push(result);
    }

    return registrationResults;
  }

  //TODO: Where could this be used on mainnet?
  setRecord(args: Args_setRecord): Ethers_TxResponse {
    const tx = Ethers_Module.callContractMethod({
      address: args.registryAddress,
      method:
        "function setRecord(bytes32 node, address owner, address resolver, uint64 ttl)",
      args: [namehash(args.domain), args.owner, args.resolverAddress, args.ttl],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return tx.unwrap();
  }

  setName(args: Args_setName): Ethers_TxResponse {
    const setNameTx = Ethers_Module.callContractMethod({
      address: args.reverseRegistryAddress,
      method: "function setName(string name)",
      args: [args.domain],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return setNameTx.unwrap();
  }

  reverseRegisterDomain(args: Args_reverseRegisterDomain): Ethers_TxResponse {
    Ethers_Module.callContractMethod({
      address: args.reverseRegistryAddress,
      method: "function claim(address owner)",
      args: [args.owner],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return this.setName({
      reverseRegistryAddress: args.reverseRegistryAddress,
      domain: args.domain,
      connection: args.connection,
      txOptions: args.txOptions,
    });
  }

  setAddress(args: Args_setAddress): Ethers_TxResponse {
    const setAddrTx = Ethers_Module.callContractMethod({
      address: args.resolverAddress,
      method: "function setAddr(bytes32 node, address addr)",
      args: [namehash(args.domain), args.address],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return setAddrTx.unwrap();
  }

  setContentHash(args: Args_setContentHash): Ethers_TxResponse {
    const setContentHash = Ethers_Module.callContractMethod({
      address: args.resolverAddress,
      method: "function setContenthash(bytes32 node, bytes hash)",
      args: [namehash(args.domain), args.cid],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return setContentHash.unwrap();
  }

  setAddressFromDomain(args: Args_setAddressFromDomain): Ethers_TxResponse {
    const resolverAddress = this.getResolver({
      domain: args.domain,
      registryAddress: args.registryAddress,
      connection: args.connection,
    });

    const setAddrTx = Ethers_Module.callContractMethod({
      address: resolverAddress,
      method: "function setAddr(bytes32 node, address addr)",
      args: [namehash(args.domain), args.address],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return setAddrTx.unwrap();
  }

  setContentHashFromDomain(
    args: Args_setContentHashFromDomain
  ): Ethers_TxResponse {
    const resolverAddress = this.getResolver({
      domain: args.domain,
      registryAddress: args.registryAddress,
      connection: args.connection,
    });

    const setContentHash = Ethers_Module.callContractMethod({
      address: resolverAddress,
      method: "function setContenthash(bytes32 node, bytes hash)",
      args: [namehash(args.domain), args.cid],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return setContentHash.unwrap();
  }

  deployFIFSRegistrar(args: Args_deployFIFSRegistrar): string {
    const address = Ethers_Module.deployContract({
      abi,
      bytecode,
      args: [args.registryAddress, namehash(args.tld)],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return address.unwrap();
  }

  registerSubnodeOwnerWithFIFSRegistrar(
    args: Args_registerSubnodeOwnerWithFIFSRegistrar
  ): Ethers_TxResponse {
    const txHash = Ethers_Module.callContractMethod({
      address: args.fifsRegistrarAddress,
      method: "function register(bytes32 label, address owner) external",
      args: [keccak256(args.label), args.owner],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return txHash.unwrap();
  }

  setTextRecord(args: Args_setTextRecord): Ethers_TxResponse {
    const txHash = Ethers_Module.callContractMethod({
      address: args.resolverAddress,
      method: "function setText(bytes32 node, string key, string value)",
      args: [namehash(args.domain), args.key, args.value],
      connection: args.connection,
      options: parseTxOptions(args.txOptions),
    });

    return txHash.unwrap();
  }

  configureOpenDomain(
    args: Args_configureOpenDomain
  ): ConfigureOpenDomainResponse {
    const fifsRegistrarAddress = this.deployFIFSRegistrar({
      registryAddress: args.registryAddress,
      tld: args.tld,
      connection: args.connection,
      txOptions: args.txOptions,
    });

    const splitDomain = args.tld.split(".");
    const tldLabel = splitDomain[0];
    const tld = splitDomain.slice(1, splitDomain.length).join(".");

    const registerOpenDomainTxReceipt = this.registerDomain({
      registrarAddress: args.registrarAddress,
      domain: args.tld,
      owner: args.owner,
      connection: args.connection,
      txOptions: args.txOptions,
    });

    const setSubdomainRecordTxReceipt = this.setSubdomainRecord({
      domain: tld,
      label: tldLabel,
      owner: fifsRegistrarAddress,
      registryAddress: args.registryAddress,
      resolverAddress: args.resolverAddress,
      ttl: "0",
      connection: args.connection,
      txOptions: args.txOptions,
    });

    return {
      fifsRegistrarAddress,
      registerOpenDomainTxReceipt,
      setSubdomainRecordTxReceipt,
    };
  }

  createSubdomainInOpenDomain(
    args: Args_createSubdomainInOpenDomain
  ): CreateSubdomainInOpenDomainResponse {
    const registerSubdomainTxReceipt = this.registerSubnodeOwnerWithFIFSRegistrar({
      label: args.label,
      owner: args.owner,
      fifsRegistrarAddress: args.fifsRegistrarAddress,
      connection: args.connection,
      txOptions: args.txOptions,
    });

    const setResolverTxReceipt = this.setResolver({
      domain: args.label + "." + args.domain,
      registryAddress: args.registryAddress,
      resolverAddress: args.resolverAddress,
      connection: args.connection,
      txOptions: args.txOptions,
    });

    return { registerSubdomainTxReceipt, setResolverTxReceipt };
  }

  createSubdomainInOpenDomainAndSetContentHash(
    args: Args_createSubdomainInOpenDomainAndSetContentHash
  ): CreateSubdomainInOpenDomainAndSetContentHashResponse {
    const createSubdomainInOpenDomainTxReceipt = this.createSubdomainInOpenDomain({
      label: args.label,
      domain: args.domain,
      resolverAddress: args.resolverAddress,
      registryAddress: args.registryAddress,
      owner: args.owner,
      fifsRegistrarAddress: args.fifsRegistrarAddress,
      connection: args.connection,
      txOptions: args.txOptions,
    });

    const setContentHashReceiptTx = this.setContentHash({
      domain: args.label + "." + args.domain,
      cid: args.cid,
      resolverAddress: args.resolverAddress,
      connection: args.connection,
      txOptions: args.txOptions,
    });

    return {
      registerSubdomainTxReceipt:
        createSubdomainInOpenDomainTxReceipt.registerSubdomainTxReceipt,
      setResolverTxReceipt:
        createSubdomainInOpenDomainTxReceipt.setResolverTxReceipt,
      setContentHashReceiptTx,
    };
  }
}
