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
import PrePublishDisplay from './PrePublishDisplay';
import { REQUIRED_WORD_COUNT } from './constants';

/**
 * Render function for the plugin
 *
 * @returns {JSX.Element}
 */
const render = () => {

	// var and func for keeping state
	const [ wordCountDisplay, setWordCountDisplay ] = useState( '' );
	const [ wordReady, setWordReady ] = useState( '' );
	const [ imgReady, setImgReady ] = useState( '' );

	// funcs to handle locking post
	const {
		      lockPostSaving,
		      unlockPostSaving,
		      enablePublishSidebar,
		      disablePublishSidebar,
	      } = useDispatch( 'core/editor' );

	// Gets all blocks in post
	const { blocks, cats, tags, featuredImageID } = useSelect( ( select ) => {
		return {
			blocks: select( 'core/block-editor' ).getBlocks(),
			cats: select( 'core/editor' ).getEditedPostAttribute( 'categories' ),
			tags: select( 'core/editor' ).getEditedPostAttribute( 'tags' ),
			featuredImageID:
				select( 'core/editor' ).getEditedPostAttribute( 'featured_media' ),
		};
	} );

	// Runs everytime `blocks` updates
	useEffect( () => {
		let lockPost = false;
		setWordReady( true );
		setImgReady( true );
		console.log( 'blocks', blocks );
		// Filter out P blocks
		let countable = blocks.filter( block => block.name === 'core/paragraph' );
		// Count words in paragraph blocks
		const wordCount = count( serialize( countable ), 'words' );
		// Set state with wordCount
		setWordCountDisplay( wordCount );
		console.log( `required wordCount ${ REQUIRED_WORD_COUNT }` );
		// lock if fewer than 10 words
		if ( wordCount < REQUIRED_WORD_COUNT ) {
			lockPost = true;
			setWordReady( false );
		}
		if ( ! featuredImageID ) {
			lockPost = true;
			setImgReady( false );
		}

		if ( lockPost ) {
			lockPostSaving();
			disablePublishSidebar();
		} else {
			unlockPostSaving();
			enablePublishSidebar();
		}
	}, [ blocks, featuredImageID ] );

	return (
		<>
			<PluginDocumentSettingPanel
				name="prepublish-checklist"
				title="PREPublish Checklist"
				className="prepublish-checklist"
			>
				<PrePublishDisplay
					wordCount={ wordCountDisplay }
					wordLock={ ! wordReady }
					imgLock={ ! imgReady }
				/>
			</PluginDocumentSettingPanel>
			<PluginPrePublishPanel>
				Word Count: { wordCountDisplay }
			</PluginPrePublishPanel>
		</>
	);
};

// register plugin
registerPlugin( 'prepublish', {
	icon: 'forms',
	render,
} );
