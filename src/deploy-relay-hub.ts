import { Signer, ContractFactory } from "ethers";

import { bytecode, abi } from "./contracts-builds/RelayHub.json";

export async function deployRelayHub(signer: Signer): Promise<string> {
  const contractFactory = new ContractFactory(abi, bytecode, signer);
  const instance = await contractFactory.deploy();

  const tx = contractFactory.getDeployTransaction();

  return instance.address;
}
