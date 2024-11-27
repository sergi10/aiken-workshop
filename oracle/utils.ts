import { BlockfrostProvider, MeshWallet, PlutusScript } from "@meshsdk/core";
import cbor from "cbor";
import plutusScript from "./onchain/plutus.json";
import { applyParamsToScript } from "@meshsdk/core-csl"; 
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Blockchain provider setup
export function initializeBlockchainProvider(): BlockfrostProvider {
  return new BlockfrostProvider(process.env.BLOCKFROST_API_KEY!);
}

// Wallet setup using mnemonic
export function initializeWallet(blockchainProvider: BlockfrostProvider): MeshWallet {
  return new MeshWallet({
    networkId: 0,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: "mnemonic",
      words: process.env.MNEMONIC_WORDS!.split(','),
    },
  });
}

// Function to retrieve the Plutus script
export function getPlutusScript(title: String): PlutusScript {
  return {
    code: cbor
      .encode(Buffer.from(plutusScript.validators.filter((val: any) => val.title === title)[0].compiledCode, "hex"))
      .toString("hex"),
    version: "V3",
  };
}

export function getPlutusScriptParams(title:string, params): PlutusScript {
  const scriptCbor = applyParamsToScript(
    cbor.encode(Buffer.from(plutusScript.validators.filter((val: any) => val.title === title)[0].compiledCode, "hex"))
      .toString("hex"),
    params,
    "Mesh",
  );

  return  {
    code: scriptCbor,
    version: "V3"
  }
}

export async function readTransactionDataFromJson() {
  return new Promise((resolve, reject) => {
    fs.readFile('transactionData.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}
