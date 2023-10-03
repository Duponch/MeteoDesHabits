import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { getCityList } from '../utils';
import { getCityCustomStyle } from '../utils';
import debounce from 'lodash.debounce';

function CityDisplay({ city, onCityChange, dayIndex }) {
	const [isEditing, setIsEditing] = useState(false);
	const [options, setOptions] = useState([]);

	// Récupération de la liste de villes pour l'autocomplete
	const loadOptions = (inputValue) => {
		if (inputValue.length > 2) {
			const results = getCityList(inputValue);
			const uniqueNames = new Set(results.map(city => city.Nom_commune));
			const formattedOptions = Array.from(uniqueNames).map(name => ({
				value: name,
				label: name,
			}));
			setOptions(formattedOptions);
		}
	};

	// La bibliothèque lodash permet d'avoir la fonction debounce pour les perfs
	const debouncedLoadOptions = debounce(loadOptions, 100);
	const customStyles = getCityCustomStyle();
	const EmptyMessage = () => null;

	const handleClickOutside = (event) => {
		if (isEditing && !event.target.closest('.city')) {
			setIsEditing(false);
		}
	};

	// Enlevement de l'input lors du clique en dehors
	useEffect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [isEditing]);

	return (
		<div className="city" onClick={() => !isEditing && setIsEditing(true)}>
			{isEditing ? (
				<Select
					styles={customStyles}
					options={options}
					defaultValue={{ value: city, label: `${city}` }}
					isSearchable={true}
					onInputChange={debouncedLoadOptions}
					onChange={(selectedOption) => {
						onCityChange(selectedOption.value, dayIndex);
						setIsEditing(false);
					}}
					autoFocus 
					components={{ NoOptionsMessage: EmptyMessage }} />
			) : (
				<><i className="fa-solid fa-location-dot"></i> {city}</>
			)}
		</div>
	);
}

CityDisplay.propTypes = {
	city: PropTypes.string.isRequired,
	onCityChange: PropTypes.func.isRequired,
	dayIndex: PropTypes.number.isRequired
};

export default CityDisplay;
