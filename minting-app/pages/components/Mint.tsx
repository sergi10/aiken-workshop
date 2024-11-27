import React, { useState } from "react";
import { useWallet } from "@meshsdk/react";
import { mintTokens } from "../api/mint";
import { applyCborEncoding, PlutusScript, resolvePlutusScriptAddress, resolvePlutusScriptHash, AssetExtended } from "@meshsdk/core"

import "@meshsdk/react/styles.css";

const Mint = () => {
    const { wallet, connected } = useWallet();

    const [policyId, setPolicyId] = useState("");
    const [assets, setAssets] = useState<AssetExtended[]>([]);
    const [cbor, setCbor] = useState("");
    const [cborEncoded, setCborEncoded] = useState("");
    const [name, setName] = useState("");
    const [redeemer, setRedeemer] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [error, setError] = useState("");

    const setCantidadFromInput = async (dat: string) => {

		// Permitir solo números
	if (/^\d*$/.test(dat)) {
	    setCantidad(dat);

      // Validar si el número es mayor a 1000000
	    if (dat && parseInt(dat, 10) <= 0) {
		setError("El número debe ser mayor a 0");
	    } else {
		setError("");
		
	    }
	} else {
	    setError("Tiene que ser una cantidad en Lovelace");
	}
    }
    function hexToString(hex: string): string {
	let result = '';
	for (let i = 0; i < hex.length; i += 2) {
            // Tomar cada par de caracteres hexadecimales
            const hexPair = hex.slice(i, i + 2);
            // Convertir el par hexadecimal a un carácter y agregar al resultado
            result += String.fromCharCode(parseInt(hexPair, 16));
	}
	return result;
    }


    const setRedeemerFromInput = async (dat: string) => {
	setRedeemer(dat);
    }
    const setNameFromInput = async (dat: string) => {
	setName(dat);
    }
    const minar = async () => {
	if (cantidad !="" && name != "" && redeemer != "" && error === ""){
	    alert(cantidad + " " + name + " " + redeemer);
	
	    await mintTokens(wallet, cantidad, name, redeemer, cborEncoded, policyId);
	}
    };
    const setCborFromTextarea = async (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
	event.preventDefault();
	const pastedData = event.clipboardData.getData("text");
	event.currentTarget.value += pastedData;
	await obtenerPolicy(pastedData);
    }
    const reload = async () => {
	if (cbor != "") {
	    obtenerPolicy(cbor);
	} else {
	    alert("Pega el código de CBOR");
	}
	
    }
    const obtenerPolicy = async (cborParameter:string) => {
	const encoded = applyCborEncoding(cborParameter);
	
	const script: PlutusScript = {
			
	    version: "V3",
	    code: encoded
	}
	
	const hash = resolvePlutusScriptHash(resolvePlutusScriptAddress(script, 0));
	const listAssets = (await wallet.getAssets()).filter((ea) => ea.policyId === hash);
	console.log(listAssets);
	setPolicyId(hash);
	setAssets(listAssets);
	setCborEncoded(encoded);
	setCbor(cborParameter);
	
    };

    return (
		<div className="flex flex-col items-center w-full bg-gray-900 min-h-screen">
			<div className="w-full bg-gray-800 flex flex-col items-center py-4 px-4">

				<div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-4 w-full">
					<p className="text-sm font-bold text-center text-white mb-2">
						{policyId !== "" ? policyId : "Escribe el código abajo para poder obtener la policy Id"}
					</p>
					<div className="flex flex-col space-y-2">
						<textarea
							className="w-full bg-[#2c2c2c] text-white p-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#c80e22] focus:border-transparent"
							placeholder="Escribe aquí..."
							onPaste={setCborFromTextarea}
							style={{ minHeight: "10px" }} // Altura mínima
						/>
					</div>

				</div>

				<div className="flex justify-between w-full p-4 space-x-4">

					<div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-4 w-1/2">
						<p className="text-sm font-bold text-center text-white mb-2">
							Minar tokens
						</p>
						<div className="flex flex-col space-y-6">
							<div className="relative">
								<span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-300 pointer-events-none">
									Cantidad
								</span>
								<input
									type="text"
									placeholder="Cantidad"
									className="border border-gray-300 rounded px-3 py-1 pl-32 bg-transparent relative w-full text-white caret-white"
									onChange={(e) => setCantidadFromInput(e.target.value)}

								/>

								{error && (
									<span className="absolute left-3 top-full mt-1 text-red-500 text-sm">
										{error}
									</span>
								)}
							</div>
							<div className="relative">
								<span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-300 pointer-events-none">
									Token Name
								</span>
								<input
									type="text"
									placeholder="Token Name"
									className="border border-gray-300 rounded px-3 py-1 pl-32 bg-transparent relative w-full text-white caret-white"
									onChange={(e) => setNameFromInput(e.target.value)}
								/>
							</div>
							<div className="relative">
								<span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-300 pointer-events-none">
									Redeemer
								</span>
								<input
									type="text"
									placeholder="Redeemer"
									className="border border-gray-300 rounded px-3 py-1 pl-32 bg-transparent relative w-full text-white caret-white"
									onChange={(e) => setRedeemerFromInput(e.target.value)}
								/>
							</div>
							<div className="flex justify-between space-x-2">
								<button
									disabled={!connected}
									className="bg-[#c80e22] text-white font-semibold py-1 px-3 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
									onClick={minar}
								>
									Minar tokens
								</button>
							</div>
						</div>



					</div>
					<div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-4 w-1/2 mx-auto">
						<p className="text-sm font-bold text-center text-white mb-4">
							{policyId != "" ? "Tokens con " + policyId : "Actualiza o pega el cbor para ver los tokens"}
						</p>

						<button
							className="bg-[#c80e22] text-white font-semibold py-1 px-3 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
							onClick={reload}
						>
							Recargar
						</button>
						<div className="list space-y-2">
							{assets.map((item) => (
								<button
									className="list-item bg-white text-black rounded-lg p-2 text-center"
									

									disabled={!connected}
								>
									{hexToString(item.assetName) + " " + item.quantity}
								</button>
							))}
						</div>

						<div className="relative">
							<span className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-300 pointer-events-none">
								Redeemer
							</span>
							<input
								type="text"
								placeholder="Redeemer"
								className="border border-gray-300 rounded px-3 py-1 pl-32 bg-transparent relative w-full text-white caret-white"
								onChange={(e) => setRedeemerFromInput(e.target.value)}
							/>
						</div>

					</div>


				</div>
			</div>

		</div>
	);
};

export default Mint;
