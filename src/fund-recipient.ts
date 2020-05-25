import { Contract, Signer } from "ethers";
import { parseEther, BigNumber } from "ethers/utils";

import { abi } from "./contracts-builds/RelayHub.json";

export async function fundRecipient(
  options: {
    amountEther: number;
    relayHubAddress: string;
    recipientAddress: string;
  },
  signer: Signer
) {
  const relayHubInstance = new Contract(options.relayHubAddress, abi, signer);

  const fundingAmountToWei = parseEther(options.amountEther.toString());
  const recipientCurrentBalance = new BigNumber(
    await relayHubInstance.functions.balanceOf(options.recipientAddress)
  );

  if (recipientCurrentBalance.lt(fundingAmountToWei)) {
    const value = fundingAmountToWei.sub(recipientCurrentBalance);
    await relayHubInstance.functions.depositFor(options.recipientAddress, {
      value,
    });
    return fundingAmountToWei;
  } else {
    return recipientCurrentBalance;
  }
}
