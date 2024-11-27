import { BrowserWallet, mConStr0, PlutusScript, resolvePlutusScriptAddress, resolveScriptHash,} from "@meshsdk/core";
import { blockchainProvider, getPlutusScript, getPlutusScriptParams, txBuilder } from "./utils";
import { States } from "../enums/reference_states";


export async function deployMintingPolicy(wallet: BrowserWallet,oracleScript: string, collateralRate:number, setReferenceTxHash: any, setReferenceState: any, setCollateralAddress: any, setMintingPolicyId:any, setMintingScript: any) {
  
  const walletAddress = (await wallet.getUsedAddresses())[0]
  const utxos = (await wallet.getUtxos());
  const alwaysFalse = {
    code: "5857010100323232323225333002323232323253330073370e900118041baa00113232324a06018601a004601600260126ea800458c024c028008c020004c020008c018004c010dd50008a4c26cacae6955ceaab9e5742ae89",
    version: "V3"
  }
  const alwaysFalseAddress = resolvePlutusScriptAddress(alwaysFalse as PlutusScript)
  const collateralScript = getPlutusScript("collateral.collateral.spend")
  const collateralAddress = resolvePlutusScriptAddress(collateralScript as PlutusScript)
  const collateralScriptHash = resolveScriptHash(collateralScript.code,"V3");
  const oracleScriptHash = resolveScriptHash(oracleScript, "V3");
  const mintingScript = getPlutusScriptParams("minting.minting.mint",[mConStr0([oracleScriptHash,collateralScriptHash,collateralRate])]);
  const mintingPolicyId = resolveScriptHash(mintingScript.code, mintingScript.version);

  txBuilder.reset();
  await txBuilder
  .setNetwork("preprod")
  .txOut(alwaysFalseAddress, [])
  .txOutReferenceScript(collateralScript.code, "V3")
  .txOut(alwaysFalseAddress, [])
  .txOutReferenceScript(mintingScript.code,"V3")
  .selectUtxosFrom(utxos)
  .changeAddress(walletAddress)
  .complete();
  
  const unsignedTx = txBuilder.txHex;
  txBuilder.reset();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  alert("Reference scripts tx hash:" + txHash);
  txBuilder.reset();
  setReferenceState(States.Deploying);
  
  blockchainProvider.onTxConfirmed(txHash, async () => {
    setReferenceTxHash(txHash);
    setReferenceState(States.Deployed);
    setCollateralAddress(collateralAddress);
    setMintingPolicyId(mintingPolicyId);
    setMintingScript(mintingScript.code)
  })
  
}