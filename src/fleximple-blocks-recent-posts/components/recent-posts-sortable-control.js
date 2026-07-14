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

const NESTED_LIST_ATTR = {
	media: 'orderMedia',
	content: 'orderContent',
	meta: 'orderMeta',
};

export default function RecentPostsSortableControl({
	attributes,
	attributes: { orderArticle, orderContent, orderMedia, orderMeta },
	setAttributes,
}) {
	const nestedItems = { orderMedia, orderContent, orderMeta };

	const SortableRow = ({ value, dragHandleProps }) => {
		const label = getLabel(value);
		let icon = 'hidden';
		let text = getHelpText(value, 'hidden');

		if (getState(value, attributes)) {
			icon = 'visibility';
			text = getHelpText(value, 'visible');
		}

		return (
			<div className="fleximple-components-sortable-control__item">
				<DragHandle {...dragHandleProps} />
				<div className="fleximple-components-sortable-control__label">{label}</div>
				<Button
					icon={icon}
					label={text}
					className="fleximple-components-sortable-control__button"
					onClick={() => toggleAttribute(value, attributes, setAttributes)}
				/>
			</div>
		);
	};

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
						if (!nestedAttr) return <SortableRow value={value} dragHandleProps={dragHandleProps} />;

						const items = nestedItems[nestedAttr];
						return (
							<>
								<SortableRow value={value} dragHandleProps={dragHandleProps} />
								<SortableGroup
									items={items}
									onSortStart={onSortStart}
									onSortEnd={(event, evItems) =>
										onSortEnd(event, evItems, nestedAttr, items, setAttributes)
									}
									className="fleximple-components-sortable-control__sortable-list"
									renderItem={(nestedValue) =>
										({ dragHandleProps: nestedDragHandleProps }) => (
											<SortableRow value={nestedValue} dragHandleProps={nestedDragHandleProps} />
										)}
								/>
							</>
						);
					}}
			/>
		</div>
	);
}
