import { Icon, starEmpty, starFilled } from '@wordpress/icons';
import { PanelRow } from '@wordpress/components';
import '../index.scss';

const WordStatus = ( { wordCount, wordLock } ) => {
	const wordIcon = wordLock ? starEmpty : starFilled;

	return (
		<PanelRow>
			<Icon icon={ wordIcon }/>
			{ `WordCount: ${ wordCount }` }
		</PanelRow>
	);

};

export default WordStatus;
