import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {
    
    const finishColor = task.finish === 'Yes' ? 'text-success' : 'text-danger';

    return (
        <div className="task-card">
            <div className="task-header">{task.title}</div>
            <div className="task-detail">마감일: {task.dueDay}</div>
            <div className="task-detail">내용: {task.detail}</div>
            <div className={`task-detail ${finishColor}`}>완료: {task.finish}</div>
            <div className="task-detail">우선순위: {task.priority}</div>
            <div className="task-detail">카테고리: {task.category}</div>
            <button className="btn btn-primary btn-sm" onClick={() => onEdit(task.id)} style={{ marginRight: '5px' }}>Modify</button>
            <button className="btn btn-danger btn-sm" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
    );
};

export default TaskCard;