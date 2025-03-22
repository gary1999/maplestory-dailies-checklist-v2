import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import "./assets/css/Navbar.css";
import Clock from "./assets/components/Clock";
import Navbar from "./assets/components/Navbar";
import CheckboxTable from "./assets/components/CheckboxTable";
import NotesPage from "./assets/components/NotesPage";

function App() {
	return (
		<Router basename="/maplestory-dailies-checklist-v2">
			<Navbar />
			<Routes>
				<Route path="/" element={<CheckboxTable />} />
				<Route path="/notes" element={<NotesPage />} />
				{/* <Route path="/enhancements" element={#} /> */}
				{/* <Route path="/misc" element={#} /> */}
			</Routes>
		</Router>
	);
}

export default App;
