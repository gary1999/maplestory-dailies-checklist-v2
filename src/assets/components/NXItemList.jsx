import React, { useState } from "react";

const NXItemList = () => {
	const [items] = useState([
		{ id: 1, name: "Premium Surprise Style Boxes (11)", priceNX: 34000 },
		{ id: 2, name: "Red Cards (6)", priceNX: 7200 },
	]);

	const [nxRate, setNxRate] = useState(1000); // Default: 100m Mesos = 1000 NX
	const [mesosAmount, setMesosAmount] = useState(100000000); // 100m Mesos

	// Calculate how much Mesos each NX item would cost
	const convertToMesos = (nxAmount) => {
		return Math.floor((nxAmount / nxRate) * mesosAmount).toLocaleString();
	};

	return (
		<div className="nx-container">
			<div className="nx-controls">
				<div className="nx-rate-input">
					<label>Exchange Rate:</label>
					<div className="rate-display">
						<span className="mesos-amount">100,000,000 Mesos</span>
						<span className="equals"> = </span>
						<input
							type="number"
							value={nxRate}
							onChange={(e) => setNxRate(parseInt(e.target.value) || 0)}
							min="1"
							className="nx-input"
						/>
						<span className="nx-label">NX</span>
					</div>
				</div>
			</div>

			<div className="nx-items">
				<div className="nx-header">
					<div>Item</div>
					<div>Price (NX)</div>
					<div>Price (Mesos)</div>
				</div>

				{items.map((item) => (
					<div key={item.id} className="nx-item">
						<div className="item-name">{item.name}</div>
						<div className="item-price-nx">
							{item.priceNX.toLocaleString()} NX
						</div>
						<div className="item-price-mesos">
							{convertToMesos(item.priceNX)} Mesos
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default NXItemList;
