import { BlockfrostProvider, deserializeAddress, mConStr0, mConStr1, MeshTxBuilder, MeshWallet, PlutusScript, resolveScriptHash, stringToHex } from "@meshsdk/core";
import { initializeBlockchainProvider, initializeWallet, readTransactionDataFromJson } from "./utils";


async function deleteOracle(txBuilder: MeshTxBuilder, wallet: MeshWallet, blockchainProvider: BlockfrostProvider, tokenName: string, script: string, oracleAddress:string) {
  const walletAddress = wallet.getUsedAddresses()[0];
  const utxos = await wallet.getUtxos();
  const utxo = utxos[0];
  const { pubKeyHash } = deserializeAddress(walletAddress);
  const collateral = (await wallet.getCollateral())[0];
  const policyId = resolveScriptHash(script, "V3")

  const oracleUTxo = (await blockchainProvider.fetchAddressUTxOs(oracleAddress, policyId+stringToHex(tokenName)))[0]

  if (!collateral) {
    console.log("Please add some collateral to perform the transaction.");
    return;
  }

  await txBuilder
  .spendingPlutusScriptV3()
  .txIn(oracleUTxo.input.txHash, oracleUTxo.input.outputIndex)
  .txInRedeemerValue(mConStr1([]))
  .txInInlineDatumPresent()
  .txInScript(script)
  .mintPlutusScriptV3()
  .mint("-1", policyId, stringToHex(tokenName))
  .mintingScript(script)
  .mintRedeemerValue(mConStr1([]))
  .txIn(
    utxo.input.txHash,
    utxo.input.outputIndex,
    utxo.output.amount,
    utxo.output.address
  )
  .txInCollateral(
    collateral.input.txHash,
    collateral.input.outputIndex,
    collateral.output.amount,
    collateral.output.address,
  )
  .changeAddress(walletAddress)
  .requiredSignerHash(pubKeyHash)
  .selectUtxosFrom(utxos)
  .complete();

  const unsignedTx = txBuilder.txHex;
  const signedTx = wallet.signTx(unsignedTx, true);
  const txHash = await wallet.submitTx(signedTx);
  console.log("Oracle deleted, tx hash:", txHash);
}



async function main() {
  const blockchainProvider = initializeBlockchainProvider();
  const wallet = initializeWallet(blockchainProvider);
  const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
  });

  const {  oracleScript, oracleAddress } = await readTransactionDataFromJson();
  await deleteOracle(txBuilder, wallet, blockchainProvider, "MyOracle", oracleScript, oracleAddress);
}

main();

