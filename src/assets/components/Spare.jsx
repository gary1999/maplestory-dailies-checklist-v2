import React, { useState, useEffect } from "react";
import { characters as initialCharacters, categories } from "../data/data";
import Clock from "./Clock";
import checkNextReset from "./CheckNextReset";
import "../css/Checkbox.css";
import CurrencyCalculator from "./CurrencyCalculator";

const CheckboxTable = () => {
	const [characters, setCharacters] = useState(() => {
		const savedCharacters =
			JSON.parse(localStorage.getItem("characters")) || initialCharacters;
		return savedCharacters;
	});

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

	// Save characters to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("characters", JSON.stringify(characters));
	}, [characters]);

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
		}
	};

	const weeklyResetCheck = () => {
		if (checkNextReset.hasTodayReachedSavedThursday()) {
			resetWeeklies();
			checkNextReset.updateSavedThursdayIfNeeded();
		}
	};

	// Handle right-click to show context menu
	const handleRightClick = (e, character, task) => {
		e.preventDefault();
		const { clientX: x, clientY: y } = e;
		const menuWidth = 150; // Approximate width of the context menu
		const menuHeight = 80; // Approximate height of the context menu

		// Adjust position if near the edge of the screen
		const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
		const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

		setContextMenu({
			x: adjustedX,
			y: adjustedY,
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

	const resetCheckboxes = (type) => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = { ...prev };

			characters.forEach((char) => {
				if (updatedCheckboxes[char]) {
					Object.values(categories)
						.flat()
						.forEach(({ name, type: taskType }) => {
							if (taskType === type) {
								updatedCheckboxes[char][name] = false;
							}
						});
				}
			});
			return updatedCheckboxes;
		});
	};

	const confirmReset = (type) => {
		if (window.confirm(`Are you sure you want to reset all ${type} tasks?`)) {
			if (type === "daily") {
				resetDailies();
			} else if (type === "weekly") {
				resetWeeklies();
			}
		}
	};
	// Replace resetDailies and resetWeeklies with:
	const resetDailies = () => resetCheckboxes("daily");
	const resetWeeklies = () => resetCheckboxes("weekly");

	useEffect(() => {
		checkNextReset.loadUTCTime();

		// Immediate check for resets when the page loads
		if (checkNextReset.hasTodayReachedSavedDate()) {
			resetDailies();
			checkNextReset.updateSavedDateIfNeeded();
		}
		if (checkNextReset.hasTodayReachedSavedThursday()) {
			resetWeeklies();
			checkNextReset.updateSavedThursdayIfNeeded();
		}

		// Set up interval for periodic checks
		const interval = setInterval(() => {
			if (checkNextReset.hasTodayReachedSavedDate()) {
				resetDailies();
				checkNextReset.updateSavedDateIfNeeded();
			}
			if (checkNextReset.hasTodayReachedSavedThursday()) {
				resetWeeklies();
				checkNextReset.updateSavedThursdayIfNeeded();
			}
		}, 1000 * 10); // Check every 10 seconds

		return () => clearInterval(interval);
	}, []);

	const handleManualDateBack = () => {
		checkNextReset.setDateBack(); // Set the date back
		dailyResetCheck(); // Trigger daily reset check
		weeklyResetCheck(); // Trigger weekly reset check
	};

	// Rename a character
	const renameCharacter = (index, newName) => {
		setCharacters((prevCharacters) => {
			const updatedCharacters = [...prevCharacters];
			const oldName = updatedCharacters[index];
			updatedCharacters[index] = newName;

			// Update the checkboxes state to reflect the new name
			setCheckboxes((prevCheckboxes) => {
				const updatedCheckboxes = { ...prevCheckboxes };
				if (updatedCheckboxes[oldName]) {
					updatedCheckboxes[newName] = updatedCheckboxes[oldName];
					delete updatedCheckboxes[oldName];
				}
				return updatedCheckboxes;
			});

			// Update the hiddenCheckboxes state to reflect the new name
			setHiddenCheckboxes((prevHidden) => {
				const updatedHidden = { ...prevHidden };
				if (updatedHidden[oldName]) {
					updatedHidden[newName] = updatedHidden[oldName];
					delete updatedHidden[oldName];
				}
				return updatedHidden;
			});

			return updatedCharacters;
		});
	};

	return (
		<>
			<div className="table-container" onClick={handleCloseMenu}>
				<table border="1">
					<thead>
						<tr>
							<th></th>
							{characters.map((char, index) => (
								<th key={index}>
									<input
										type="text"
										value={char}
										onChange={(e) => renameCharacter(index, e.target.value)}
										className="character-name-input"
									/>
								</th>
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
			<button onClick={handleManualDateBack}>
				Set Date Back and Trigger Resets
			</button>
			<button onClick={() => confirmReset("daily")}>
				Manual Reset Dailies
			</button>
			<button onClick={() => confirmReset("weekly")}>
				Manual Reset Weeklies
			</button>
			{/* <CurrencyCalculator /> */}
		</>
	);
};

export default CheckboxTable;
