import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active class
import "../css/Navbar.css";
import Clock from "./Clock";

const Navbar = () => {
	return (
		<nav className="navbar">
			<ul>
				<li>
					<NavLink
						to="/"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Home
					</NavLink>
					<NavLink
						to="/notes"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Notes
					</NavLink>
					<NavLink
						to="/enhancements"
						className={({ isActive }) => (isActive ? "active" : "")}
					>
						Enhancements
					</NavLink>
				</li>
				<Clock />
			</ul>
		</nav>
	);
};

export default Navbar;
