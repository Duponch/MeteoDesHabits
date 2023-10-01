export const CLOTHING_ITEMS = [
	{ name: "Slip", icon: "images/slip.png", minTemp: 0, maxTemp: 100, rain: false },
	{ name: "T-shirt", icon: "images/tshirt.png", minTemp: 0, maxTemp: 100, rain: false },
	{ name: "Jeans", icon: "images/jeans.png", minTemp: 0, maxTemp: 25, rain: false },
	{ name: "Short", icon: "images/short.png", minTemp: 25, maxTemp: 100, rain: false },
	{ name: "Sweat", icon: "images/sweat.png", minTemp: -100, maxTemp: 20, rain: false },
	{ name: "Manteau", icon: "images/manteau.png", minTemp: -100, maxTemp: 10, rain: false },
	{ name: "K-way", icon: "images/kway.png", minTemp: -100, maxTemp: 30, rain: true },
	{ name: "Chaussures", icon: "images/chaussures.png", minTemp: -20, maxTemp: 25, rain: false },
	{ name: "Tongues", icon: "images/tongues.png", minTemp: 25, maxTemp: 100, rain: false },
	{ name: "Paraplui", icon: "images/parapluie.png", minTemp: 0, maxTemp: 100, rain: true },
];

export function filterClothesForWeather(temp, isRainy) {
	return CLOTHING_ITEMS.filter(item => temp >= item.minTemp && temp <= item.maxTemp && (!item.rain || (item.rain && isRainy)));
}

export function tempColor(temp) {
	if (temp < 15) return 'blue';
	else if (temp >= 15 && temp < 25) return 'orange';
	else return 'red';
}

export function getDayLabel(inputDateString, index) {
	const [day, month, year] = inputDateString.split('/');
	const dateObj = new Date(year, month - 1, day);
	const dateTxt = (index === 0) ? 'Aujourd\'hui' : (index === 1) ? 'Demain' : new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(dateObj);
	return dateTxt;
}
