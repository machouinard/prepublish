import { Icon, starEmpty, starFilled } from '@wordpress/icons';
import { PanelRow } from '@wordpress/components';

const ImageStatus = ( { imgLock } ) => {
	const imageIcon = imgLock ? starEmpty : starFilled;

	return (
		<PanelRow>
			<Icon icon={ imageIcon }/>
			Featured Image
		</PanelRow>
	);

};

export default ImageStatus;
