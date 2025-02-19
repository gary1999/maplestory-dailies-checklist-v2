import React, { useState, useEffect } from "react";
import { characters } from "../data/data";

const NotesPage = () => {
	const [notes, setNotes] = useState(() => {
		return JSON.parse(localStorage.getItem("notes")) || {};
	});

	useEffect(() => {
		const storedNotes =
			JSON.parse(localStorage.getItem("characterNotes")) || {};
		setNotes(storedNotes);
	}, []);

	useEffect(() => {
		localStorage.setItem("characterNotes", JSON.stringify(notes));
	}, [notes]);

	const handleNoteChange = (character, newNote) => {
		setNotes((prevNotes) => ({
			...prevNotes,
			[character]: { ...prevNotes[character], note: newNote },
		}));
	};

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
	};

	const toggleTask = (character, index) => {
		setNotes((prevNotes) => {
			const updatedTasks = [...(prevNotes[character]?.tasks || [])];
			updatedTasks[index].checked = !updatedTasks[index].checked;
			return {
				...prevNotes,
				[character]: { ...prevNotes[character], tasks: updatedTasks },
			};
		});
	};

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

	return (
		<div>
			<h2>Character Notes</h2>
			{characters.map((character) => (
				<div key={character}>
					<h3>{character}</h3>
					<textarea
						value={notes[character]?.note || ""}
						onChange={(e) => handleNoteChange(character, e.target.value)}
						placeholder="Enter notes here..."
					/>
					<div>
						<input
							type="text"
							id={`taskInput-${character}`}
							placeholder="Add a task..."
						/>
						<button
							onClick={() =>
								addTask(
									character,
									document.getElementById(`taskInput-${character}`).value
								)
							}
						>
							Add Task
						</button>
					</div>
					<ul>
						{(notes[character] || []).map((task, index) => (
							<div key={index}>
								<input
									type="checkbox"
									checked={task.checked}
									onChange={() => toggleTask(character, index)}
								/>
								<span>{task.text}</span>
								<button onClick={() => deleteTask(character, index)}>
									Delete
								</button>
							</div>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default NotesPage;
