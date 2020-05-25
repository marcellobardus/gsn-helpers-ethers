# GSN Helpers ethers.js version

### Problem

Recently I was in need to deploy my own GSN relayer on a custom network. I downloaded the official package `@openzeppelin/gsn-helpers`, after a few attempts I realised that setting up a custom GSN infrastructure is pain in the ass because of web3.
I have rewritten the fragments of code responsible for setting up a relayer to `ethers` to make it as simple as possible and support custom deployments.

To start using simply install this package using `yarn add https://github.com/marcellobardus/gsn-helpers-ethers.git`

and then

    import { startGSNInfrastructure } from 'gsn-helpers-ethers';

    const privKey = "0x...";
    const ethereumNodeUrl = "http://localhost:8545";

    const gsnRelayerUrl = "https://mydomain.com";
    const relayerStakeEther = 1;
    const relayerUnstakeDelaySecond = 604800; // 1 week
    const relayerFundsEther = 5;
    const relayerQuiet = true; // turns off relayer logs

    const gsnRecipientContractAddress = "0x...";
    const gsnRecipientFundsEther = 0.5;

    startGsnInfrastructure(
        privKey,
        ethereumNodeUrl,
        {
    	    url: gsnRelayerUrl,
    	    stakeEther: relayerStakeEther,
    	    unstakeDelaySecond: relayerUnstakeDelaySecond,
    	    fundsEther: relayerFundsEther,
    	    quiet: relayerQuiet
        },
        {
    	    address: gsnRecipientContractAddress,
    	    fundsEther: gsnRecipientFundsEther
        }
    );

Have fun.
