import { Icon, starEmpty, starFilled } from '@wordpress/icons';
import { PanelRow } from '@wordpress/components';

const CategoryStatus = ( { cats } ) => {
	let text = 'Categories look good!';
	let catIcon = starFilled;

	if ( ! cats.length || cats.includes( 1 ) ) {
		catIcon = starEmpty;
		if ( ! cats.length ) {
			text = 'Choose a category';
		} else {
			text = 'Don\'t use uncategorized';
		}
	}

	return (
		<PanelRow>
			<Icon icon={ catIcon }/>
			{ text }
		</PanelRow>
	);

};

export default CategoryStatus;
