import { memo, useCallback } from '@wordpress/element';
import { Button } from '@wordpress/components';

import SortableGroup, { DragHandle } from './sortable-group';
import {
	getHelpText,
	getLabel,
	getState,
	onSortStart,
	onSortEnd,
	toggleAttribute,
} from './sortable-control';

const SortableRow = memo(({ value, isVisible, onToggle, dragHandleProps }) => {
	const label = getLabel(value);
	const icon = isVisible ? 'visibility' : 'hidden';
	const text = getHelpText(value, isVisible ? 'visible' : 'hidden');

	return (
		<div className="fleximple-components-sortable-control__item">
			<DragHandle {...dragHandleProps} />
			<div className="fleximple-components-sortable-control__label">{label}</div>
			<Button
				icon={icon}
				label={text}
				className="fleximple-components-sortable-control__button"
				onClick={onToggle}
			/>
		</div>
	);
});

const NESTED_LIST_ATTR = {
	media: 'orderMedia',
	content: 'orderContent',
	meta: 'orderMeta',
};

function PostSortableControl({ attributes, attributes: { orderArticle }, setAttributes }) {
	const handleToggle = useCallback(
		(value) => toggleAttribute(value, attributes, setAttributes),
		[attributes, setAttributes]
	);

	return (
		<div className="fleximple-components-sortable-control">
			<SortableGroup
				items={orderArticle}
				onSortStart={onSortStart}
				onSortEnd={(event, items) =>
					onSortEnd(event, items, 'orderArticle', orderArticle, setAttributes)
				}
				className="fleximple-components-sortable-control__sortable-list"
				renderItem={(value) =>
					({ dragHandleProps }) => {
						const nestedAttr = NESTED_LIST_ATTR[value];
						return {
							content: (
								<SortableRow
									value={value}
									isVisible={!!getState(value, attributes)}
									onToggle={() => handleToggle(value)}
									dragHandleProps={dragHandleProps}
								/>
							),
							nested: nestedAttr && (
								<SortableGroup
									items={attributes[nestedAttr]}
									onSortStart={onSortStart}
									onSortEnd={(event, items) =>
										onSortEnd(event, items, nestedAttr, attributes[nestedAttr], setAttributes)
									}
									className="fleximple-components-sortable-control__sortable-list"
									renderItem={(nestedValue) =>
										({ dragHandleProps: nestedDragHandleProps }) => ({
											content: (
												<SortableRow
													value={nestedValue}
													isVisible={!!getState(nestedValue, attributes)}
													onToggle={() => handleToggle(nestedValue)}
													dragHandleProps={nestedDragHandleProps}
												/>
											),
											nested: null,
										})}
								/>
							),
						};
					}}
			/>
		</div>
	);
}

export default PostSortableControl;
