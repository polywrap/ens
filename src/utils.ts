import { UTS46_Module, SHA3_Module, TxOptions, Ethers_TxOptions } from "./wrap";

export function namehash(inputName: string): string {
  let node = "";
  for (let i: number = 0; i < 32; i++) {
    node += "00";
  }

  const name: string = normalize(inputName);

  if (name) {
    const labels: string[] = name.split(".");

    for (let i = labels.length - 1; i >= 0; i--) {
      let labelSha = SHA3_Module.keccak_256({ message: labels[i] }).unwrap();
      node = SHA3_Module.hex_keccak_256({ message: node + labelSha }).unwrap();
    }
  }

  return "0x" + node;
}

export function normalize(name: string): string {
  return name
    ? UTS46_Module.toAscii({
        value: name,
      }).unwrap()
    : name;
}

export function keccak256(value: string): string {
  return "0x" + SHA3_Module.keccak_256({ message: value }).unwrap();
}

export function parseTxOptions(
  txOptions: TxOptions | null
): Ethers_TxOptions | null {
  if (txOptions === null) {
    return null;
  }
  return {
    value: null,
    gasPrice: txOptions.gasPrice,
    gasLimit: txOptions.gasLimit,
    maxFeePerGas: txOptions.maxFeePerGas,
    maxPriorityFeePerGas: txOptions.maxPriorityFeePerGas,
    nonce: txOptions.nonce,
  };
}
