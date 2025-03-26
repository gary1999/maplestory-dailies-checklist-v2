const getUTCMidnight = () => {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
	return date;
};

const loadUTCTime = () => {
	const savedDateStr = localStorage.getItem("savedDateTomorrow");
	const savedDateStrThursday = localStorage.getItem("savedDateThursday");
	const savedDateStrWednesday = localStorage.getItem("savedDateWednesday"); // Load Wednesday

	if (!savedDateStr) {
		saveTomorrowDate();
	}
	if (!savedDateStrThursday) {
		saveNextThursday();
	}
	if (!savedDateStrWednesday) {
		saveNextWednesday();
	}
};

window.onload = () => {
	loadUTCTime();

	if (hasTodayReachedSavedDate()) {
		updateSavedDateIfNeeded();
	}
	if (hasTodayReachedSavedThursday()) {
		updateSavedThursdayIfNeeded();
	}
	if (hasTodayReachedSavedWednesday()) {
		updateSavedWednesdayIfNeeded();
	}
};

function saveTomorrowDate() {
	const todayUtc = getUTCMidnight();
	const tomorrowUtc = new Date(todayUtc);
	tomorrowUtc.setDate(todayUtc.getDate() + 1); // Move to next day

	localStorage.setItem("savedDateTomorrow", tomorrowUtc.toISOString());
	console.log("Saved Tomorrow's Date (UTC):", tomorrowUtc.toISOString());
}

const isValidDate = (date) => {
	return date instanceof Date && !isNaN(date);
};

const hasDatePassed = (savedDateStr) => {
	if (!savedDateStr) {
		console.log("No saved date found.");
		return false;
	}

	const savedDate = new Date(savedDateStr);
	const todayUtc = getUTCMidnight();
	return todayUtc >= savedDate;
};

function hasTodayReachedSavedDate() {
	const savedDateStr = localStorage.getItem("savedDateTomorrow");
	return hasDatePassed(savedDateStr);
}

function hasTodayReachedSavedThursday() {
	const savedDateStrThursday = localStorage.getItem("savedDateThursday");
	return hasDatePassed(savedDateStrThursday);
}

function hasTodayReachedSavedWednesday() {
	const savedDateStrWednesday = localStorage.getItem("savedDateWednesday");
	return hasDatePassed(savedDateStrWednesday);
}

function updateSavedDateIfNeeded() {
	if (hasTodayReachedSavedDate()) {
		saveTomorrowDate(); // Move the saved date to the next tomorrow
		console.log("Updated saved date to the next tomorrow.");
	}
}

function updateSavedThursdayIfNeeded() {
	if (hasTodayReachedSavedThursday()) {
		saveNextThursday(); // Move the saved date to the next Thursday
		console.log("Updated saved date to the next Thursday.");
	}
}

function updateSavedWednesdayIfNeeded() {
	if (hasTodayReachedSavedWednesday()) {
		saveNextWednesday(); // Move the saved date to the next Wednesday
		console.log("Updated saved date to the next Wednesday.");
	}
}

function saveNextThursday() {
	const todayUtc = getUTCMidnight();
	const nextThursday = new Date(todayUtc);
	const dayOfWeek = todayUtc.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

	// Calculate days until next Thursday (4 = Thursday)
	const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
	nextThursday.setDate(todayUtc.getDate() + daysUntilThursday);

	localStorage.setItem("savedDateThursday", nextThursday.toISOString());
	console.log("Saved Next Thursday (UTC):", nextThursday.toISOString());
}

function saveNextWednesday() {
	const todayUtc = getUTCMidnight();
	const nextWednesday = new Date(todayUtc);
	const dayOfWeek = todayUtc.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

	// Calculate days until next Wednesday (3 = Wednesday)
	const daysUntilWednesday = (3 - dayOfWeek + 7) % 7 || 7;
	nextWednesday.setDate(todayUtc.getDate() + daysUntilWednesday);

	localStorage.setItem("savedDateWednesday", nextWednesday.toISOString());
	console.log("Saved Next Wednesday (UTC):", nextWednesday.toISOString());
}

const setYesterdayDate = () => {
	const todayUtc = new Date();
	todayUtc.setUTCHours(0, 0, 0, 0); // Midnight UTC

	const yesterdayUtc = new Date(todayUtc);
	yesterdayUtc.setDate(todayUtc.getDate() - 1); // Move to previous day

	localStorage.setItem("savedDateTomorrow", yesterdayUtc.toISOString());
	console.log("⏳ Set saved date to yesterday:", yesterdayUtc.toISOString());
};

const setTodayDate = () => {
	const todayUtc = new Date();
	todayUtc.setUTCHours(0, 0, 0, 0); // Midnight UTC

	const yesterdayUtc = new Date(todayUtc);
	yesterdayUtc.setDate(todayUtc.getDate()); // Move to previous day

	localStorage.setItem("savedDateTomorrow", yesterdayUtc.toISOString());
	console.log("⏳ Set saved date to Today:", yesterdayUtc.toISOString());
};

const setDateBack = () => {
	const todayUtc = getUTCMidnight();
	const yesterdayUtc = new Date(todayUtc);
	yesterdayUtc.setDate(todayUtc.getDate() - 1); // Move back one day

	// Update saved dates
	localStorage.setItem("savedDateTomorrow", yesterdayUtc.toISOString());
	localStorage.setItem("savedDateThursday", yesterdayUtc.toISOString());
	localStorage.setItem("savedDateWednesday", yesterdayUtc.toISOString());

	console.log(
		"⏳ Set saved dates back to yesterday:",
		yesterdayUtc.toISOString()
	);
};

const checkNextReset = {
	loadUTCTime,
	hasTodayReachedSavedDate: () =>
		hasDatePassed(localStorage.getItem("savedDateTomorrow")),
	hasTodayReachedSavedThursday: () =>
		hasDatePassed(localStorage.getItem("savedDateThursday")),
	hasTodayReachedSavedWednesday: () =>
		hasDatePassed(localStorage.getItem("savedDateWednesday")),

	setDateBack,

	saveTomorrowDate,
	updateSavedDateIfNeeded,

	saveNextThursday,
	updateSavedThursdayIfNeeded,

	saveNextWednesday,
	updateSavedWednesdayIfNeeded,

	setYesterdayDate,
	setTodayDate,
};

export default checkNextReset;
