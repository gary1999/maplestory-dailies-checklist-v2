import React, { useState, useEffect } from "react";
import "../css/NotesPage.css";

// Utility functions for localStorage
const saveToLocalStorage = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error("Failed to save to localStorage:", error);
	}
};

const loadFromLocalStorage = (key, defaultValue) => {
	try {
		const savedValue = localStorage.getItem(key);
		return savedValue ? JSON.parse(savedValue) : defaultValue;
	} catch (error) {
		console.error("Failed to load from localStorage:", error);
		return defaultValue;
	}
};

const NotesPage = () => {
	// State for number of columns (default: 5)
	const [numberOfColumns, setNumberOfColumns] = useState(() => {
		return parseInt(loadFromLocalStorage("numberOfColumns", 5), 10);
	});

	// State for character names (default to ["Character 1", "Character 2", ...])
	const [characters, setCharacters] = useState(() => {
		const savedCharacters = loadFromLocalStorage("characters", []);
		return savedCharacters.length > 0
			? savedCharacters
			: Array.from({ length: numberOfColumns }, (_, i) => `Character ${i + 1}`);
	});

	// State for character notes and tasks
	const [notes, setNotes] = useState(() => {
		return loadFromLocalStorage("characterNotes", {});
	});

	// State for task inputs
	const [taskInputs, setTaskInputs] = useState({});

	// State for cursor positions in textareas
	const [cursorPositions, setCursorPositions] = useState({});

	// Save numberOfColumns to localStorage whenever it changes
	useEffect(() => {
		saveToLocalStorage("numberOfColumns", numberOfColumns);
	}, [numberOfColumns]);

	// Save characters to localStorage whenever they change
	useEffect(() => {
		saveToLocalStorage("characters", characters);
	}, [characters]);

	// Save notes to localStorage whenever they change
	useEffect(() => {
		saveToLocalStorage("characterNotes", notes);
	}, [notes]);

	// Handle column selection
	const handleColumnSelect = (number) => {
		setNumberOfColumns(number);
		// Update characters to match the new number of columns
		setCharacters((prevCharacters) => {
			const newCharacters = [...prevCharacters];
			while (newCharacters.length < number) {
				newCharacters.push(`Character ${newCharacters.length + 1}`);
			}
			return newCharacters.slice(0, number);
		});
	};

	// Handle note changes
	const handleNoteChange = (character, newNote, cursorPosition) => {
		setNotes((prevNotes) => ({
			...prevNotes,
			[character]: { ...prevNotes[character], note: newNote },
		}));
		setCursorPositions((prev) => ({ ...prev, [character]: cursorPosition }));
	};

	// Restore cursor position after re-render
	useEffect(() => {
		characters.forEach((character) => {
			const textarea = document.querySelector(
				`.character-section[data-character="${character}"] .notes-input`
			);
			if (textarea && cursorPositions[character] !== undefined) {
				textarea.setSelectionRange(
					cursorPositions[character],
					cursorPositions[character]
				);
			}
		});
	}, [notes, cursorPositions]);

	// Add a new task
	const addTask = (character, taskName) => {
		if (!taskName.trim()) {
			alert("Task name cannot be empty!");
			return;
		}
		setNotes((prevNotes) => {
			const updatedTasks = [
				...(prevNotes[character]?.tasks || []),
				{ name: taskName, checked: false },
			];
			return {
				...prevNotes,
				[character]: { ...prevNotes[character], tasks: updatedTasks },
			};
		});
		setTaskInputs((prev) => ({ ...prev, [character]: "" }));
	};

	// Handle key down in task input
	const handleTaskInputKeyDown = (character, e) => {
		if (e.key === "Enter") {
			e.preventDefault(); // Prevent form submission or new line
			addTask(character, taskInputs[character] || "");
		}
	};

	// Toggle task completion
	const toggleTask = (character, index) => {
		setNotes((prevNotes) => {
			const updatedTasks = [...(prevNotes[character]?.tasks || [])];
			updatedTasks[index] = {
				...updatedTasks[index],
				checked: !updatedTasks[index].checked,
			};
			return {
				...prevNotes,
				[character]: { ...prevNotes[character], tasks: updatedTasks },
			};
		});
	};

	// Delete a task
	const deleteTask = (character, index) => {
		setNotes((prevNotes) => {
			const updatedTasks = [...(prevNotes[character]?.tasks || [])];
			updatedTasks.splice(index, 1);
			return {
				...prevNotes,
				[character]: { ...prevNotes[character], tasks: updatedTasks },
			};
		});
	};

	// Rename a character
	const renameCharacter = (index, newName) => {
		if (!newName.trim()) {
			alert("Character name cannot be empty!");
			return;
		}
		if (characters.includes(newName)) {
			alert("Character name must be unique!");
			return;
		}
		setCharacters((prevCharacters) => {
			const updatedCharacters = [...prevCharacters];
			const oldName = updatedCharacters[index];
			updatedCharacters[index] = newName;

			// Update the notes state to reflect the new name
			setNotes((prevNotes) => {
				const updatedNotes = { ...prevNotes };
				if (updatedNotes[oldName]) {
					updatedNotes[newName] = updatedNotes[oldName];
					delete updatedNotes[oldName];
				}
				return updatedNotes;
			});

			return updatedCharacters;
		});
	};

	return (
		<div className="notes-page">
			<h2>Character Notes</h2>
			{/* Column Selector */}

			<div className="character-sections">
				{characters.map((character, index) => (
					<div
						key={index}
						className="character-section"
						data-character={character}
					>
						<div className="character-header">
							<input
								type="text"
								value={character}
								onChange={(e) => renameCharacter(index, e.target.value)}
								className="character-name-input"
								aria-label={`Edit name for ${character}`}
							/>
						</div>
						<textarea
							className="notes-input"
							value={notes[character]?.note || ""}
							onChange={(e) =>
								handleNoteChange(
									character,
									e.target.value,
									e.target.selectionStart
								)
							}
							onKeyUp={(e) =>
								handleCursorPosition(character, e.target.selectionStart)
							}
							placeholder="Enter notes here..."
							aria-label={`Notes for ${character}`}
						/>
						<div className="task-input">
							<input
								type="text"
								value={taskInputs[character] || ""}
								onChange={(e) =>
									setTaskInputs((prev) => ({
										...prev,
										[character]: e.target.value,
									}))
								}
								onKeyDown={(e) => handleTaskInputKeyDown(character, e)}
								placeholder="Add a task..."
								aria-label={`Add a task for ${character}`}
							/>
							<button
								onClick={() => addTask(character, taskInputs[character])}
								className="add-task-button"
							>
								Add Task
							</button>
						</div>
						<ul className="task-list">
							{(notes[character]?.tasks || []).map((task, taskIndex) => (
								<li key={taskIndex} className="task-item">
									<input
										type="checkbox"
										checked={task.checked || false}
										onChange={() => toggleTask(character, taskIndex)}
										aria-label={`Toggle task: ${task.name}`}
									/>
									<span className={task.checked ? "completed" : ""}>
										{task.name}
									</span>
									<button
										onClick={() => deleteTask(character, taskIndex)}
										className="delete-task-button"
										aria-label={`Delete task: ${task.name}`}
									>
										Delete
									</button>
								</li>
							))}
						</ul>
					</div>
				))}
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
		</div>
	);
};

export default NotesPage;
