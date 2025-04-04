const getUTCMidnight = () => {
	const date = new Date();
	date.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
	return date;
};

const loadUTCTime = () => {
	const savedDateStr = localStorage.getItem("savedDateTomorrow");
	const savedDateStrThursday = localStorage.getItem("savedDateThursday");
	const savedDateStrWednesday = localStorage.getItem("savedDateWednesday");
	const savedDateStrMonthly = localStorage.getItem("savedDateMonthly");

	if (!savedDateStr) {
		saveTomorrowDate();
	}
	if (!savedDateStrThursday) {
		saveNextThursday();
	}
	if (!savedDateStrWednesday) {
		saveNextWednesday();
	}
	if (!savedDateStrMonthly) {
		saveNextMonth();
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
	if (hasTodayReachedSavedMonthly()) {
		updateSavedMonthlyIfNeeded();
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

function hasTodayReachedSavedMonthly() {
	const savedDateStrMonthly = localStorage.getItem("savedDateMonthly");
	return hasDatePassed(savedDateStrMonthly);
}

function updateSavedDateIfNeeded() {
	if (hasTodayReachedSavedDate()) {
		saveTomorrowDate();
		console.log("Updated saved date to the next tomorrow.");
	}
}

function updateSavedThursdayIfNeeded() {
	if (hasTodayReachedSavedThursday()) {
		saveNextThursday();
		console.log("Updated saved date to the next Thursday.");
	}
}

function updateSavedWednesdayIfNeeded() {
	if (hasTodayReachedSavedWednesday()) {
		saveNextWednesday();
		console.log("Updated saved date to the next Wednesday.");
	}
}

function updateSavedMonthlyIfNeeded() {
	if (hasTodayReachedSavedMonthly()) {
		saveNextMonth();
		console.log("Updated saved date to the next month.");
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

function saveNextMonth() {
	const todayUtc = getUTCMidnight();
	const nextMonth = new Date(todayUtc);

	// Set to first day of next month at midnight UTC
	nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1, 1);
	nextMonth.setUTCHours(0, 0, 0, 0);

	localStorage.setItem("savedDateMonthly", nextMonth.toISOString());
	console.log("Saved Next Month (UTC):", nextMonth.toISOString());
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
	localStorage.setItem("savedDateMonthly", yesterdayUtc.toISOString());

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
	hasTodayReachedSavedMonthly: () =>
		hasDatePassed(localStorage.getItem("savedDateMonthly")),

	setDateBack,

	saveTomorrowDate,
	updateSavedDateIfNeeded,

	saveNextThursday,
	updateSavedThursdayIfNeeded,

	saveNextWednesday,
	updateSavedWednesdayIfNeeded,

	saveNextMonth,
	updateSavedMonthlyIfNeeded,

	setYesterdayDate,
	setTodayDate,
};

export default checkNextReset;
