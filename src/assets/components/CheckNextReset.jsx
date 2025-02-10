const loadUTCTime = () => {
	// Retrieve the UTC time from localStorage
	const savedDateStr = localStorage.getItem("savedDateTomorrow");
	const savedDateStrThursday = localStorage.getItem("savedDateThursday");

	if (!savedDateStr) {
		saveTomorrowDate();
	}
	if (!savedDateStrThursday) {
		saveNextThursday();
	}
};

function saveTomorrowDate() {
	const todayUtc = new Date();
	todayUtc.setUTCHours(0, 0, 0, 0); // Midnight UTC

	const tomorrowUtc = new Date(todayUtc);
	tomorrowUtc.setDate(todayUtc.getDate() + 1); // Move to next day

	localStorage.setItem("savedDateTomorrow", tomorrowUtc.toISOString());
	console.log("Saved Tomorrow's Date (UTC):", tomorrowUtc.toISOString());
}

function hasTodayReachedSavedDate() {
	const savedDateStr = localStorage.getItem("savedDateTomorrow");
	if (!savedDateStr) {
		console.log("No saved date found.");
		return false;
	}

	const savedDate = new Date(savedDateStr);

	// Get today's date at UTC midnight
	const todayUtc = new Date();
	todayUtc.setUTCHours(0, 0, 0, 0);

	// console.log("Has Today Reached Saved Date?", hasTodayReachedSavedDate());
	return todayUtc >= savedDate;
}

function updateSavedDateIfNeeded() {
	if (hasTodayReachedSavedDate()) {
		saveTomorrowDate(); // Move the saved date to the next tomorrow
		console.log("Updated saved date to the next tomorrow.");
	}
}

function saveNextThursday() {
	const todayUtc = new Date();
	todayUtc.setUTCHours(0, 0, 0, 0); // Midnight UTC

	const nextThursday = new Date(todayUtc);
	const dayOfWeek = todayUtc.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

	// Calculate days until next Thursday (4 = Thursday)
	const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
	nextThursday.setDate(todayUtc.getDate() + daysUntilThursday);

	localStorage.setItem("savedDateThursday", nextThursday.toISOString());
	console.log("Saved Next Thursday (UTC):", nextThursday.toISOString());
}

function hasTodayReachedSavedThursday() {
	const savedDateStrThursday = localStorage.getItem("savedDateThursday");
	if (!savedDateStrThursday) {
		console.log("No saved date found.");
		return false;
	}

	const savedDateThursday = new Date(savedDateStrThursday);

	// Get today's date at UTC midnight
	const todayUtc = new Date();
	todayUtc.setUTCHours(0, 0, 0, 0);

	return todayUtc >= savedDateThursday;
}

function updateSavedThursdayIfNeeded() {
	if (hasTodayReachedSavedThursday()) {
		saveNextThursday(); // Move the saved date to the next Thursday
		console.log("Updated saved date to the next Thursday.");
	}
}

const setYesterdayDate = () => {
	const todayUtc = new Date();
	todayUtc.setUTCHours(0, 0, 0, 0); // Midnight UTC

	const yesterdayUtc = new Date(todayUtc);
	yesterdayUtc.setDate(todayUtc.getDate() - 1); // Move to previous day

	localStorage.setItem("savedDateTomorrow", yesterdayUtc.toISOString());
	console.log("⏳ Set saved date to yesterday:", yesterdayUtc.toISOString());
};

const checkNextReset = {
	loadUTCTime,

	saveTomorrowDate,
	hasTodayReachedSavedDate,
	updateSavedDateIfNeeded,

	saveNextThursday,
	hasTodayReachedSavedThursday,
	updateSavedThursdayIfNeeded,

	setYesterdayDate,
};

export default checkNextReset;
