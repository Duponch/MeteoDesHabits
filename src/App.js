import React, { useState, useEffect } from 'react';
import WeatherDisplay from './components/WeatherDisplay';
import CityDisplay from './components/CityDisplay';
import ClothingSuggestion from './components/ClothingSuggestion';
import { filterClothesForWeather, getCityNameApi, getWeatherDataApi } from './utils';
import './App.css';

function App() {
	const [weatherData, setWeatherData] = useState([]);
	const [clothingSuggestions, setClothingSuggestions] = useState([]);
	const [city, setCity] = useState(Array(weatherData.length).fill(''));

	useEffect(() => {
		async function fetchData() {

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(async function (position) {

					const city = await getCityNameApi(position);
					const data = await getWeatherDataApi(city);

					if (data && data.list) {

						const todaysData = data.list.find(day => new Date(day.dt * 1000).toLocaleDateString() === new Date().toLocaleDateString());
						const filteredData = data.list.filter(day => day.dt_txt.endsWith('12:00:00') && new Date(day.dt * 1000).toLocaleDateString() !== new Date().toLocaleDateString());
						todaysData && filteredData.unshift(todaysData);

						const extractedData = filteredData.map(day => ({ date: new Date(day.dt * 1000).toLocaleDateString(), temp: day.main.temp, icon: `images/${day.weather[0].icon}.png` }));
						const clothingData = extractedData.map(day => {
							const isRainy = day.icon.includes('10');
							const isSunny = day.icon.includes('01d');
							const clothesForWeather = filterClothesForWeather(day.temp, isRainy, isSunny);
							return { date: day.date, clothes: clothesForWeather };
						});

						setWeatherData(extractedData);
						setCity(Array(extractedData.length).fill(city));
						setClothingSuggestions(clothingData);
					}
				});

			} else {
				console.error('La géolocalisation n\'est pas prise en charge par ce navigateur.');
			}
		}
		fetchData();
	}, []);

	// Met à jour les infos météo et les vêtements lors du chois d'une ville
	const handleCityChange = async (newCity, dayIndex) => {
		
		const data = await getWeatherDataApi(newCity);
		if (data && data.list) {
			const todaysData = data.list.find(day => new Date(day.dt * 1000).toLocaleDateString() === new Date().toLocaleDateString());
			const filteredData = data.list.filter(day => day.dt_txt.endsWith('12:00:00') && new Date(day.dt * 1000).toLocaleDateString() !== new Date().toLocaleDateString());
			todaysData && filteredData.unshift(todaysData);

			const extractedData = filteredData.map(day => ({ date: new Date(day.dt * 1000).toLocaleDateString(), temp: day.main.temp, icon: `images/${day.weather[0].icon}.png` }));
			const clothingData = extractedData.map(day => {
				const isRainy = day.icon.includes('10');
				const isSunny = day.icon.includes('01d');
				const clothesForWeather = filterClothesForWeather(day.temp, isRainy, isSunny);
				return { date: day.date, clothes: clothesForWeather };
			});

			const updatedWeatherData = [...weatherData];
			updatedWeatherData[dayIndex] = {
				date: extractedData[dayIndex].date,
				temp: extractedData[dayIndex].temp,
				icon: extractedData[dayIndex].icon
			};
			const updatedClothingSuggestions = [...clothingSuggestions];
			updatedClothingSuggestions[dayIndex] = {
				date: clothingData[dayIndex].date,
				clothes: clothingData[dayIndex].clothes
			};

			// Mettez à jour seulement la ville pour la journée spécifiée
			const updatedCity = [...city];
			updatedCity[dayIndex] = newCity;

			setCity(updatedCity);
			setWeatherData(updatedWeatherData);
			setClothingSuggestions(updatedClothingSuggestions);
		}
	};

	return (
		<div className="app-container">
			{weatherData.map((data, index) => (
				<div key={`day-${data.date}`} className="daily-forecast">
					<WeatherDisplay data={data} index={index} />
					<CityDisplay city={city[index]} onCityChange={handleCityChange} dayIndex={index} />
					<ClothingSuggestion clothingData={clothingSuggestions[index]} />
				</div>
			))}
		</div>
	);
}

export default App;
