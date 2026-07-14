import { useState } from '@wordpress/element';
import {
	DndContext,
	DragOverlay,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { DragHandle } from './sortable-control';

function SortableItem({ id, renderItem }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		visibility: isDragging ? 'hidden' : 'visible',
	};

	const { content, nested } = renderItem({ dragHandleProps: { listeners, attributes } });

	return (
		<div ref={setNodeRef} style={style}>
			{content}
			{nested}
		</div>
	);
}

export default function SortableGroup({ items, onSortStart, onSortEnd, className, renderItem }) {
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
	const [activeId, setActiveId] = useState(null);

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragStart={(event) => {
				setActiveId(event.active.id);
				onSortStart?.(event);
			}}
			onDragEnd={(event) => {
				setActiveId(null);
				onSortEnd(event, items);
			}}
			onDragCancel={() => setActiveId(null)}
		>
			<SortableContext items={items} strategy={verticalListSortingStrategy}>
				<div className={className}>
					{items.map((id) => (
						<SortableItem key={id} id={id} renderItem={renderItem(id)} />
					))}
				</div>
			</SortableContext>
			<DragOverlay>
				{activeId ? (
					<div className="fleximple-components-sortable-control__helper">
						{renderItem(activeId)({ dragHandleProps: { listeners: {}, attributes: {} } }).content}
					</div>
				) : null}
			</DragOverlay>
		</DndContext>
	);
}

export { DragHandle };
