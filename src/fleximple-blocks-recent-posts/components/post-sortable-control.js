import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { Fragment, memo, useCallback } from '@wordpress/element';
import { Button } from '@wordpress/components';

import {
	DragHandle,
	getHelpText,
	getLabel,
	getState,
	onSortStart,
	onSortEnd,
	toggleAttribute,
} from './sortable-control';

const SortableItem = SortableElement(
	memo(({ value, isVisible, onToggle }) => {
		const label = getLabel(value);
		const icon = isVisible ? 'visibility' : 'hidden';
		const text = getHelpText(value, isVisible ? 'visible' : 'hidden');

		return (
			<div className="fleximple-components-sortable-control__item">
				<DragHandle />
				<div className="fleximple-components-sortable-control__label">{label}</div>
				<Button
					icon={icon}
					label={text}
					className="fleximple-components-sortable-control__button"
					onClick={onToggle}
				/>
			</div>
		);
	})
);

const NESTED_LIST_ATTR = {
	media: 'orderMedia',
	content: 'orderContent',
	meta: 'orderMeta',
};

const SortableList = SortableContainer(({ items, attributes, setAttributes }) => {
	const handleToggle = useCallback(
		(value) => toggleAttribute(value, attributes, setAttributes),
		[attributes, setAttributes]
	);

	return (
		<div className="fleximple-components-sortable-control__sortable-list">
			{items.map((value, index) => {
				const nestedAttr = NESTED_LIST_ATTR[value];
				return (
					<Fragment key={`item-${index}`}>
						<SortableItem
							index={index}
							value={value}
							isVisible={!!getState(value, attributes)}
							onToggle={() => handleToggle(value)}
						/>
						{nestedAttr && (
							<SortableList
								items={attributes[nestedAttr]}
								onSortStart={onSortStart}
								onSortEnd={(sortEnd, e) =>
									onSortEnd(sortEnd, e, nestedAttr, attributes[nestedAttr], setAttributes)
								}
								useDragHandle
								helperClass="fleximple-components-sortable-control__helper"
								attributes={attributes}
								setAttributes={setAttributes}
							/>
						)}
					</Fragment>
				);
			})}
		</div>
	);
});

function PostSortableControl({ attributes, attributes: { orderArticle }, setAttributes }) {
	return (
		<div className="fleximple-components-sortable-control">
			<SortableList
				items={orderArticle}
				onSortStart={onSortStart}
				onSortEnd={(sortEnd, e) =>
					onSortEnd(sortEnd, e, 'orderArticle', orderArticle, setAttributes)
				}
				useDragHandle
				helperClass="fleximple-components-sortable-control__helper"
				attributes={attributes}
				setAttributes={setAttributes}
			/>
		</div>
	);
}

export default PostSortableControl;
