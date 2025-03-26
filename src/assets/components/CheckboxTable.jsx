import React, { useState, useEffect } from "react";
import { categories } from "../data/data";
import checkNextReset from "../components/checkNextReset";
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

		// Check for weekly resets (both Wednesday and Thursday)
		if (checkNextReset.hasTodayReachedSavedWednesday()) {
			resetWeeklies("wednesday");
			checkNextReset.updateSavedWednesdayIfNeeded();
		}

		if (checkNextReset.hasTodayReachedSavedThursday()) {
			resetWeeklies("thursday");
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
	const handleCheckboxChange = (
		columnIndex,
		task,
		index,
		toggleAll = false
	) => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = { ...prev };

			if (
				task === "ALL" &&
				categories["Weekly Bosses"].some((boss) => boss.name === "ALL")
			) {
				const allWeeklyBosses = categories["Weekly Bosses"]
					.filter((boss) => boss.name !== "ALL") // Exclude "ALL"
					.map((boss) => boss.name);

				// Toggle all weekly bosses based on "ALL" checkbox state
				const newState = !prev[columnIndex]?.[task]?.[index];

				allWeeklyBosses.forEach((bossName) => {
					updatedCheckboxes[columnIndex] = {
						...updatedCheckboxes[columnIndex],
						[bossName]: Array(
							categories["Weekly Bosses"].find((b) => b.name === bossName)
								?.count || 1
						).fill(newState),
					};
				});

				// Also update the ALL checkbox itself
				updatedCheckboxes[columnIndex] = {
					...updatedCheckboxes[columnIndex],
					[task]: {
						...(prev[columnIndex]?.[task] || {}),
						[index]: newState,
					},
				};
			} else if (toggleAll) {
				// Toggling the entire cell should toggle all checkboxes inside it
				const newState = !prev[columnIndex]?.[task]?.[0]; // Use first checkbox state as reference
				updatedCheckboxes[columnIndex] = {
					...updatedCheckboxes[columnIndex],
					[task]: Array(
						categories["Weekly Bosses"].find((b) => b.name === task)?.count || 1
					).fill(newState),
				};
			} else {
				// Normal checkbox toggle behavior
				updatedCheckboxes[columnIndex] = {
					...updatedCheckboxes[columnIndex],
					[task]: {
						...(prev[columnIndex]?.[task] || {}),
						[index]: !prev[columnIndex]?.[task]?.[index],
					},
				};
			}

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
					// Check if the task exists in Dailies OR Events with type 'daily'
					if (
						categories.Dailies.some((daily) => daily.name === task) ||
						categories.Events.some(
							(event) => event.name === task && event.type === "daily"
						)
					) {
						// Find the task and reset its count properly
						const taskData = categories.Dailies.concat(categories.Events).find(
							(t) => t.name === task && t.type === "daily"
						);

						updatedCheckboxes[columnIndex][task] = Array(
							taskData?.count || 1
						).fill(false);
					}
				});
			});
			return updatedCheckboxes;
		});
	};

	// Reset weekly checkboxes
	const resetWeeklies = (resetDay) => {
		setCheckboxes((prev) => {
			const updatedCheckboxes = { ...prev };
			Object.keys(updatedCheckboxes).forEach((columnIndex) => {
				Object.keys(updatedCheckboxes[columnIndex]).forEach((task) => {
					// Find the task in any weekly category
					const taskData = [
						...categories.Weeklies,
						...categories["Weekly Bosses"],
						...categories.Events.filter((e) => e.type === "weekly"),
					].find((t) => t.name === task);

					// Only reset tasks that match the current reset day
					if (taskData && taskData.resetDay === resetDay) {
						updatedCheckboxes[columnIndex][task] = Array(taskData.count).fill(
							false
						);
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
	const handleManualResetWeeklies = (resetDay) => {
		if (
			window.confirm(
				`Are you sure you want to reset all ${resetDay} weekly tasks? This cannot be undone.`
			)
		) {
			resetWeeklies(resetDay);
			if (resetDay === "thursday") {
				checkNextReset.updateSavedThursdayIfNeeded();
			} else if (resetDay === "wednesday") {
				checkNextReset.updateSavedWednesdayIfNeeded();
			}
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
									<div className="column-header">
										<input
											type="text"
											value={columnLabels[columnIndex]}
											onChange={(e) =>
												handleLabelChange(columnIndex, e.target.value)
											}
											className="character-name-input"
										/>
										{/* <button
											onClick={() => checkAllWeeklyBosses(columnIndex)}
											className="check-all-bosses-button"
											title="Check all weekly bosses"
										>
											✓ Bosses
										</button> */}
									</div>
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
													onClick={() => {
														if (hiddenCheckboxes[columnIndex]?.[name]) {
															// If hidden, restore visibility instead of toggling checkboxes
															setHiddenCheckboxes((prev) => ({
																...prev,
																[columnIndex]: {
																	...prev[columnIndex],
																	[name]: false,
																},
															}));
														} else {
															// If visible, toggle all checkboxes
															handleCheckboxChange(columnIndex, name, 0, true);
														}
													}}
													onContextMenu={(e) =>
														handleRightClick(e, columnIndex, name)
													} // Keep right-click to hide
													style={{ cursor: "pointer" }} // Visual cue that it's clickable
												>
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
																		onClick={(e) => e.stopPropagation()} // Prevent cell click from triggering
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
				<button
					onClick={() => handleManualResetWeeklies("wednesday")}
					className="reset-button"
				>
					Reset Wednesday Weeklies
				</button>
				<button
					onClick={() => handleManualResetWeeklies("thursday")}
					className="reset-button"
				>
					Reset Thursday Weeklies
				</button>
				<button onClick={handleManualResetDailies} className="reset-button">
					Reset Dailies
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
