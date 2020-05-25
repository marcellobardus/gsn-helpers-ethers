import { chunk } from "lodash";
import { spawn } from "child_process";

import * as tmp from "tmp";

import { ensureRelayer } from "./download-relayer";

export async function runRelayer(
  devMode: boolean,
  ethereumNodeURL: string,
  relayUrl: string,
  relayHubAddress: string,
  quiet: boolean,
  port?: number | string,
  workdir?: any,
  detach?: any,
  gasPricePercent?: number
) {
  // Download relayer if needed
  const binPath = await ensureRelayer();

  // Create tmp dir
  const workingDir = workdir || tmp.dirSync({ unsafeCleanup: true }).name;

  // Build args
  const args = [];
  if (ethereumNodeURL) args.push("-EthereumNodeUrl", ethereumNodeURL);
  if (relayHubAddress) args.push("-RelayHubAddress", relayHubAddress);
  args.push("-Port", getPort({ relayUrl, port }));
  args.push("-Url", getUrl({ relayUrl, port }));
  args.push("-GasPricePercent", gasPricePercent || 0);
  args.push("-Workdir", workingDir);
  if (devMode !== false) args.push("-DevMode");

  // Run it!
  console.error(
    `Starting relayer\n${binPath}\n${chunk(args, 2)
      .map((arr) => " " + arr.join(" "))
      .join("\n")}`
  );
  return spawn(binPath, args, {
    stdio: quiet || detach ? "ignore" : "inherit",
    detached: !!detach,
  });
}

function getPort({ relayUrl, port }) {
  if (port) return port;
  if (relayUrl) {
    const url = new URL(relayUrl);
    if (url.port.length > 0) return url.port;
    else if (url.protocol === "https") return 443;
    else return 80;
  }
  return 8090;
}

function getUrl({ relayUrl, port }) {
  if (relayUrl) return relayUrl;
  if (port) return `http://localhost:${port}`;
  return "http://localhost:8090";
}
