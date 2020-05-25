import axios from "axios";
import sleep from "sleep-promise";

export async function isRelayReady(relayUrl: string): Promise<boolean> {
  try {
    const response = await axios.get(`${relayUrl}/getaddr`);
    return Boolean(response.data.Ready);
  } catch (err) {
    return false;
  }
}

export async function isRelayerRunning(relayUrl: string): Promise<boolean> {
  try {
    const response = await axios.get(`${relayUrl}/getaddr`);
    if (response.data.RelayServerAddress) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

export async function waitForRelay(relayUrl: string) {
  const timeout = 30;
  console.error(`Will wait up to ${timeout}s for the relay to be ready`);

  for (let i = 0; i < timeout; ++i) {
    await sleep(1000);

    if (await isRelayReady(relayUrl)) {
      return;
    }
  }

  throw Error(`Relay not ready after ${timeout}s`);
}
