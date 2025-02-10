import React, { useEffect, useState } from "react";

export default function Clock() {
	const [time, setTime] = useState(new Date());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date());
		}, 1000);
		// console.log(time);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const currentUTCTime = () => {
		let hours = Math.floor(time.getUTCHours());
		const minutes = Math.floor(time.getUTCMinutes());
		const seconds = Math.floor(time.getUTCSeconds());
		// const meridiem = hours >= 12 ? "PM" : "AM";

		hours = hours % 12 || 12;

		return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
		//${meridiem}
	};

	const timeUntilReset = () => {
		const now = time;
		const currentUTCDay = now.getUTCDate();

		// Create a Date object for the next day's midnight UTC
		const midnightUTC = new Date(
			Date.UTC(
				now.getUTCFullYear(),
				now.getUTCMonth(),
				currentUTCDay + 1,
				0,
				0,
				0
			)
		);

		// Calculate the difference in milliseconds
		const timeDifference = midnightUTC - now;

		const hours = Math.floor(timeDifference / 3600000); // 1 hour = 3600000 ms
		const minutes = Math.floor((timeDifference % 3600000) / 60000); // 1 minute = 60000 ms
		const seconds = Math.floor((timeDifference % 60000) / 1000); // 1 second = 1000 ms

		return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
	};

	const padZero = (number) => {
		return (number < 10 ? "0" : "") + number;
	};

	return (
		<>
			{/* <div className="clock">TIME IN GAME: {currentUTCTime()}</div> */}
			<div className="clock">TIME UNTIL RESET: {timeUntilReset()}</div>
		</>
	);
}
