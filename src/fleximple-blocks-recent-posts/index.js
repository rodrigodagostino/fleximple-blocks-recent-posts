import { registerBlockType } from '@wordpress/blocks';

import './style.scss';

/**
 * Internal dependencies
 */
import Edit from './edit';
import icon from './icon';
import metadata from './block.json';

const { name } = metadata;

export { metadata, name };

registerBlockType(metadata.name, {
	icon: {
		src: icon,
	},
	edit: Edit,
	save: () => null,
});

// Provide a custom block class
function setBlockCustomClassName(className, blockName) {
	return blockName === name ? 'fleximple-blocks-recent-posts' : className;
}

wp.hooks.addFilter(
	'blocks.getBlockDefaultClassName',
	'fleximple-blocks/fleximple-blocks-recent-posts',
	setBlockCustomClassName
);
