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

	// State for column labels (default: ["Character 1", "Character 2", ...])
	const [columnLabels, setColumnLabels] = useState(() => {
		const savedLabels = localStorage.getItem("columnLabels");
		return savedLabels
			? JSON.parse(savedLabels)
			: Array.from({ length: numberOfColumns }, (_, i) => `Character ${i + 1}`);
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

	// State for collapsed categories
	const [collapsedCategories, setCollapsedCategories] = useState(() => {
		const savedCollapsedCategories = localStorage.getItem(
			"collapsedCategories"
		);
		return savedCollapsedCategories
			? JSON.parse(savedCollapsedCategories)
			: Object.fromEntries(
					Object.keys(categories).map((category) => [category, false])
			  );
	});

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

	// Save collapsedCategories to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem(
			"collapsedCategories",
			JSON.stringify(collapsedCategories)
		);
	}, [collapsedCategories]);

	// Handle column selection
	const handleColumnSelect = (number) => {
		setNumberOfColumns(number);
		// Update column labels to match the new number of columns
		setColumnLabels((prevLabels) => {
			const newLabels = [...prevLabels];
			while (newLabels.length < number) {
				newLabels.push(`Character ${newLabels.length + 1}`);
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
	const handleCheckboxChange = (columnIndex, task, index) => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = {
				...prev,
				[columnIndex]: {
					...prev[columnIndex],
					[task]: {
						...(prev[columnIndex]?.[task] || {}),
						[index]: !prev[columnIndex]?.[task]?.[index],
					},
				},
			};
			return updatedCheckboxes;
		});
	};

	// Handle right-click (hide checkbox)
	const handleRightClick = (e, columnIndex, task) => {
		e.preventDefault();
		setHiddenCheckboxes((prev) => ({
			...prev,
			[columnIndex]: {
				...prev[columnIndex],
				[task]: true, // Hide the checkbox on right-click
			},
		}));
	};

	// Handle left-click (show checkbox)
	const handleLeftClick = (e, columnIndex, task) => {
		if (hiddenCheckboxes[columnIndex]?.[task]) {
			setHiddenCheckboxes((prev) => ({
				...prev,
				[columnIndex]: {
					...prev[columnIndex],
					[task]: false, // Show the checkbox on left-click if hidden
				},
			}));
		}
	};

	// Reset daily checkboxes
	const resetDailies = () => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = { ...prev };
			Object.keys(updatedCheckboxes).forEach((columnIndex) => {
				Object.keys(updatedCheckboxes[columnIndex]).forEach((task) => {
					if (categories.Dailies.some((daily) => daily.name === task)) {
						updatedCheckboxes[columnIndex][task] = Array(
							categories.Dailies.find((t) => t.name === task).count
						).fill(false);
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
						categories["Weekly Bosses"].some((boss) => boss.name === task) ||
						categories.Events.some((event) => event.name === task) // Include Events
					) {
						updatedCheckboxes[columnIndex][task] = Array(
							categories.Weeklies.concat(
								categories["Weekly Bosses"],
								categories.Events
							).find((t) => t.name === task).count
						).fill(false);
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
			localStorage.removeItem("collapsedCategories");

			// Reset state to defaults
			setNumberOfColumns(5);
			setColumnLabels(
				Array.from({ length: 5 }, (_, i) => `Character ${i + 1}`)
			);
			setCheckboxes({});
			setHiddenCheckboxes({});
			setCollapsedCategories(
				Object.fromEntries(
					Object.keys(categories).map((category) => [category, false])
				)
			);
		}
	};

	return (
		<div className="container">
			{/* Table */}
			<div className="table-container">
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
									tasks.map(({ name, count }) => (
										<tr key={name}>
											<td>{name}</td>
											{columns.map((columnIndex) => (
												<td
													key={columnIndex}
													onClick={(e) => handleLeftClick(e, columnIndex, name)} // Show checkbox on left-click
													onContextMenu={(e) =>
														handleRightClick(e, columnIndex, name)
													} // Hide checkbox on right-click
												>
													{/* Render the checkboxes only if not hidden */}
													{!hiddenCheckboxes[columnIndex]?.[name] ? (
														<div className="checkbox-group">
															{Array.from({ length: count }, (_, index) => (
																<label
																	key={index}
																	className="checkbox-container"
																>
																	<input
																		type="checkbox"
																		checked={
																			checkboxes[columnIndex]?.[name]?.[
																				index
																			] || false
																		}
																		onChange={() =>
																			handleCheckboxChange(
																				columnIndex,
																				name,
																				index
																			)
																		}
																	/>
																</label>
															))}
														</div>
													) : (
														<div className="checkbox-container hidden-checkboxes"></div>
													)}
												</td>
											))}
										</tr>
									))}
							</React.Fragment>
						))}
					</tbody>
				</table>
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

			<div className="column-selector">
				<p>Number of Characters:</p>
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
			{/* Clear LocalStorage Button */}
			<button onClick={clearLocalStorage} className="clear-button">
				Clear All Saved Data
			</button>
		</div>
	);
};

export default CheckboxTable;
