import React from 'react';
import { tempColor, getDayLabel } from '../utils';

function WeatherDisplay({data, index}) {

	return (
		<div className="wheather-display">
			<img className="weather-icon" src={`${data.icon}`} alt="meteo" />
			<div className="weather-date">{getDayLabel(data.date, index)}</div>
			<div className={`weather-temp ${tempColor(Math.round(data.temp))}`}>{Math.round(data.temp)} °C</div>
		</div>
	);
}

export default WeatherDisplay;