import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./assets/css/Navbar.css";
import Clock from "./assets/components/Clock";

// import Navbar from "./assets/components/Navbar";
import CheckboxTable from "./assets/components/CheckboxTable";
import NotesPage from "./assets/components/NotesPage";
import Navbar from "./assets/components/Navbar";

function App() {
	return (
		<Router>
			<Navbar />

			<Routes>
				<Route path="/" element={<CheckboxTable />} />
				<Route path="/notes" element={<NotesPage />} />
				{/* <Route path="/enhancements" element={#} /> */}
			</Routes>
		</Router>
	);
}

export default App;
