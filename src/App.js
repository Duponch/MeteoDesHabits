import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherDisplay from './components/WeatherDisplay';
import CityDisplay from './components/CityDisplay';
import ClothingSuggestion from './components/ClothingSuggestion';
import { filterClothesForWeather } from './utils';
import './App.css';

function App() {
	const [weatherData, setWeatherData] = useState([]);
	const [clothingSuggestions, setClothingSuggestions] = useState([]);
	const [city, setCity] = useState([]);

	useEffect(() => {
		async function fetchData() {
			const city = 'Toulouse';
			const url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.REACT_APP_WEATHER_API_KEY}`;

			const response = await axios.get(url).catch(error => {
				console.error('Erreur lors de la récupération des données météo : ', error);
			});

			if (response.data && response.data.list) {

				const todaysData = response.data.list.find(day => new Date(day.dt * 1000).toLocaleDateString() === new Date().toLocaleDateString());
				const filteredData = response.data.list.filter(day => day.dt_txt.endsWith('12:00:00') && new Date(day.dt * 1000).toLocaleDateString() !== new Date().toLocaleDateString());
				todaysData && filteredData.unshift(todaysData);

				const extractedData = filteredData.map(day => ({
					date: new Date(day.dt * 1000).toLocaleDateString(),
					temp: day.main.temp,
					icon: `images/${day.weather[0].icon}.png`
				}));

				const clothingData = extractedData.map(day => {
					const isRainy = day.icon.includes('10'); // "10" is the prefix for rainy weather icons in OpenWeatherMap
					const clothesForWeather = filterClothesForWeather(day.temp, isRainy);
					return {date: day.date, clothes: clothesForWeather};
				});

				setWeatherData(extractedData);
				setCity(city);
				setClothingSuggestions(clothingData);
			}
		}
		fetchData();
	}, []);

	return (
		<div className="app-container">
			{weatherData.map((data, index) => (
				<div key={`day-${data.date}`} className="daily-forecast">
					<WeatherDisplay data={data} index={index} />
					<CityDisplay city={city} />
					<ClothingSuggestion clothingData={clothingSuggestions[index]} />
				</div>
			))}
		</div>
	);
}

export default App;
