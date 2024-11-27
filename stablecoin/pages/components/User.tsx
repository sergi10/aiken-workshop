import { useReferenceContext } from '@/context/ReferenceContext';
import React, { useState } from 'react';
import { burnStablecoin, liquidateStablecoin, mintStablecoin } from '../api/minting';
import { useWallet } from '@meshsdk/react';
import { useOracleContext } from '@/context/OracleContext';
import Oracle from './Oracle';

const User = () => {
  
  const {wallet} = useWallet();
  const {oracleAddress} = useOracleContext();
  const {referenceTxHash, mintingPolicyId, collateralAddress} = useReferenceContext();
  const [stablecoinAmt, setStablecoinAmt ] = useState(10);
  const [collateralAmt, setCollateralAmt] = useState(15);
  const [burnAmt, setBurnAmt] = useState(10);
  const [burnUTxORef, setBurnUTxORef] = useState("");

  const [actionType, setActionType] = useState("Burn");

  function handleMint(): void {
    mintStablecoin(wallet, collateralAddress, mintingPolicyId, referenceTxHash, stablecoinAmt, collateralAmt, oracleAddress);
  }

  function handleBurn(): void {
    if(actionType === "Burn") {
      burnStablecoin(wallet,mintingPolicyId, referenceTxHash, burnAmt, burnUTxORef);
    }else{
      liquidateStablecoin(wallet, mintingPolicyId, referenceTxHash, burnAmt, burnUTxORef,oracleAddress);
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-10 max-w-lg w-full mx-auto space-y-6 mb-6">
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-white">Collateral UTxO Ref:</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="border border-black p-2 rounded text-black w-full"
            value={referenceTxHash !== "" ? referenceTxHash + "#0" : ""} 
            readOnly
          />
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-white">Stablecoin Minting Policy UTxO Ref:</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            className="border border-black p-2 rounded text-black w-full"
            value={referenceTxHash !== "" ? referenceTxHash + "#1" : ""} 
            readOnly
          />
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-white">Stablecoin to mint (units):</p>
          <input
            type="number"
            value={stablecoinAmt}
            className="border border-black p-2 rounded text-black w-24"
            onChange={(e) => setStablecoinAmt(Number(e.target.value))}
          />
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-white">Collateral to lock (in ADA):</p>
          <input
            type="number"
            value={collateralAmt}
            className="border border-black p-2 rounded text-black w-24"
            onChange={(e) => setCollateralAmt(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-center">
          <button
            className="bg-[#c80e22] text-white font-semibold py-2 px-6 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleMint}
          >
            Mint stablecoins
          </button>
        </div>
      </div>

      <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-10 max-w-lg w-full mx-auto space-y-6 mb-6">
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-white">Collateral UTxO Ref to unlock:</p>
          <input
            type="text"
            className="border border-black p-2 rounded text-black w-full"
            value={burnUTxORef}
            onChange={(e) => setBurnUTxORef(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-white">Stablecoins to burn/liquidate (units):</p>
          <input
            type="number"
            className="border border-black p-2 rounded text-black w-24"
            value={burnAmt}
            onChange={(e) => setBurnAmt(Number(e.target.value))}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <p className="text-lg font-bold text-white">Action:</p>
          <div className="flex items-center space-x-2">
            <label className="text-white">
              <input
                type="radio"
                value="Burn"
                checked={actionType === "Burn"}
                onChange={() => setActionType("Burn")}
                className="mr-1"
              />
              Burn
            </label>
            <label className="text-white">
              <input
                type="radio"
                value="Liquidate"
                checked={actionType === "Liquidate"}
                onChange={() => setActionType("Liquidate")}
                className="mr-1"
              />
              Liquidate
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBurn}
            className="bg-[#c80e22] text-white font-semibold py-2 px-6 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {actionType === "Burn" ? "Burn stablecoins" : "Liquidate stablecoins"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
