import React, { useState } from "react";

const MesosProfitCalculator = () => {
	const [x, setX] = useState("");
	const [y, setY] = useState("");
	const [result, setResult] = useState(null);

	const calculateBestAction = () => {
		if (!x || !y || x <= 0 || y <= 0) {
			alert("Please enter valid numbers for X and Y.");
			return;
		}

		const buyCost = parseFloat(x); // Cost in points to buy 100M mesos
		const sellPrice = parseFloat(y); // Points received when selling 100M mesos

		const buyThenSellRatio = sellPrice / buyCost; // How many points you get per point spent
		const sellThenBuyRatio = buyCost / sellPrice; // How many mesos you get per mesos sold

		let decision = "";

		if (buyThenSellRatio > 1) {
			decision = `💰 Buy 100M mesos for ${buyCost} points, then sell for ${sellPrice} points.  
      You'll profit **${(buyThenSellRatio * 100 - 100).toFixed(
				2
			)}%** per transaction!`;
		} else if (sellThenBuyRatio > 1) {
			decision = `💰 Sell 100M mesos for ${sellPrice} points, then buy it back for ${buyCost} points.  
      You'll profit **${(sellThenBuyRatio * 100 - 100).toFixed(
				2
			)}%** per transaction!`;
		} else {
			decision = "⚠️ No profitable transaction available.";
		}

		setResult(decision);
	};

	return (
		<div style={{ textAlign: "center", padding: "20px" }}>
			<h2>Mesos Trading Profit Calculator</h2>
			<div>
				<label>Cost to Buy 100M Mesos (X points): </label>
				<input type="number" value={x} onChange={(e) => setX(e.target.value)} />
			</div>
			<div>
				<label>Amount Received for Selling 100M Mesos (Y points): </label>
				<input type="number" value={y} onChange={(e) => setY(e.target.value)} />
			</div>
			<button onClick={calculateBestAction} style={{ marginTop: "10px" }}>
				Calculate
			</button>
			{result && <h3>{result}</h3>}
		</div>
	);
};

export default MesosProfitCalculator;
