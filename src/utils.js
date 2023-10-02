import axios from 'axios';
import citiesData from './data/cities.json';

export const CLOTHING_ITEMS = [
	{ name: 'Slip', icon: 'images/slip.png', minTemp: 0, maxTemp: 100 },
	{ name: 'T-shirt', icon: 'images/tshirt.png', minTemp: 0, maxTemp: 100 },
	{ name: 'Pantalon', icon: 'images/jeans.png', minTemp: 0, maxTemp: 25 },
	{ name: 'Short', icon: 'images/short.png', minTemp: 25, maxTemp: 100 },
	{ name: 'Sweat', icon: 'images/sweat.png', minTemp: -100, maxTemp: 20 },
	{ name: 'Manteau', icon: 'images/manteau.png', minTemp: -100, maxTemp: 10 },
	{ name: 'K-way', icon: 'images/kway.png', minTemp: -100, maxTemp: 30, rain: true },
	{ name: 'Baskets', icon: 'images/baskets.png', minTemp: 10, maxTemp: 25, excludeBy: ['Bottes'] },
	{ name: 'Chaussures', icon: 'images/chaussures_hiver.png', minTemp: -100, maxTemp: 10, excludeBy: ['Bottes'] },
	{ name: 'Bottes', icon: 'images/bottes.png', minTemp: -100, maxTemp: 25, rain: true },
	{ name: 'Sandales', icon: 'images/sandales.png', minTemp: 25, maxTemp: 100, excludeBy: ['Bottes'] },
	{ name: 'Parapluie', icon: 'images/parapluie.png', minTemp: -100, maxTemp: 100, rain: true },
	{ name: 'Bonnet', icon: 'images/bonnet.png', minTemp: -100, maxTemp: 10 },
	{ name: 'Mouffles', icon: 'images/mouffles.png', minTemp: -100, maxTemp: 5 },
	{ name: 'Lunettes', icon: 'images/lunettes.png', minTemp: 25, maxTemp: 100, sun: true },
	{ name: 'Casquette', icon: 'images/casquette.png', minTemp: 25, maxTemp: 100, sun: true },
];

export function filterClothesForWeather(temp, isRainy, isSunny) {
	const filteredByWeather = CLOTHING_ITEMS.filter((item) => temp >= item.minTemp && temp <= item.maxTemp && (!item.rain || isRainy) && (!item.sun || isSunny));
	const filteredByExcludeAndWeather = filteredByWeather.filter((item) =>
		item.excludeBy ? !item.excludeBy.some((excludedItemName) => filteredByWeather.some((otherItem) => otherItem.name === excludedItemName)) : true
	);
	return filteredByExcludeAndWeather;
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

export function getCityList(query) {
	const filteredCities = citiesData.filter(city => city.Nom_commune.toLowerCase().startsWith(query.toLowerCase()));
	return filteredCities; 
}

export function getCityCustomStyle() {
	const customStyles = {
		control: (provided) => ({
			...provided,
			backgroundColor: '#f0f0f0',
			borderColor: '#d9d9d9',
			boxShadow: 'none',
			"&:hover": {
				borderColor: '#bfbfbf',
			},
		}),
		menu: (provided) => ({
			...provided,
			zIndex: 3,
			backgroundColor: '#f7f7f7',
		}),
		menuList: (provided) => ({
			...provided,
			padding: '0',
		}),
		option: (provided, state) => ({
			...provided,
			backgroundColor: state.isFocused ? '#e2e2e2' : 'transparent',
			color: state.isSelected ? '#ff4f00' : '#333',
			padding: '10px 20px',
		}),
		singleValue: (provided) => ({
			...provided,
			color: '#333',
		}),
	};

	return customStyles;
}

export async function getCityDataApi(position) {
	const geocodingUrl = `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`;
	const response = await axios.get(geocodingUrl).catch(error => {
		console.error('Erreur lors de la récupération de la ville de l\'utilisateur : ', error);
	});
	return response.data.address.city;
}

export async function getWeatherDataApi(city) {
	const weatherUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;
	const response = await axios.get(weatherUrl).catch(error => {
		console.error('Erreur lors de la récupération des données météo : ', error);
	});
	return response.data;
}