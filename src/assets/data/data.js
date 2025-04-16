export const categories = {
	Dailies: [
		{ name: "Arcane River", type: "daily", count: 1 },
		{ name: "Grandis", type: "daily", count: 1 },
		{ name: "Monster Park", type: "daily", count: 1 },
		{ name: "Bosses", type: "daily", count: 1 },
		{ name: "Auto-Harvest", type: "daily", count: 1 },
	],
	Weeklies: [
		{
			name: "Legion",
			type: "weekly",
			count: 1,
		},
	],
	"Weekly Bosses": [
		{ name: "ALL", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Standard", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Lotus", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Damien", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Slime", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Lucid", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Will", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Gloom", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Verus Hilla", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Darknell", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Seren", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Kalos", type: "weekly", count: 1, resetDay: "thursday" },
		{ name: "Kaling", type: "weekly", count: 1, resetDay: "thursday" },
	],
	"Monthly Bosses": [
		{ name: "Black Mage", type: "monthly", count: 1, resetDay: "month" },
	],
	Events: [
		// { name: "Ride or Die", type: "weekly" },
		// { name: "Burning 6k", type: "weekly" },
		// { name: "Tirnog 6k", type: "weekly" },
		{
			name: "Daily Check In",
			type: "daily",
			count: 1,
		},
		{
			name: "Rock Spirit Check In",
			type: "daily",
			count: 1,
		},
		{
			name: "Demon Slayer Check In",
			type: "weekly",
			count: 5,
			resetDay: "wednesday",
		},
		{
			name: "Demon Slayer Breath",
			type: "weekly",
			count: 5,
			resetDay: "wednesday",
		},
		{
			name: "Demon Slayer Coin",
			type: "weekly",
			count: 5,
			resetDay: "wednesday",
		},
	],
};
