import React from 'react';
import PropTypes from 'prop-types';

function ClothingSuggestion(props) {
	const {clothingData} = props;
	return (
		<div className="clothing-suggestions" id={`clothing-day-${clothingData.date}`}>
			{clothingData.clothes.map((item, index) => (
				<div key={index} className={`clothing-item clothing-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
					<div className="number-container">
						<img className="number-circle" src="images/cercle_num_2.png" alt="" />
						<span className="number-text">{index + 1}</span>
					</div>
					<img className="clothe" src={item.icon} alt={item.name} />
					<div className="clothe-text">{item.name}</div>
				</div>
			))}
		</div>
	);
}

ClothingSuggestion.propTypes = {
	clothingData: PropTypes.shape({
		date: PropTypes.string.isRequired,
		clothes: PropTypes.arrayOf(PropTypes.shape({name: PropTypes.string.isRequired, icon: PropTypes.string.isRequired})).isRequired
	}).isRequired
};

export default ClothingSuggestion;
