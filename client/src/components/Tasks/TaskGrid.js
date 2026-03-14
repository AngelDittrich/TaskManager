import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    closestCenter,
} from '@dnd-kit/core';
import DropZone from './DropZone';
import TaskCard from './TaskCard';
import './TaskGrid.css';

// Hardcoded offset to compensate for the sidebar + layout margin-left
// The sidebar is 260px wide plus padding (~20px), total ~280px.
const OVERLAY_OFFSET_X = -280;

const TaskGrid = ({ tasks, onEdit, onDelete, onStatusChange }) => {
    const [activeTask, setActiveTask] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        const task = tasks.find((t) => t._id === active.id);
        setActiveTask(task);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over) {
            if (over.id === 'delete-zone') {
                onDelete(active.id);
            } else if (over.id === 'progress-zone') {
                onStatusChange(active.id, 'en-progreso');
            } else if (over.id === 'complete-zone') {
                onStatusChange(active.id, 'completada');
            }
            // 'cancel-zone' and no drop → do nothing
        }
        setActiveTask(null);
    };

    const isDragging = activeTask !== null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Drop Zones — portalled directly to body for correct viewport coords */}
            {createPortal(
                <div className={`drop-zones-container ${isDragging ? 'dragging' : ''}`}>
                    <DropZone
                        id="delete-zone"
                        position="top"
                        active={isDragging}
                        title="Delete"
                        icon="🗑"
                    />
                    <DropZone
                        id="progress-zone"
                        position="left"
                        active={isDragging}
                        title="In Progress"
                        icon="⏳"
                    />
                    <DropZone
                        id="complete-zone"
                        position="right"
                        active={isDragging}
                        title="Complete"
                        icon="✔"
                    />
                    <DropZone
                        id="cancel-zone"
                        position="center"
                        active={isDragging}
                        title="Cancel"
                        icon="✕"
                    />
                </div>,
                document.body
            )}

            <div className="task-grid-container">
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    // translateX offset compensates the sidebar margin-left
                    // so the overlay card appears under the cursor, not shifted right
                    <div style={{ transform: `translateX(${OVERLAY_OFFSET_X}px)` }}>
                        <TaskCard
                            task={activeTask}
                            onEdit={() => { }}
                            onDelete={() => { }}
                            isOverlay
                        />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default TaskGrid;
