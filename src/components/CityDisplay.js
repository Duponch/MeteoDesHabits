import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { getCityList } from '../utils';
import debounce from 'lodash.debounce';

function CityDisplay({ city, onCityChange }) {
	const [isEditing, setIsEditing] = useState(false);
	const [options, setOptions] = useState([]);

	const loadOptions = (inputValue) => {
		const results = getCityList(inputValue);
		const uniqueNames = new Set(results.map(city => city.Nom_commune));
		const formattedOptions = Array.from(uniqueNames).map(name => ({
			value: name,
			label: name,
		}));
		setOptions(formattedOptions);
	};

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

	return (
		<div className="city" onClick={() => !isEditing && setIsEditing(true)}>
			{isEditing ? (
				<Select
					styles={customStyles}  // appliquer les styles personnalisés ici
					options={options}
					defaultValue={{ value: city, label: `${city}` }}
					isSearchable={true}
					onInputChange={loadOptions}
					onChange={(selectedOption) => {
						onCityChange(selectedOption.value);
						setIsEditing(false);
					}}
					autoFocus
				/>
			) : (
				<>
					<i className="fa-solid fa-location-dot"></i> {city}
				</>
			)}
		</div>
	);
}

CityDisplay.propTypes = {
	city: PropTypes.string.isRequired,
	onCityChange: PropTypes.func.isRequired
};

export default CityDisplay;
