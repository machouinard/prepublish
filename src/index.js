import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import {
	PluginDocumentSettingPanel,
	PluginPrePublishPanel,
} from '@wordpress/edit-post';
import { registerPlugin } from '@wordpress/plugins';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { serialize } from '@wordpress/blocks';
import { count } from '@wordpress/wordcount';

/**
 * Render function for the plugin
 *
 * @returns {JSX.Element}
 */
const render = () => {

	// var and func for keeping state
	const [ wordCountDisplay, setWordCountDisplay ] = useState( '' );

	// funcs to handle locking post
	const {
		      lockPostSaving,
		      unlockPostSaving,
		      enablePublishSidebar,
		      disablePublishSidebar,
	      } = useDispatch( 'core/editor' );

	// Gets all blocks in post
	const { blocks } = useSelect( select => (
		{
			blocks: select( 'core/editor' ).getBlocks(),
		}
	) );

	// Runs everytime `blocks` updates
	useEffect( () => {
		console.log( 'blocks', blocks );
		// Filter out P blocks
		let countable = blocks.filter( block => block.name === 'core/paragraph' );
		// Count words in paragraph blocks
		const wordCount = count( serialize( countable ), 'words' );
		// Set state with wordCount
		setWordCountDisplay( wordCount );
		console.log( `wordCount ${ wordCount }` );
		// lock if fewer than 10 words
		let lockPost = wordCount < 10;

		if ( lockPost ) {
			lockPostSaving();
			disablePublishSidebar();
		} else {
			unlockPostSaving();
			enablePublishSidebar();
		}
	}, [ blocks ] );

	return (
		<>
			<PluginDocumentSettingPanel
				name="prepublish-checklist"
				title="PREPublish Checklist"
				className="prepublish-checklist"
			>
				{ `WordCount: ${ wordCountDisplay }` }
			</PluginDocumentSettingPanel>
			<PluginPrePublishPanel>
				Word Count: { wordCountDisplay }
			</PluginPrePublishPanel>
		</>
	);
};

// register plugin
registerPlugin( 'prepublish', {
	render,
} );