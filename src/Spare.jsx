import React, { useState, useEffect } from "react";

// Data for names (columns) and categories (rows)
const names = ["Aran", "Luminous", "Adele"];
const categories = ["Category A", "Category B", "Category C"];

function App() {
	// Initialize state for checkboxes
	const [checkboxes, setCheckboxes] = useState(() => {
		// Initial load from localStorage (if any)
		const storedData = names.reduce((acc, name) => {
			//reduce creates an object (initial value is {}) within the accumulator, create a name object which has x categories in it
			//accumulator is where the value goes into
			//name is each of the items in the array we're going through to put into the object
			acc[name] = categories.reduce((categoryAcc, category) => {
				//reduce creates an object (initial value is {}) within the accumulator, create an object which has categories in it that gets put into the names array
				//it will generate an object of true/false but in this case it would be false
				const key = `${name}-${category}`;
				categoryAcc[category] =
					//set value of each category (gets item from storage and puts it into the array)
					JSON.parse(localStorage.getItem(key)) ?? false; // Default to false
				return categoryAcc;
			}, {});
			return acc;
		}, {});
		return storedData;
	});

	// Function to handle checkbox changes
	const handleCheckboxChange = (name, category) => {
		setCheckboxes((prev) => {
			const updated = { ...prev }; // Copy current state
			updated[name] = { ...updated[name] }; // Copy the user state
			updated[name][category] = !updated[name][category]; // Toggle the specific category checkbox
			// Save the updated state to localStorage for this specific checkbox
			localStorage.setItem(
				`${name}-${category}`,
				JSON.stringify(updated[name][category])
			);
			return updated;
		});
	};

	// Render the table
	return (
		<table border="1">
			<thead>
				<tr>
					<th>Categories</th>
					{names.map((name) => (
						<th key={name}>{name}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{categories.map((category) => (
					<tr key={category}>
						<td>{category}</td>
						{names.map((name) => (
							<td key={`${name}-${category}`}>
								<input
									type="checkbox"
									checked={checkboxes[name][category]} // Control checkbox checked state
									onChange={() =>
										handleCheckboxChange(name, category)
									} // Update checkbox state
								/>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default App;
