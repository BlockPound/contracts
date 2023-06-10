import { Address, getRandomNonce, toNano, zeroAddress } from "locklift"
import BigNumber from "bignumber.js"

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!
  
  const initialSupplyTo   = new Address("0:577de8eb7386561903ce19bfd75175f927c2679c676c7968ce37daaeb32e6315");
  const rootOwner         = new Address("0:577de8eb7386561903ce19bfd75175f927c2679c676c7968ce37daaeb32e6315");
  const name              = "LB Test Token";
  const symbol            = "LBT";
  const initialSupply     = 1500000;
  const decimals          = 18;
  const disableMint       = false;
  const disableBurnByRoot = false;
  const pauseBurn         = false;
                  
  
  /* 
    Returns compilation artifacts based on the .tsol file name
      or name from value config.externalContracts[pathToLib].
  */
  const TokenWallet = locklift.factory.getContractArtifacts("TokenWallet")
  
  /* 
    Deploy the TIP-3 Token Root contract.
    @params deployWalletValue: Along with the deployment of the root token,
      the wallet will be automatically deployed to the owner. 
      This is the amount of EVERs that will be sent to the wallet.
  */
  const { contract: tokenRoot } = await locklift.factory.deployContract({
    contract: "TokenRoot",
    publicKey: signer.publicKey,
    initParams: {
      deployer_: zeroAddress, 
      randomNonce_: getRandomNonce(),
      rootOwner_: rootOwner,
      name_: name,
      symbol_: symbol,
      decimals_: decimals,
      walletCode_: TokenWallet.code,
    },
    constructorParams: {
      initialSupplyTo: initialSupplyTo,
      initialSupply: new BigNumber(initialSupply).shiftedBy(decimals).toFixed(),
      deployWalletValue: toNano(1),
      mintDisabled: disableMint,
      burnByRootDisabled: disableBurnByRoot,
      burnPaused: pauseBurn,
      remainingGasTo: zeroAddress,
    },
    value: toNano(5),
  })

  console.log(`Created: i${name}: ${tokenRoot.address}`)
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e)
    process.exit(1)
  })