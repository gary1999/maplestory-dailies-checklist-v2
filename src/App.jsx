import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./assets/css/Navbar.css";
import Clock from "./assets/components/Clock";

// import Navbar from "./assets/components/Navbar";
import CheckboxTable from "./assets/components/CheckboxTable";
import NotesPage from "./assets/components/NotesPage";

function App() {
	return (
		<Router>
			<nav className="navbar">
				<ul>
					<li>
						<Link to="/">Home</Link>
						<Link to="/notes">Notes</Link>
					</li>
					<Clock />
				</ul>
			</nav>

			<Routes>
				<Route path="/" element={<CheckboxTable />} />
				<Route path="/notes" element={<NotesPage />} />
			</Routes>
		</Router>
	);
}

export default App;
