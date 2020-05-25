import { providers, Wallet } from "ethers";

import { deployRelayHub } from "./deploy-relay-hub";
import { runRelayer } from "./run-relayer";
import { registerRelay } from "./register-relayer";
import { fundRecipient } from "./fund-recipient";

export async function startGSNInfrastructure(
  privateKey: string,
  ethereumProviderlUrl: string,
  relayerOptions: {
    url: string;
    stakeEther: number;
    fundsEther: number;
    quiet?: boolean;
    unstakeDelaySecond?: number;
  },
  recipientOptions: {
    address: string;
    fundsEther: number;
  }
) {
  const signer = new Wallet(
    privateKey,
    new providers.JsonRpcProvider(ethereumProviderlUrl)
  );

  const relayHubAddress = await deployRelayHub(signer);

  await runRelayer(
    false,
    ethereumProviderlUrl,
    relayerOptions.url,
    relayHubAddress,
    relayerOptions.quiet || false
  );

  await registerRelay(
    {
      relayHubAddress,
      relayerUrl: relayerOptions.url,
      stakeEther: relayerOptions.stakeEther,
      unstakeDelaySeconds: relayerOptions.unstakeDelaySecond || 604800,
      fundsEther: relayerOptions.fundsEther,
    },
    signer
  );
  await fundRecipient(
    {
      amountEther: recipientOptions.fundsEther,
      relayHubAddress,
      recipientAddress: recipientOptions.address,
    },
    signer
  );

  console.log(
    "GSN relayer is setup, the recipient is ready to accept relayed transactions!"
  );
}
