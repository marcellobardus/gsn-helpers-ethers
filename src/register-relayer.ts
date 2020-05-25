import { abi } from "./contracts-builds/RelayHub.json";
import { waitForRelay, isRelayerRunning } from "./helpers";
import axios from "axios";

import { Signer, Contract } from "ethers";
import { parseEther } from "ethers/utils";

import sleep from "sleep-promise";

export async function registerRelay(
  options: {
    relayHubAddress: string;
    relayerUrl: string;
    stakeEther: number;
    unstakeDelaySeconds: number;
    fundsEther: number;
  },
  signer: Signer
) {
  let relayerStatus = await isRelayerRunning(options.relayerUrl);

  while (!relayerStatus) {
    sleep(1000);
    relayerStatus = await isRelayerRunning(options.relayerUrl);
  }

  try {
    console.error(`Funding GSN relay at ${options.relayerUrl}`);

    const response = await axios.get(`${options.relayerUrl}/getaddr`);
    const relayAddress: string = response.data.RelayServerAddress;

    const relayHubInstance = new Contract(options.relayHubAddress, abi, signer);

    await relayHubInstance.functions.stake(
      relayAddress,
      options.unstakeDelaySeconds.toString(),
      { value: parseEther(options.stakeEther.toString()) }
    );

    await signer.sendTransaction({
      to: relayAddress,
      value: parseEther(options.fundsEther.toString()),
    });

    await waitForRelay(options.relayerUrl);

    console.error(`Relay is funded and ready!`);
  } catch (error) {
    throw Error(`Failed to fund relay: '${error}'`);
  }
}
