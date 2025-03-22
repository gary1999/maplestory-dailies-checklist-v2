import React, { useEffect, useState } from "react";

export default function Clock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date());
		}, 1000);
		return () => clearInterval(intervalId);
	}, []);

	const padZero = (number) => (number < 10 ? "0" : "") + number;

	const timeUntilReset = () => {
		const now = time;
		const midnightUTC = new Date(
			Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate() + 1, // Next day
				0,
				0,
				0
			)
		);

		return formatTimeDifference(midnightUTC - now);
	};

	const timeUntilThursdayReset = () => {
		const now = time;
		let daysUntilThursday = (4 - now.getUTCDay() + 7) % 7;
		if (daysUntilThursday === 0 && now.getUTCHours() >= 0) {
			daysUntilThursday = 7; // Move to next Thursday if it's already Thursday after reset time
		}

		const nextThursdayUTC = new Date(
			Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				now.getUTCDate() + daysUntilThursday,
				0,
				0,
				0
			)
		);

		const timeDifference = nextThursdayUTC - now;
		const hours = Math.floor(timeDifference / 3600000);

		if (hours >= 24) {
			const days = Math.floor(hours / 24);
			return `${days} day${days > 1 ? "s" : ""}`;
		}

		return formatTimeDifference(timeDifference);
	};

	const formatTimeDifference = (ms) => {
		const hours = Math.floor(ms / 3600000);
		const minutes = Math.floor((ms % 3600000) / 60000);
		const seconds = Math.floor((ms % 60000) / 1000);
		return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
	};

	return (
		<div className="clocks">
			<div className="clock">Reset in: {timeUntilReset()}</div>
			<div className="clock">Weekly Reset in: {timeUntilThursdayReset()}</div>
		</div>
	);
}
