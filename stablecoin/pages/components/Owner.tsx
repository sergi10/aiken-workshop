import React, { useState, memo } from "react";
import { deployMintingPolicy } from "../api/reference_scripts";
import { useOracleContext } from "@/context/OracleContext";
import { useWallet } from "@meshsdk/react";
import { useReferenceContext } from "@/context/ReferenceContext";
import { States } from "../enums/reference_states";

const Owner = () => {
  const [collateral, setCollateral] = useState(150);
  const { oracleScript } = useOracleContext();
  const {setReferenceTxHash,referenceState, setReferenceState, setCollateralAddress, setMintingPolicyId, setMintingScript} = useReferenceContext()
  const { wallet } = useWallet();

  function handleDeploy(): void {
    deployMintingPolicy(wallet, oracleScript, collateral, setReferenceTxHash, setReferenceState, setCollateralAddress, setMintingPolicyId,setMintingScript);
  }

  return (
    <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-20 w-100">
      {referenceState == States.NotDeployed &&
      <p className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
        <span>Minimum Percentage of collateral: </span>
        <input
          type="number"
          placeholder="Price in cents"
          value={collateral}
          onChange={(e) => setCollateral(Number(e.target.value))}
          className="border border-black p-2 rounded text-black w-24"
        />
      </p>}
      {referenceState == States.Deploying &&
        <p className="text-lg font-bold text-white mb-4 flex items-center space-x-2">Deploying Script reference.. </p>
      }

      {referenceState == States.Deployed &&
        <p className="text-lg font-bold text-white mb-4 flex items-center space-x-2">Script Reference deployed. ✅ </p>
      }
      <div className="flex flex-col items-center justify-center space-x-2">
        <button
          className="bg-[#c80e22] text-white font-semibold py-2 px-4 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleDeploy}
          disabled={referenceState!==States.NotDeployed}
        >
          Deploy scripts
        </button>
      </div>
    </div>
  );
};

export default memo(Owner);
