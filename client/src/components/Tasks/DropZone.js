import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import './TaskGrid.css';

const DropZone = ({ id, active, title, icon, position }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    if (!active) return null;

    return (
        <div
            ref={setNodeRef}
            className={`drop-zone drop-zone-${position} ${isOver ? 'is-over' : ''}`}
        >
            <div className="drop-zone-content">
                <span className="drop-zone-icon">{icon}</span>
                <span className="drop-zone-title">{title}</span>
            </div>
        </div>
    );
};

export default DropZone;
