import React, { useState, useEffect } from "react";
import { categories } from "../data/data";
import checkNextReset from "./checkNextReset";
import "../css/Checkbox.css";

const CheckboxTable = () => {
	// State for number of columns (default: 5)
	const [numberOfColumns, setNumberOfColumns] = useState(() => {
		const savedColumns = localStorage.getItem("numberOfColumns");
		return savedColumns ? parseInt(savedColumns, 10) : 5;
	});

	// State for column labels (default: ["Column 1", "Column 2", ...])
	const [columnLabels, setColumnLabels] = useState(() => {
		const savedLabels = localStorage.getItem("columnLabels");
		return savedLabels
			? JSON.parse(savedLabels)
			: Array.from({ length: numberOfColumns }, (_, i) => `Column ${i + 1}`);
	});

	// State for checkboxes (load from localStorage if available)
	const [checkboxes, setCheckboxes] = useState(() => {
		const savedCheckboxes = localStorage.getItem("checkboxes");
		return savedCheckboxes ? JSON.parse(savedCheckboxes) : {};
	});

	// State for hidden checkboxes (load from localStorage if available)
	const [hiddenCheckboxes, setHiddenCheckboxes] = useState(() => {
		const savedHiddenCheckboxes = localStorage.getItem("hiddenCheckboxes");
		return savedHiddenCheckboxes ? JSON.parse(savedHiddenCheckboxes) : {};
	});

	const [contextMenu, setContextMenu] = useState(null);
	const [collapsedCategories, setCollapsedCategories] = useState({});

	// Generate an array of column indices (e.g., [0, 1, 2, 3, 4] for 5 columns)
	const columns = Array.from({ length: numberOfColumns }, (_, i) => i);

	// Load UTC time and check for resets when the component mounts
	useEffect(() => {
		checkNextReset.loadUTCTime();

		// Check for daily reset
		if (checkNextReset.hasTodayReachedSavedDate()) {
			resetDailies();
			checkNextReset.updateSavedDateIfNeeded();
		}

		// Check for weekly reset
		if (checkNextReset.hasTodayReachedSavedThursday()) {
			resetWeeklies();
			checkNextReset.updateSavedThursdayIfNeeded();
		}
	}, []);

	// Save number of columns to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem("numberOfColumns", numberOfColumns.toString());
	}, [numberOfColumns]);

	// Save column labels to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("columnLabels", JSON.stringify(columnLabels));
	}, [columnLabels]);

	// Save checkboxes to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("checkboxes", JSON.stringify(checkboxes));
	}, [checkboxes]);

	// Save hidden checkboxes to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("hiddenCheckboxes", JSON.stringify(hiddenCheckboxes));
	}, [hiddenCheckboxes]);

	// Handle column selection
	const handleColumnSelect = (number) => {
		setNumberOfColumns(number);
		// Update column labels to match the new number of columns
		setColumnLabels((prevLabels) => {
			const newLabels = [...prevLabels];
			while (newLabels.length < number) {
				newLabels.push(`Column ${newLabels.length + 1}`);
			}
			return newLabels.slice(0, number);
		});
	};

	// Handle column label changes
	const handleLabelChange = (columnIndex, newLabel) => {
		setColumnLabels((prevLabels) => {
			const updatedLabels = [...prevLabels];
			updatedLabels[columnIndex] = newLabel;
			return updatedLabels;
		});
	};

	// Toggle collapse state
	const toggleCollapse = (category) => {
		setCollapsedCategories((prev) => ({
			...prev,
			[category]: !prev[category],
		}));
	};

	// Handle checkbox changes
	const handleCheckboxChange = (columnIndex, task) => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = {
				...prev,
				[columnIndex]: {
					...prev[columnIndex],
					[task]: !prev[columnIndex]?.[task],
				},
			};
			return updatedCheckboxes;
		});
	};

	// Handle right-click to show context menu
	const handleRightClick = (e, columnIndex, task) => {
		e.preventDefault();
		setContextMenu({
			x: e.clientX,
			y: e.clientY,
			columnIndex,
			task,
			isHidden: hiddenCheckboxes[columnIndex]?.[task] || false,
		});
	};

	// Handle context menu actions
	const handleMenuClick = (shouldHide) => {
		const { columnIndex, task } = contextMenu;
		setHiddenCheckboxes((prev) => ({
			...prev,
			[columnIndex]: { ...prev[columnIndex], [task]: shouldHide },
		}));
		setContextMenu(null);
	};

	// Close context menu on click outside
	const handleCloseMenu = (e) => {
		if (contextMenu) {
			setContextMenu(null);
		}
	};

	// Reset daily checkboxes
	const resetDailies = () => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = { ...prev };
			Object.keys(updatedCheckboxes).forEach((columnIndex) => {
				Object.keys(updatedCheckboxes[columnIndex]).forEach((task) => {
					if (categories.Dailies.some((daily) => daily.name === task)) {
						updatedCheckboxes[columnIndex][task] = false;
					}
				});
			});
			return updatedCheckboxes;
		});
	};

	// Reset weekly checkboxes
	const resetWeeklies = () => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = { ...prev };
			Object.keys(updatedCheckboxes).forEach((columnIndex) => {
				Object.keys(updatedCheckboxes[columnIndex]).forEach((task) => {
					if (
						categories.Weeklies.some((weekly) => weekly.name === task) ||
						categories["Weekly Bosses"].some((boss) => boss.name === task)
					) {
						updatedCheckboxes[columnIndex][task] = false;
					}
				});
			});
			return updatedCheckboxes;
		});
	};

	// Handle manual reset for dailies with confirmation
	const handleManualResetDailies = () => {
		if (
			window.confirm(
				"Are you sure you want to reset all daily tasks? This cannot be undone."
			)
		) {
			resetDailies();
			checkNextReset.updateSavedDateIfNeeded();
		}
	};

	// Handle manual reset for weeklies with confirmation
	const handleManualResetWeeklies = () => {
		if (
			window.confirm(
				"Are you sure you want to reset all weekly tasks? This cannot be undone."
			)
		) {
			resetWeeklies();
			checkNextReset.updateSavedThursdayIfNeeded();
		}
	};

	// Clear all localStorage data and reset state
	const clearLocalStorage = () => {
		if (
			window.confirm(
				"Are you sure you want to clear all saved data? This cannot be undone."
			)
		) {
			localStorage.removeItem("numberOfColumns");
			localStorage.removeItem("columnLabels");
			localStorage.removeItem("checkboxes");
			localStorage.removeItem("hiddenCheckboxes");

			// Reset state to defaults
			setNumberOfColumns(5);
			setColumnLabels(Array.from({ length: 5 }, (_, i) => `Column ${i + 1}`));
			setCheckboxes({});
			setHiddenCheckboxes({});
			setCollapsedCategories({});
		}
	};

	return (
		<div className="clock-container">
			{/* Column Selector */}
			<div className="column-selector">
				<p>Select number of columns:</p>
				{[1, 2, 3, 4, 5, 6].map((number) => (
					<button
						key={number}
						onClick={() => handleColumnSelect(number)}
						className={numberOfColumns === number ? "active" : ""}
					>
						{number}
					</button>
				))}
			</div>

			{/* Table */}
			<div className="table-container" onClick={handleCloseMenu}>
				<table>
					<thead>
						<tr>
							<th></th>
							{columns.map((columnIndex) => (
								<th key={columnIndex}>
									<input
										type="text"
										value={columnLabels[columnIndex]}
										onChange={(e) =>
											handleLabelChange(columnIndex, e.target.value)
										}
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
									<th colSpan={columns.length + 1}>
										{section} {collapsedCategories[section] ? "▲" : "▼"}
									</th>
								</tr>
								{/* Render tasks only if category is not collapsed */}
								{!collapsedCategories[section] &&
									tasks.map(({ name }) => (
										<tr key={name}>
											<td>{name}</td>
											{columns.map((columnIndex) => (
												<td
													key={columnIndex}
													onContextMenu={(e) =>
														handleRightClick(e, columnIndex, name)
													}
												>
													{!hiddenCheckboxes[columnIndex]?.[name] && (
														<label className="checkbox-container">
															<input
																type="checkbox"
																className={
																	hiddenCheckboxes[columnIndex]?.[name]
																		? "hidden-checkbox"
																		: ""
																}
																checked={
																	checkboxes[columnIndex]?.[name] || false
																}
																onChange={() =>
																	handleCheckboxChange(columnIndex, name)
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

			{/* Manual Reset Buttons */}
			<div className="reset-buttons">
				<button onClick={handleManualResetDailies} className="reset-button">
					Reset Dailies
				</button>
				<button onClick={handleManualResetWeeklies} className="reset-button">
					Reset Weeklies
				</button>
			</div>

			{/* Clear LocalStorage Button */}
			<button onClick={clearLocalStorage} className="clear-button">
				Clear All Saved Data
			</button>
		</div>
	);
};

export default CheckboxTable;
