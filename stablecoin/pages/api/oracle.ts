import { Asset, BrowserWallet, Mint, PlutusScript, Transaction, deserializeAddress, deserializeDatum, mConStr0, resolvePlutusScriptAddress, resolveScriptHash, stringToHex} from "@meshsdk/core";
import { getPlutusScriptParams, initializeBlockchainProvider } from "./utils";
import { States } from "../enums/oracle_states";

const blockchainProvider = initializeBlockchainProvider(); 

export async function deployOracle(wallet: BrowserWallet,
                                  tokenName: string,
                                  value: number,
                                  setState:any,
                                  setPolicyId:any, 
                                  setOracleAddress:any,
                                  setOracleScript: any) {
  const walletAddress = (await wallet.getUsedAddresses())[0];
  const utxos = await wallet.getUtxos();
  const utxo = utxos[0];
  const outRef = { alternative: 0, fields: [utxo.input.txHash, utxo.input.outputIndex] }
  const { pubKeyHash } = deserializeAddress(walletAddress);
  const script = getPlutusScriptParams("oracle.oracle.mint", [outRef, pubKeyHash]);
  const collateral = (await wallet.getCollateral())[0];
  const policyId = resolveScriptHash(script.code, "V3")
  const scriptAddress = resolvePlutusScriptAddress(script)

  if (!collateral) {
    alert("Please add some collateral to perform the transaction.");
    return;
  }

  const asset: Mint = {
    assetName: tokenName,
    assetQuantity: "1",
    label: "721",
    recipient: {
      address: scriptAddress,
      datum: {
          value: value,
          inline: true
      }
  },
  };

  const redeemer = {
    data: { alternative: 0, fields: [] },
    tag: "MINT",
  };

  const tx = new Transaction({initiator:wallet})
                  .setNetwork("preprod")
                  .setTxInputs([utxo])
                  .mintAsset(script, asset, redeemer)
                  .setCollateral([collateral])
                  .setRequiredSigners([walletAddress]);

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, true);
  const txHash = await wallet.submitTx(signedTx);

  setState(States.Waiting);
  alert("Oracle deployed, tx hash: "+ txHash);
 
  blockchainProvider.onTxConfirmed(txHash, () => {
    setPolicyId(policyId);
    setOracleAddress(scriptAddress);
    setOracleScript(script.code)
    setState(States.Deployed);
  })

}

export async function queryOracle(policyId: string, tokenName: string, oracleAddress: string, setOracleUTxO: any) {
  const asset = policyId + stringToHex(tokenName);
  const utxo = (await blockchainProvider.fetchAddressUTxOs(oracleAddress, asset))[0];
  setOracleUTxO(utxo.input.txHash+" # 0");
  if (utxo.output.plutusData !== undefined ){
    return (await deserializeDatum(utxo.output.plutusData).int)
  }
  return undefined
}

export async function updateOracle(wallet: BrowserWallet, tokenName: string, value: number ,policyId: string, oracleScript: string, oracleAddress: string, setState: any) {
  const asset = policyId + stringToHex(tokenName);
  const oracleUtxo = (await blockchainProvider.fetchAddressUTxOs(oracleAddress, asset))[0];
  const address = (await wallet.getUsedAddresses())[0];
  const collateral = (await wallet.getCollateral())[0];

  if (!collateral) {
    alert("Please add some collateral to perform the transaction.");
    return;
  }

  const oracleScript1 = {
    code: oracleScript,
    version: "V3" 
  }

  const redeemer = {
    data: { alternative: 0, fields: [] },
  };

  const tx = new Transaction({ initiator: wallet, fetcher: blockchainProvider })
  .setNetwork("preprod")
  .redeemValue({
    value: oracleUtxo,
    script: oracleScript1 as PlutusScript,
    redeemer
  })
  .sendValue({
    address: oracleAddress,
    datum: {
        value: value,
        inline: true
    }
}, oracleUtxo)
  .setRequiredSigners([address]);  

  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx, true);
  const txHash = await wallet.submitTx(signedTx);
  setState(States.Waiting);
  alert("Oracle deployed, tx hash: "+ txHash);
 
  blockchainProvider.onTxConfirmed(txHash, () => {
    setState(States.Deployed);
  })
}