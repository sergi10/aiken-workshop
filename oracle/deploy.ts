import { MeshTxBuilder, MeshWallet, deserializeAddress, mConStr0, resolvePlutusScriptAddress, resolveScriptHash, stringToHex} from "@meshsdk/core";
import { getPlutusScriptParams, initializeBlockchainProvider, initializeWallet } from "./utils";
import fs from 'fs';

async function deployOracle(txBuilder: MeshTxBuilder, wallet: MeshWallet, tokenName: string) {
  const walletAddress = wallet.getUsedAddresses()[0];
  const utxos = await wallet.getUtxos();
  const utxo = utxos[0];
  const outRef = { alternative: 0, fields: [utxo.input.txHash, utxo.input.outputIndex] }
  const { pubKeyHash } = deserializeAddress(walletAddress);
  const script = getPlutusScriptParams("oracle.oracle.mint", [outRef, pubKeyHash]);
  const collateral = (await wallet.getCollateral())[0];
  const policyId = resolveScriptHash(script.code, "V3")
  const scriptAddress = resolvePlutusScriptAddress(script)
  
  if (!collateral) {
    console.log("Please add some collateral to perform the transaction.");
    return;
  }

  await txBuilder
  .mintPlutusScriptV3()
  .mint("1", policyId, stringToHex(tokenName))
  .mintingScript(script.code)
  .mintRedeemerValue(mConStr0([]))
  .txInCollateral(
    collateral.input.txHash,
    collateral.input.outputIndex,
    collateral.output.amount,
    collateral.output.address,
  )
  .changeAddress(walletAddress)
  .requiredSignerHash(pubKeyHash)
  .txIn(
    utxo.input.txHash,
    utxo.input.outputIndex,
    utxo.output.amount,
    utxo.output.address
  )
  .txOut(scriptAddress, [{
    quantity: "1",
    unit: policyId + stringToHex(tokenName)
  }])
  .txOutInlineDatumValue(1)
  .selectUtxosFrom(utxos)
  .complete();

  const unsignedTx = txBuilder.txHex;
  const signedTx = wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("Oracle deployed, tx hash:", txHash);
  await saveTransactionDataToJson(tokenName, policyId, script.code, scriptAddress);
}


async function saveTransactionDataToJson(tokenName: string, policyId: string, oracleScript: string, oracleAddress: string) {
  const data = {
    tokenName,
    policyId,
    oracleScript,
    oracleAddress
  };

  fs.writeFile('transactionData.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('Error writing to JSON file', err);
    } else {
      console.log('Transaction data saved to transactionData.json');
    }
  });
}

async function main() {
  const blockchainProvider = initializeBlockchainProvider();
  const wallet = initializeWallet(blockchainProvider);
  const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
  });

  await deployOracle(txBuilder, wallet, "MyOracle");
}

main();