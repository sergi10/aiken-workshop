import React from "react";

interface LockModalProps {
    adaQuantity: number;
    setAdaQuantity: (quantity: number) => void;
    unlockMinutes: number;
    setUnlockMinutes: (minutes: number) => void;
    setBeneficiaryAddress: (address:string) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

const LockModal: React.FC<LockModalProps> = ({
    adaQuantity,
    setAdaQuantity,
    unlockMinutes,
    setUnlockMinutes,
    setBeneficiaryAddress,
    onConfirm,
    onCancel
}) => {
  return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
			<div className="bg-white p-6 rounded-lg shadow-lg" style={{ marginTop: '-20%' }}>
				<h2 className="text-lg font-semibold mb-4 text-black">
					Enter ADA quantity and unlock time (in minutes):
				</h2>
				<input
					type="number"
					placeholder="Quantity of ADA"
					value={adaQuantity}
					onChange={(e) => setAdaQuantity(Number(e.target.value))}
					className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
				/>
				<input
					type="number"
					placeholder="Unlock time in minutes"
					value={unlockMinutes}
					onChange={(e) => setUnlockMinutes(Number(e.target.value))}
					className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
				/>
				<input
					type="text"
					placeholder="Dirección"
					onChange={(e) => setBeneficiaryAddress(e.target.value)}
					className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
				/>
				<div className="flex justify-end space-x-2">
					<button
						className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600"
						onClick={onConfirm}
					>
						Confirm
					</button>
					<button
						className="bg-gray-500 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600"
						onClick={onCancel}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default LockModal;
