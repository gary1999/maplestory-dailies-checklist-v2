import React, { useState } from "react";
import "../css/NXItemList.css"; // We'll create this CSS file

const NXItemList = () => {
	const [items] = useState([
		{ id: 1, name: "Premium Surprise Style Boxes (11)", priceNX: 34000 },
		{ id: 2, name: "Red Cards (6)", priceNX: 7200 },
		{ id: 3, name: "Glowing Cubes (11)", priceNX: 12000 },
		{ id: 4, name: "Bright Cubes (11)", priceNX: 22000 },
		{ id: 5, name: "Glowing Bonus Cubes (11)", priceNX: 24000 },
	]);

	const [nxRate, setNxRate] = useState(1000); // Default: 100m Mesos = 1000 NX
	const [mesosAmount] = useState(100000000); // 100m Mesos

	// Calculate how much Mesos each NX item would cost
	const convertToMesos = (nxAmount) => {
		return Math.floor((nxAmount / nxRate) * mesosAmount).toLocaleString();
	};

	return (
		<div className="nx-container">
			<h1 className="nx-title">NX Exchange Calculator</h1>

			<div className="nx-controls">
				<div className="nx-rate-input">
					<label className="rate-label">Exchange Rate:</label>
					<div className="rate-display">
						<span className="mesos-amount">
							{mesosAmount.toLocaleString()} Mesos
						</span>
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
					<div className="header-item">Item</div>
					<div className="header-price">NX Price</div>
					<div className="header-price">Mesos Value</div>
				</div>

				{items.map((item) => (
					<div key={item.id} className="nx-item">
						<div className="item-name">{item.name}</div>
						<div className="item-price-nx">
							<span className="price-tag nx-tag">
								{item.priceNX.toLocaleString()} NX
							</span>
						</div>
						<div className="item-price-mesos">
							<span className="price-tag mesos-tag">
								{convertToMesos(item.priceNX)} Mesos
							</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default NXItemList;
