import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./assets/components/Navbar";
import CheckboxTable from "./assets/components/CheckboxTable";

function App() {
	return (
		<Router>
			<Navbar />
			<Routes>
				<Route path="/" element={<CheckboxTable />} />
			</Routes>
		</Router>
	);
}

export default App;
