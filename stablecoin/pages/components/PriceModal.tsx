import React from "react";

interface PriceModalProps {
  adaPrice: any;
  setAdaPrice: any;
  onConfirm: any;
  onCancel: any;
}

const PriceModal: React.FC<PriceModalProps> = ({ adaPrice, setAdaPrice, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-[#c80e22]">
        <h2 className="text-lg font-semibold mb-4 text-black">Enter ADA price (in Euro cents):</h2>
        <input
          type="number"
          placeholder="Price in cents"
          value={adaPrice}
          onChange={(e) => setAdaPrice(Number(e.target.value))}
          className="border border-black-300 p-2 rounded w-full mb-4 text-black"
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-[#c80e22] text-white font-semibold py-2 px-4 rounded hover:bg-black"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-500 text-black font-semibold py-2 px-4 rounded hover:bg-gray-600"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceModal;
