import React, { useEffect, useState } from "react";
import { useWallet } from "@meshsdk/react";
import { deployOracle, queryOracle, updateOracle } from "../api/oracle";
import { States } from "../enums/oracle_states";
import { useOracleContext } from "@/context/OracleContext";
import PriceModal from "../components/PriceModal";

const Oracle = () => {
  const {oracleState, setOracleState} = useOracleContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [adaPrice, setAdaPrice] = useState("");
  const { wallet, connected } = useWallet();
  const { oracleAddress, policyId, oracleDatum, oracleScript, setOracleAddress, setPolicyId, setOracleDatum, setOracleScript, setOracleUTxO } = useOracleContext();

  useEffect(() => {
    const fetchData = async () => {
      if (oracleState === States.Deployed) {
        try {
          const datum = await queryOracle(policyId, "Euro Stablecoin", oracleAddress, setOracleUTxO);
          setOracleDatum(datum);
        } catch (error) {
          console.error("Error querying the oracle:", error);
        }
      }
    };
    fetchData();
  }, [oracleState]);

  const handleModal = () => {
    setModalOpen(true);
  };

  const handleConfirmModal = () => {
    const priceInCents = parseFloat(adaPrice);
    if (!isNaN(priceInCents)) {
      if (oracleState === States.NotDeployed ){
        deployOracle(wallet, "Euro Stablecoin", priceInCents, setOracleState, setPolicyId, setOracleAddress,setOracleScript);
      }else{
        updateOracle(wallet,"Euro Stablecoin",priceInCents,policyId,oracleScript,oracleAddress, setOracleState);
      }
      setModalOpen(false);
    } else {
      alert("Please enter a valid value.");
    }
  };

  return (
    <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-20 w-100">
      <p className="text-lg font-bold text-center text-white mb-4">
        {oracleState === States.NotDeployed && <>Oracle not deployed yet.</>}
        {oracleState === States.Waiting && <>Waiting for transaction confirmation...</>}
        {oracleState === States.Deployed && <>Current price of ADA (in euro cents): {oracleDatum}</>}
      </p>
      <div className="flex justify-between space-x-2">
        <button
          disabled={!connected || oracleState !== States.NotDeployed}
          className="bg-[#c80e22] text-white font-semibold py-2 px-4 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleModal}
        >
          Deploy Oracle
        </button>
        <button
          className="bg-[#c80e22] text-white font-semibold py-2 px-4 rounded hover:bg-black disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={oracleState !== States.Deployed}
          onClick={handleModal}
        >
          Update Oracle
        </button>
      </div>

      {modalOpen && (
        <PriceModal
          adaPrice={adaPrice}
          setAdaPrice={setAdaPrice}
          onConfirm={handleConfirmModal}
          onCancel={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Oracle;
