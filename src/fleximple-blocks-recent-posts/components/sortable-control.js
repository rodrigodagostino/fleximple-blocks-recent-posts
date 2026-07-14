import { arrayMoveImmutable } from 'array-move';
import { interactionIcons } from 'fleximple-components/components/icons';

import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

export const DragHandle = ({ listeners, attributes }) => {
	return (
		<div
			className="fleximple-components-sortable-control__drag-handle"
			{...listeners}
			{...attributes}
		>
			<Icon icon={interactionIcons.dragHandle} />
		</div>
	);
};

export const getHelpText = (attribute, state) => {
	switch (attribute) {
		case 'additional':
			return state === 'hidden'
				? __('Display additional content', 'fleximple-blocks-recent-posts')
				: __('Hide additional content', 'fleximple-blocks-recent-posts');
		case 'audio':
			return state === 'hidden'
				? __('Display audio', 'fleximple-blocks-recent-posts')
				: __('Hide audio', 'fleximple-blocks-recent-posts');
		case 'author':
			return state === 'hidden'
				? __('Display author', 'fleximple-blocks-recent-posts')
				: __('Hide author', 'fleximple-blocks-recent-posts');
		case 'categories':
			return state === 'hidden'
				? __('Display categories', 'fleximple-blocks-recent-posts')
				: __('Hide categories', 'fleximple-blocks-recent-posts');
		case 'comments':
			return state === 'hidden'
				? __('Display comments', 'fleximple-blocks-recent-posts')
				: __('Hide comments', 'fleximple-blocks-recent-posts');
		case 'content':
			return state === 'hidden'
				? __('Display content', 'fleximple-blocks-recent-posts')
				: __('Hide content', 'fleximple-blocks-recent-posts');
		case 'date':
			return state === 'hidden'
				? __('Display date', 'fleximple-blocks-recent-posts')
				: __('Hide date', 'fleximple-blocks-recent-posts');
		case 'excerpt':
			return state === 'hidden'
				? __('Display excerpt', 'fleximple-blocks-recent-posts')
				: __('Hide excerpt', 'fleximple-blocks-recent-posts');
		case 'extraArticles':
			return state === 'hidden'
				? __('Display extra articles', 'fleximple-blocks-recent-posts')
				: __('Hide extra articles', 'fleximple-blocks-recent-posts');
		case 'featuredImage':
			return state === 'hidden'
				? __('Display featured image', 'fleximple-blocks-recent-posts')
				: __('Hide featured image', 'fleximple-blocks-recent-posts');
		case 'heading':
			return state === 'hidden'
				? __('Display heading', 'fleximple-blocks-recent-posts')
				: __('Hide heading', 'fleximple-blocks-recent-posts');
		case 'icon':
			return state === 'hidden'
				? __('Display icon', 'fleximple-blocks-recent-posts')
				: __('Hide icon', 'fleximple-blocks-recent-posts');
		case 'media':
			return state === 'hidden'
				? __('Display media', 'fleximple-blocks-recent-posts')
				: __('Hide media', 'fleximple-blocks-recent-posts');
		case 'meta':
			return state === 'hidden'
				? __('Display meta', 'fleximple-blocks-recent-posts')
				: __('Hide meta', 'fleximple-blocks-recent-posts');
		case 'quote':
			return state === 'hidden'
				? __('Display quote', 'fleximple-blocks-recent-posts')
				: __('Hide quote', 'fleximple-blocks-recent-posts');
		case 'readMore':
			return state === 'hidden'
				? __('Display read more', 'fleximple-blocks-recent-posts')
				: __('Hide read more', 'fleximple-blocks-recent-posts');
		case 'reference':
			return state === 'hidden'
				? __('Display reference', 'fleximple-blocks-recent-posts')
				: __('Hide reference', 'fleximple-blocks-recent-posts');
		case 'subhead':
			return state === 'hidden'
				? __('Display subhead', 'fleximple-blocks-recent-posts')
				: __('Hide subhead', 'fleximple-blocks-recent-posts');
		case 'title':
			return state === 'hidden'
				? __('Display title', 'fleximple-blocks-recent-posts')
				: __('Hide title', 'fleximple-blocks-recent-posts');
	}
};

export const getLabel = (attribute) => {
	switch (attribute) {
		case 'additional':
			return __('Additional content', 'fleximple-blocks-recent-posts');
		case 'author':
			return __('Author', 'fleximple-blocks-recent-posts');
		case 'audio':
			return __('Audio', 'fleximple-blocks-recent-posts');
		case 'categories':
			return __('Categories', 'fleximple-blocks-recent-posts');
		case 'comments':
			return __('Comments', 'fleximple-blocks-recent-posts');
		case 'content':
			return __('Content', 'fleximple-blocks-recent-posts');
		case 'date':
			return __('Date', 'fleximple-blocks-recent-posts');
		case 'excerpt':
			return __('Excerpt', 'fleximple-blocks-recent-posts');
		case 'extraArticles':
			return __('Extra articles', 'fleximple-blocks-recent-posts');
		case 'featuredImage':
			return __('Featured image', 'fleximple-blocks-recent-posts');
		case 'heading':
			return __('Heading', 'fleximple-blocks-recent-posts');
		case 'icon':
			return __('Icon', 'fleximple-blocks-recent-posts');
		case 'media':
			return __('Media', 'fleximple-blocks-recent-posts');
		case 'meta':
			return __('Meta', 'fleximple-blocks-recent-posts');
		case 'quote':
			return __('Quote', 'fleximple-blocks-recent-posts');
		case 'readMore':
			return __('Read more', 'fleximple-blocks-recent-posts');
		case 'reference':
			return __('Reference', 'fleximple-blocks-recent-posts');
		case 'subhead':
			return __('Subhead', 'fleximple-blocks-recent-posts');
		case 'title':
			return __('Title', 'fleximple-blocks-recent-posts');
	}
};

export const getState = (attribute, attributes) => {
	const displayAttribute = `display${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`;
	return attributes[displayAttribute];
};

export const toggleAttribute = (attribute, attributes, setAttributes) => {
	const displayAttribute = `display${attribute.charAt(0).toUpperCase()}${attribute.slice(1)}`;
	setAttributes({ [displayAttribute]: !attributes[displayAttribute] });
};

export const onSortStart = () => {
	document.body.setAttribute('style', 'cursor:grabbing');
};

export const onSortEnd = (event, items, attributeName, attribute, setAttributes) => {
	document.body.removeAttribute('style');
	const { active, over } = event;
	if (!over || active.id === over.id) return;

	const oldIndex = items.indexOf(active.id);
	const newIndex = items.indexOf(over.id);
	if (oldIndex === -1 || newIndex === -1) return;

	const order = arrayMoveImmutable(attribute, oldIndex, newIndex);
	setAttributes({ [attributeName]: order });
};
