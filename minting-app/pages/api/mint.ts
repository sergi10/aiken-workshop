import { BlockfrostProvider, BrowserWallet, Transaction, applyCborEncoding} from "@meshsdk/core";


export async function mintTokens(wallet: BrowserWallet,  cantidad:string, name:string, redeemer:string, code:string, policyId:string) {
    
    const blockfrost = new BlockfrostProvider("preprodlo2HS6vTvLV9SNdho959e2OAiZJPo9Wl");
    
    const ownUtxo = await wallet.getUtxos();
    function textToHex(text: string): string {
    return Array.from(text)
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
}
    
    const collaterals = await wallet.getCollateral();    
    const tx = await new Transaction({ initiator: wallet, fetcher: blockfrost, verbose: true})
    
	.txBuilder
	.mintPlutusScriptV3()
	.mint(cantidad, policyId, textToHex(name))
	.mintingScript(applyCborEncoding(code))
	.mintRedeemerValue(redeemer)
	.selectUtxosFrom(ownUtxo)
	.changeAddress(await wallet.getChangeAddress())
	.txInCollateral(collaterals[0].input.txHash, collaterals[0].input.outputIndex)
	.setNetwork("preprod")
	.complete()
    
	const txFirmada = wallet.signTx(tx, true)
	
	const newTxHash = await wallet.submitTx(await txFirmada)
	alert("transacción enviada: " +  newTxHash)
}
