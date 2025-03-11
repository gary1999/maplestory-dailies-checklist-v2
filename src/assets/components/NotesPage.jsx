import React, { useState, useEffect } from "react";
import { characters as initialCharacters, categories } from "../data/data";
import CheckboxTable from "./CheckboxTable";
import "../css/NotesPage.css";

const NotesPage = () => {
	const [characters, setCharacters] = useState(() => {
		const savedCharacters =
			JSON.parse(localStorage.getItem("characters")) || initialCharacters;
		return savedCharacters;
	});

	const [notes, setNotes] = useState(() => {
		return JSON.parse(localStorage.getItem("characterNotes")) || {};
	});

	const [taskInputs, setTaskInputs] = useState({});
	const [cursorPositions, setCursorPositions] = useState({});

	// Save characters to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("characters", JSON.stringify(characters));
	}, [characters]);

	// Save notes to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("characterNotes", JSON.stringify(notes));
	}, [notes]);

	// Handle note changes
	const handleNoteChange = (character, newNote, cursorPosition) => {
		setNotes((prevNotes) => ({
			...prevNotes,
			[character]: { ...prevNotes[character], note: newNote },
		}));
		setCursorPositions((prev) => ({ ...prev, [character]: cursorPosition }));
	};

	// Handle cursor position changes
	const handleCursorPosition = (character, cursorPosition) => {
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
		if (!taskName.trim()) return;
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
			<div className="character-sections">
				{characters.map((character, index) => (
					<div
						key={index}
						className="character-section"
						data-character={character}
					>
						<input
							type="text"
							value={character}
							onChange={(e) => renameCharacter(index, e.target.value)}
							className="character-name-input"
						/>
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
								placeholder="Add a task..."
							/>
							<button onClick={() => addTask(character, taskInputs[character])}>
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
									/>
									<span className={task.checked ? "completed" : ""}>
										{task.name}
									</span>
									<button onClick={() => deleteTask(character, taskIndex)}>
										Delete
									</button>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
};

export default NotesPage;
