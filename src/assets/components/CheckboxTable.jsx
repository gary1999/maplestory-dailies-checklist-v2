import React, { useState, useEffect } from "react";
import Clock from "./Clock";
import checkNextReset from "./CheckNextReset";
import { characters, categories } from "../data/data";

import "../css/Checkbox.css";
import CurrencyCalculator from "./CurrencyCalculator";

const CheckboxTable = () => {
	const [checkboxes, setCheckboxes] = useState({});
	const [hiddenCheckboxes, setHiddenCheckboxes] = useState({});
	const [contextMenu, setContextMenu] = useState(null);

	const [collapsedCategories, setCollapsedCategories] = useState({});

	// Toggle collapse state
	const toggleCollapse = (category) => {
		setCollapsedCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

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
			console.log("Reset condition met. Calling resetDailies()...");
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
		}
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

	useEffect(() => {
		checkNextReset.loadUTCTime();
		setTimeout(() => {
			dailyResetCheck();
			weeklyResetCheck();
			const interval = setInterval(() => {
				dailyResetCheck();
				weeklyResetCheck();
			}, 1000 * 5);
			return () => clearInterval(interval);
		}, 100); // Small delay to allow reset logic to complete
	}, []);

	return (
		<>
			{/* <button onClick={checkNextReset.setYesterdayDate}>
				Set Reset Time to Yesterday
			</button> */}
			{/* <button onClick={dailyResetCheck}>Click to reset</button> */}
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
								{/* Clickable Header for Collapsing */}
								<tr
									className="category-header"
									onClick={() => toggleCollapse(section)}
								>
									<th colSpan={characters.length + 1}>
										{section} {collapsedCategories[section] ? "▲" : "▼"}
									</th>
								</tr>
								{/* Render tasks only if category is not collapsed */}
								{!collapsedCategories[section] &&
									tasks.map(({ name }) => (
										<tr key={name}>
											<td>{name}</td>
											{characters.map((char) => (
												<td
													key={char}
													onContextMenu={(e) => handleRightClick(e, char, name)}
												>
													{!hiddenCheckboxes[char]?.[name] && (
														<label className="checkbox-container">
															<input
																type="checkbox"
																className={
																	hiddenCheckboxes[char]?.[name]
																		? "hidden-checkbox"
																		: ""
																}
																checked={checkboxes[char]?.[name] || false}
																onChange={() =>
																	handleCheckboxChange(char, name)
																}
															/>
														</label>
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
			{/* <CurrencyCalculator /> */}
		</>
	);
};

export default CheckboxTable;
