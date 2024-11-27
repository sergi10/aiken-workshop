import { BrowserWallet, deserializeAddress,mConStr0, mConStr1, mConStr2, stringToHex} from "@meshsdk/core";
import { blockchainProvider, txBuilder } from "./utils";


export async function mintStablecoin(wallet: BrowserWallet,
                                    collateralAddress: string,
                                    mintingPolicyId: string,
                                    referenceTxHash: string,
                                    stablecoinUnits: number,
                                    collateralAmt: number,
                                    oracleAddress:string){
  
  const collateral = (await wallet.getCollateral())[0];
  const utxos = (await wallet.getUtxos());
  const walletAddress = (await wallet.getUsedAddresses())[0]
  const referenceUTxOs = await blockchainProvider.fetchUTxOs(referenceTxHash);
  const mintingUTxORef = referenceUTxOs[1];
  const lovelaceCollateral = collateralAmt*1000000;
  const lovelaceCollateralStr = lovelaceCollateral.toString();
  const { pubKeyHash } = deserializeAddress(walletAddress);
  const oracleWithNFTUTxO = await blockchainProvider.fetchAddressUTxOs(oracleAddress);

  txBuilder.reset();
  await txBuilder
    .setNetwork("preprod")
    .mintPlutusScriptV3()
    .readOnlyTxInReference(oracleWithNFTUTxO[0].input.txHash, oracleWithNFTUTxO[0].input.outputIndex)
    .mint(stablecoinUnits.toString(), mintingPolicyId, stringToHex('Euro Stablecoin'))
    .mintTxInReference(mintingUTxORef.input.txHash, mintingUTxORef.input.outputIndex)
    .mintReferenceTxInRedeemerValue(mConStr0([]))
    .txOut(collateralAddress,[{unit:"lovelace", quantity:lovelaceCollateralStr}])
    .txOutInlineDatumValue(mConStr0([mintingPolicyId,pubKeyHash,stablecoinUnits]),"Mesh")
    .selectUtxosFrom(utxos)
    .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
    .changeAddress(walletAddress)
    .requiredSignerHash(pubKeyHash)
    .complete();
  
  const unsignedTx = txBuilder.txHex;
  txBuilder.reset();
  const signedTx = await wallet.signTx(unsignedTx,true);
  const txHash = await wallet.submitTx(signedTx);
  alert(txHash)
 
}

export async function burnStablecoin(wallet: BrowserWallet,
                                    mintingPolicyId: string,
                                    referenceTxHash: string,
                                    stablecoinUnits: number,
                                    collateralUtxo: string,
                                    ) {

  const collateral = (await wallet.getCollateral())[0];
  const walletAddress = (await wallet.getUsedAddresses())[0]
  const referenceUTxOs = await blockchainProvider.fetchUTxOs(referenceTxHash);
  const collateralUTxORef = referenceUTxOs[0];
  const mintingUTxORef = referenceUTxOs[1];
  const { pubKeyHash } = deserializeAddress(walletAddress);
  const utxos = (await wallet.getUtxos());
  const outputUTxOcollateral = splitTxHash(collateralUtxo)

  await txBuilder
  .setNetwork("preprod")
    .mintPlutusScriptV3()
    .mint((-stablecoinUnits).toString(), mintingPolicyId, stringToHex('Euro Stablecoin'))
    .mintTxInReference(mintingUTxORef.input.txHash, mintingUTxORef.input.outputIndex)
    .mintReferenceTxInRedeemerValue(mConStr1([]))
    .spendingPlutusScriptV3()
    .txIn(outputUTxOcollateral?.txHash, outputUTxOcollateral?.outputIndex)
    .spendingTxInReference(collateralUTxORef.input.txHash, collateralUTxORef.input.outputIndex)
    .spendingReferenceTxInRedeemerValue(mConStr0([]))
    .spendingReferenceTxInInlineDatumPresent()
    .changeAddress(walletAddress)
    .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
    .requiredSignerHash(pubKeyHash)
    .selectUtxosFrom(utxos)
    .complete();
    
  const unsignedTx = txBuilder.txHex;
  txBuilder.reset();
  const signedTx = await wallet.signTx(unsignedTx,true);
  const txHash = await wallet.submitTx(signedTx);
  alert(txHash)
   
}


export async function liquidateStablecoin(wallet: BrowserWallet,
  mintingPolicyId: string,
  referenceTxHash: string,
  stablecoinUnits: number,
  collateralUtxo: string,
  oracleAddress:string
  ) {

  const collateral = (await wallet.getCollateral())[0];
  const walletAddress = (await wallet.getUsedAddresses())[0]
  const referenceUTxOs = await blockchainProvider.fetchUTxOs(referenceTxHash);
  const collateralUTxORef = referenceUTxOs[0];
  const mintingUTxORef = referenceUTxOs[1];
  const utxos = (await wallet.getUtxos());
  const outputUTxOcollateral = splitTxHash(collateralUtxo)
  const oracleWithNFTUTxO = await blockchainProvider.fetchAddressUTxOs(oracleAddress);

  await txBuilder
          .setNetwork("preprod")
          .mintPlutusScriptV3()
          .readOnlyTxInReference(oracleWithNFTUTxO[0].input.txHash, oracleWithNFTUTxO[0].input.outputIndex)
          .mint((-stablecoinUnits).toString(), mintingPolicyId, stringToHex('Euro Stablecoin'))
          .mintTxInReference(mintingUTxORef.input.txHash, mintingUTxORef.input.outputIndex)
          .mintReferenceTxInRedeemerValue(mConStr2([]))
          .spendingPlutusScriptV3()
          .txIn(outputUTxOcollateral?.txHash, outputUTxOcollateral?.outputIndex)
          .spendingTxInReference(collateralUTxORef.input.txHash, collateralUTxORef.input.outputIndex)
          .spendingReferenceTxInRedeemerValue(mConStr1([]))
          .spendingReferenceTxInInlineDatumPresent()
          .changeAddress(walletAddress)
          .txInCollateral(collateral.input.txHash, collateral.input.outputIndex)
          .selectUtxosFrom(utxos)
          .complete();
    
  const unsignedTx = txBuilder.txHex;
  txBuilder.reset();
  const signedTx = await wallet.signTx(unsignedTx,true);
  const txHash = await wallet.submitTx(signedTx);
  alert(txHash)
}

function splitTxHash(input: string) {
  const parts = input.split('#');
  // Validate that the result contains exactly two elements
  if (parts.length !== 2) {
    throw new Error('The string must contain exactly one "#" character');
  }
  // Check that the second part is a valid number
  const outputIndex = parseInt(parts[1], 10);
  if (isNaN(outputIndex)) {
    throw new Error('The part after "#" must be a number');
  }
  // Assign values to the desired variables
  const txHash = parts[0];
  return { txHash, outputIndex };
}
