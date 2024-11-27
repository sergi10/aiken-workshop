import { BlockfrostProvider, MeshTxBuilder, MeshWallet, mConStr0, resolvePaymentKeyHash, stringToHex } from "@meshsdk/core";
import { initializeBlockchainProvider, initializeWallet, readTransactionDataFromJson } from "./utils";

async function updateOracle(txBuilder: MeshTxBuilder, wallet: MeshWallet, blockchainProvider: BlockfrostProvider, tokenName: string, policyId: string, oracleScript: string, oracleAddress: string) {
  const asset = policyId + stringToHex(tokenName);
  const oracleUtxo = (await blockchainProvider.fetchAddressUTxOs(oracleAddress, asset))[0];
  const address = (await wallet.getUsedAddresses())[0];
  const ownerUtxo = (await blockchainProvider.fetchAddressUTxOs(address))[0];
  const collateral = (await wallet.getCollateral())[0];

  if (!collateral) {
    console.log("Please add some collateral to perform the transaction.");
    return;
  }

  await txBuilder
    .spendingPlutusScriptV3()
    .txIn(
      oracleUtxo.input.txHash,
      oracleUtxo.input.outputIndex,
      oracleUtxo.output.amount,
      oracleUtxo.output.address
    )
    .txInRedeemerValue(mConStr0([]))
    .txInInlineDatumPresent()
    .txInScript(oracleScript)
    .txIn(
      ownerUtxo.input.txHash,
      ownerUtxo.input.outputIndex,
      ownerUtxo.output.amount,
      ownerUtxo.output.address
    )
    .txInCollateral(
      collateral.input.txHash,
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address,
    )
    .requiredSignerHash(resolvePaymentKeyHash(address))
    .txOut(oracleAddress, oracleUtxo.output.amount)
    .txOutInlineDatumValue(2)
    .changeAddress(address)
    .complete();

  const unsignedTx = txBuilder.txHex;
  const signedTx = wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("Oracle updated, tx hash:", txHash);
}

async function main() {
  const blockchainProvider = initializeBlockchainProvider();
  const wallet = initializeWallet(blockchainProvider);
  const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
  });

  const { tokenName, policyId, oracleScript, oracleAddress } = await readTransactionDataFromJson();
  await updateOracle(txBuilder, wallet, blockchainProvider, tokenName, policyId, oracleScript, oracleAddress);
}

main();
