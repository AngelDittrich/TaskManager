import React, { useState } from 'react';
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
            {/* Drop Zones container overlaid on top */}
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
            </div>

            <div className="task-grid-container">
                {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
                ))}
            </div>

            <DragOverlay>
                {activeTask ? (
                    <TaskCard task={activeTask} onEdit={() => { }} onDelete={() => { }} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default TaskGrid;
