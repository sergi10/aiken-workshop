import { useOracleContext } from '@/context/OracleContext';
import { useReferenceContext } from '@/context/ReferenceContext';
import { useWallet } from '@meshsdk/react';
import React, { useEffect, useState } from 'react';

const InfoTable = () => {
  const { wallet, connected } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const {oracleAddress, oracleDatum, oracleUTxO} = useOracleContext();
  const {referenceTxHash} = useReferenceContext();

  useEffect(() => {
    const fetchData = async () => {
      if (connected) {
        const allAddresses = await wallet.getUsedAddresses();
        setWalletAddress(allAddresses[0]);
      } else {
        setWalletAddress("");
      }
    };
    fetchData();
  }, [connected]);

  const dataEntries = [
    { name: "Wallet", value: walletAddress },
    { name: "Oracle Address", value: oracleAddress },
    { name: "Oracle UTxO with NFT", value: oracleUTxO },
    { name: "Oracle's Datum (price of ADA in cents)", value: oracleDatum },
    { name: "Tx that deployed the reference script", value: referenceTxHash },
  ];

  return (
    <div className="bg-[#1f1f1f] shadow-md border border-white rounded-lg p-10 w-full mx-auto max-w-4xl">
      <table className="table-auto w-full">
        <tbody>
          {dataEntries.map((entry, index) => (
            <tr key={index} className="border-b">
              <td className="p-4 text-lg font-bold text-white w-1/3">
                {entry.name}
                <input
                  type="text"
                  className="border border-black p-2 rounded text-black w-full mt-2"
                  value={entry.value}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;
