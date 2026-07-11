import { SortableContainer, SortableElement } from 'react-sortable-hoc';
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

const SortableItem = SortableElement(({ value, attributes, setAttributes }) => {
	const label = getLabel(value);
	let icon = 'hidden';
	let text = getHelpText(value, 'hidden');

	if (getState(value, attributes)) {
		icon = 'visibility';
		text = getHelpText(value, 'visible');
	}

	return (
		<div className="fleximple-components-sortable-control__item">
			<DragHandle />
			<div className="fleximple-components-sortable-control__label">{label}</div>
			<Button
				icon={icon}
				label={text}
				className="fleximple-components-sortable-control__button"
				onClick={() => toggleAttribute(value, attributes, setAttributes)}
			/>
		</div>
	);
});

const SortableList = SortableContainer(({ items, attributes, setAttributes }) => {
	return (
		<div className="fleximple-components-sortable-control__sortable-list">
			{items.map((value, index) => {
				switch (value) {
					case 'media':
						return (
							<>
								<SortableItem
									key={`item-${index}`}
									index={index}
									value={value}
									attributes={attributes}
									setAttributes={setAttributes}
								/>
								<SortableList
									items={attributes.orderMedia}
									onSortStart={onSortStart}
									onSortEnd={(sortEnd, e) =>
										onSortEnd(sortEnd, e, 'orderMedia', attributes.orderMedia, setAttributes)
									}
									useDragHandle
									helperClass="fleximple-components-sortable-control__helper"
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</>
						);
					case 'content':
						return (
							<>
								<SortableItem
									key={`item-${index}`}
									index={index}
									value={value}
									attributes={attributes}
									setAttributes={setAttributes}
								/>
								<SortableList
									items={attributes.orderContent}
									onSortStart={onSortStart}
									onSortEnd={(sortEnd, e) =>
										onSortEnd(sortEnd, e, 'orderContent', attributes.orderContent, setAttributes)
									}
									useDragHandle
									helperClass="fleximple-components-sortable-control__helper"
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</>
						);
					case 'meta':
						return (
							<>
								<SortableItem
									key={`item-${index}`}
									index={index}
									value={value}
									attributes={attributes}
									setAttributes={setAttributes}
								/>
								<SortableList
									items={attributes.orderMeta}
									onSortStart={onSortStart}
									onSortEnd={(sortEnd, e) =>
										onSortEnd(sortEnd, e, 'orderMeta', attributes.orderMeta, setAttributes)
									}
									useDragHandle
									helperClass="fleximple-components-sortable-control__helper"
									attributes={attributes}
									setAttributes={setAttributes}
								/>
							</>
						);
				}
				return (
					<SortableItem
						key={`item-${index}`}
						index={index}
						value={value}
						attributes={attributes}
						setAttributes={setAttributes}
					/>
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
