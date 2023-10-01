import React from 'react';
import PropTypes from 'prop-types';

function CityDisplay({ city }) {
	return (
		<div className="city"><i className="fa-solid fa-location-dot"></i> {city}</div>
	);
}

CityDisplay.propTypes = {
	city: PropTypes.string.isRequired
};

export default CityDisplay;