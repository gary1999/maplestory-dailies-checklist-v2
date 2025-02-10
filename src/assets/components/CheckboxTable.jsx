import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import checkNextReset from "./CheckNextReset";

import "../css/Checkbox.css";

const CheckboxTable = () => {
	const characters = ["Aran", "Luminous", "Adele", "Shade", "Blaster"];
	const categories = {
		Dailies: [
			{ name: "Arcane River", type: "daily" },
			{ name: "Grandis", type: "daily" },
			{ name: "Monster Park", type: "daily" },
			{ name: "Bosses", type: "daily" },
		],
		Weeklies: [{ name: "Legion", type: "weekly" }],
		"Weekly Bosses": [
			{ name: "Standard", type: "weekly" },
			{ name: "Lotus", type: "weekly" },
			{ name: "Damien", type: "weekly" },
			{ name: "Slime", type: "weekly" },
			{ name: "Lucid", type: "weekly" },
			{ name: "Will", type: "weekly" },
			{ name: "Gloom", type: "weekly" },
			{ name: "Verus Hilla", type: "weekly" },
			{ name: "Darknell", type: "weekly" },
		],
		Events: [
			{ name: "Ride or Die", type: "weekly" },
			{ name: "Burning 6k", type: "weekly" },
			{ name: "Tirnog 6k", type: "weekly" },
		],
	};

	const [checkboxes, setCheckboxes] = useState({});
	const [hiddenCheckboxes, setHiddenCheckboxes] = useState({});
	const [contextMenu, setContextMenu] = useState(null);

	// Load saved data from localStorage
	useEffect(() => {
		const storedData = JSON.parse(localStorage.getItem("checkboxData")) || {};
		const storedHidden =
			JSON.parse(localStorage.getItem("hiddenCheckboxes")) || {};
		setCheckboxes(storedData);
		setHiddenCheckboxes(storedHidden);
	}, []);

	// Save to localStorage whenever checkboxes change
	useEffect(() => {
		if (Object.keys(checkboxes).length > 0) {
			localStorage.setItem("checkboxData", JSON.stringify(checkboxes));
		}
	}, [checkboxes]);

	useEffect(() => {
		if (Object.keys(hiddenCheckboxes).length > 0) {
			localStorage.setItem(
				"hiddenCheckboxes",
				JSON.stringify(hiddenCheckboxes)
			);
		}
	}, [hiddenCheckboxes]);

	const handleCheckboxChange = (character, task) => {
		setCheckboxes((prev) => ({
			...prev,
			[character]: {
				...prev[character],
				[task]: !prev[character]?.[task],
			},
		}));
	};

	const dailyResetCheck = () => {
		if (checkNextReset.hasTodayReachedSavedDate()) {
			resetDailies();
			checkNextReset.updateSavedDateIfNeeded();
			console.log("It is daily reset");
		} //else console.log("not yet daily reset");
	};

	const weeklyResetCheck = () => {
		if (checkNextReset.hasTodayReachedSavedThursday()) {
			resetWeeklies();
			checkNextReset.updateSavedThursdayIfNeeded();
			//console.log("It is weekly reset");
		} //else console.log("not yet weekly reset");
	};

	// Handle right-click to show context menu
	const handleRightClick = (e, character, task) => {
		e.preventDefault();
		setContextMenu({
			x: e.clientX,
			y: e.clientY,
			character,
			task,
			isHidden: hiddenCheckboxes[character]?.[task] || false,
		});
	};

	const handleMenuClick = (shouldHide) => {
		const { character, task } = contextMenu;
		setHiddenCheckboxes((prev) => ({
			...prev,
			[character]: { ...prev[character], [task]: shouldHide },
		}));
		setContextMenu(null);
	};

	// Close context menu on click outside
	const handleCloseMenu = (e) => {
		if (contextMenu) {
			setContextMenu(null);
		}
	};

	// Reset all checkboxes where type is "daily"
	const resetDailies = () => {
		setCheckboxes((prev) => {
			console.log("🔄 Resetting dailies... Previous state:", prev);

			const updatedCheckboxes = { ...prev };

			characters.forEach((char) => {
				if (updatedCheckboxes[char]) {
					Object.values(categories)
						.flat()
						.forEach(({ name, type }) => {
							if (type === "daily") {
								updatedCheckboxes[char][name] = false;
							}
						});
				}
			});

			console.log("✅ New state after reset:", updatedCheckboxes);
			return updatedCheckboxes;
		});
	};

	const resetWeeklies = () => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = { ...prev };

			characters.forEach((char) => {
				if (updatedCheckboxes[char]) {
					Object.values(categories)
						.flat()
						.forEach(({ name, type }) => {
							if (type === "weekly") {
								updatedCheckboxes[char][name] = false;
							}
						});
				}
			});

			return updatedCheckboxes;
		});
	};

	const runMinutely = () => {
		dailyResetCheck();
		weeklyResetCheck();
	};

	useEffect(() => {
		checkNextReset.loadUTCTime();
		const interval = setInterval(runMinutely, 1000);
		runMinutely();
		return () => clearInterval(interval);
	}, []);

	return (
		<>
			{/* <button onClick={checkNextReset.setYesterdayDate}>
				Set Reset Time to Yesterday
			</button> */}
			{/* <button onClick={dailyResetCheck}>Click to reset</button> */}
			<div className="clock-container">
				<Clock />
			</div>
			<div className="table-container" onClick={handleCloseMenu}>
				<table border="1">
					<thead>
						<tr>
							<th></th>
							{characters.map((char) => (
								<th key={char}>{char}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{Object.entries(categories).map(([section, tasks]) => (
							<React.Fragment key={section}>
								<tr>
									<th colSpan={characters.length + 1}>{section}</th>
								</tr>
								{tasks.map(({ name }) => (
									<tr key={name}>
										<td>{name}</td>
										{characters.map((char) => (
											<td
												key={char}
												onContextMenu={(e) => handleRightClick(e, char, name)}
											>
												{!hiddenCheckboxes[char]?.[name] && (
													<input
														type="checkbox"
														className={
															hiddenCheckboxes[char]?.[name]
																? "hidden-checkbox"
																: ""
														}
														checked={checkboxes[char]?.[name] || false}
														onChange={() => handleCheckboxChange(char, name)}
													/>
												)}
											</td>
										))}
									</tr>
								))}
							</React.Fragment>
						))}
					</tbody>
				</table>
				{contextMenu && (
					<div
						className="context-menu"
						style={{
							top: contextMenu.y + "px",
							left: contextMenu.x + "px",
						}}
					>
						<div className="menu-item" onClick={() => handleMenuClick(false)}>
							Show {contextMenu.isHidden ? "" : "✔"}
						</div>
						<div className="menu-item" onClick={() => handleMenuClick(true)}>
							Hide {contextMenu.isHidden ? "✔" : ""}
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default CheckboxTable;
