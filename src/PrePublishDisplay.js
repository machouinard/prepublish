import { Icon, starEmpty, starFilled } from '@wordpress/icons';
import { PanelBody, PanelRow } from '@wordpress/components';

const PrePublishDisplay = ( { wordCount, wordLock, imgLock } ) => {

	console.log( `wordLock: ${ wordLock }` );

	const wordIcon = wordLock ? starEmpty : starFilled;
	const imgIcon = imgLock ? starEmpty : starFilled;

	return (
		<PanelBody>
			<PanelRow>
				<Icon icon={ wordIcon }/>
				{ `WordCount: ${ wordCount }` }
			</PanelRow>
			<PanelRow>
				<Icon icon={ imgIcon }/>
				{ `Featured Image?` }
			</PanelRow>
		</PanelBody>
	);
};

export default PrePublishDisplay;
