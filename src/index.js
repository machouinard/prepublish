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
import { PanelBody } from '@wordpress/components';
import WordStatus from './components/WordStatus';
import ImageStatus from './components/ImageStatus';
import CategoryStatus from './components/categoryStatus';
import { REQUIRED_WORD_COUNT } from './constants';
import { stack, starFilled } from '@wordpress/icons';
//import './index.scss';

/**
 * Render function for the plugin
 *
 * @returns {JSX.Element}
 */
const render = () => {

	const postType = useSelect(
		select => select( 'core/editor' ).getCurrentPostType() );

	if ( 'post' !== postType ) {
		return null;
	}

	// var and func for keeping state
	const [ wordCountDisplay, setWordCountDisplay ] = useState( '' );
	const [ wordReady, setWordReady ] = useState( '' );
	const [ imgReady, setImgReady ] = useState( '' );
	const [ categories, setCategories ] = useState( '' );

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
		setCategories( cats );
		// Filter out P blocks
		let countable = blocks.filter( block => block.name === 'core/paragraph' );
		// Count words in paragraph blocks
		const wordCount = count( serialize( countable ), 'words' );
		// Set state with wordCount
		setWordCountDisplay( wordCount );
		// lock if fewer than 10 words
		if ( wordCount < REQUIRED_WORD_COUNT ) {
			lockPost = true;
			setWordReady( false );
		}
		if ( ! featuredImageID ) {
			lockPost = true;
			setImgReady( false );
		}
		// lock if no categories or inlcudes uncategorized
		if ( ! cats.length || cats.includes( 1 ) ) {
			lockPost = true;
		}

		if ( lockPost ) {
			lockPostSaving();
			disablePublishSidebar();
		} else {
			unlockPostSaving();
			enablePublishSidebar();
		}
	}, [ blocks, featuredImageID, cats ] );

	return (
		<>
			<PluginDocumentSettingPanel
				name="prepublish-checklist"
				title="Pre-Publish Checklist"
				className="prepublish-checklist"
			>
				<PanelBody>
					<WordStatus
						wordCount={ wordCountDisplay }
						wordLock={ ! wordReady }
					/>
					<ImageStatus
						imgLock={ ! imgReady }
					/>
					<CategoryStatus
						cats={ categories }
					/>
				</PanelBody>
			</PluginDocumentSettingPanel>
			<PluginPrePublishPanel>
				<PanelBody>
					<WordStatus
						wordCount={ wordCountDisplay }
						wordLock={ ! wordReady }
					/>
					<ImageStatus
						imgLock={ ! imgReady }
					/>
					<CategoryStatus
						cats={ categories }
					/>
				</PanelBody>
			</PluginPrePublishPanel>
		</>
	);
};

// register plugin
registerPlugin( 'prepublish', {
	icon: stack,
	render,
} );
