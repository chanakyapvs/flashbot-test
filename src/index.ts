import { FlashbotsBundleProvider } from "@flashbots/ethers-provider-bundle";
import { BigNumber, providers, Wallet } from "ethers";
const { PrivateKey } = require('../secrets.json');

const chain=5;

const provider = new providers.InfuraProvider(chain);
const FLASHBOTS_ENDPOINT = "https://relay-goerli.flashbots.net";

//const private_key = "0x0";
const wallet = new Wallet(PrivateKey, provider);

async function main() {
    const flashbotprovider = await FlashbotsBundleProvider.create(provider, Wallet.createRandom(), FLASHBOTS_ENDPOINT)
    //console.log(await provider.getBlockNumber());
    provider.on('block', async (blockNumber) => {
        console.log(blockNumber);
       const bundleSubmitResponse = await flashbotprovider.sendBundle(
            [
                {
                    transaction:{
                        chainId: chain,
                        type: 2,
                        value: BigNumber.from(10).pow(18).div(100).mul(3),
                        //gasLimit: 60000,
                        //data: "0x",
                        data: "0x1249c58b",
                        maxFeePerGas: BigNumber.from(10).pow(9).mul(3),
                        maxPriorityFeePerGas: BigNumber.from(10).pow(9).mul(2),
                        //to: "0x957B500673A4919C9394349E6bbD1A66Dc7E5939"
                        to:"0x20EE855E43A7af19E407E39E5110c2C1Ee41F64D"

                    },
                    signer: wallet
                }
            ], (blockNumber+1)
        )

        if ('error' in bundleSubmitResponse) {
            console.warn(bundleSubmitResponse.error.message)
            return
          }
      
          console.log(await bundleSubmitResponse.simulate())
    })
}
main();