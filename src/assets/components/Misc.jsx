import React from "react";
import NXItemList from "./NXItemList";
import "../css/Misc.css";

const Misc = () => {
	// Your existing misc component state and logic

	return (
		<div className="misc-page">
			{/* Your existing misc content */}

			<section className="misc-section">
				<h2>NX Currency Exchange</h2>
				<NXItemList />
			</section>

			{/* More existing content */}
		</div>
	);
};

export default Misc;
