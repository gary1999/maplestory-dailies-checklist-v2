import React from "react";
import { Link } from "react-router-dom";
import "../css/Navbar.css"; // Add some styling
import Clock from "./Clock";

const Navbar = () => {
	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link to="/">Home</Link>
					<Link to="/notes">Notes</Link>
				</li>
				<Clock />
			</ul>
		</nav>
	);
};

export default Navbar;
