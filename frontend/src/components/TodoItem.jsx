import React, { useState } from 'react';
import {
  Check,
  Circle,
  CheckCircle2,
  Edit2,
  Trash2,
  X,
  Save,
  Calendar,
} from 'lucide-react';

export default function TodoItem({ todo, onToggleComplete, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description || '');
  const [editError, setEditError] = useState('');

  const handleSave = () => {
    const trimmedTitle = editTitle.trim();
    if (!trimmedTitle) {
      setEditError('Title cannot be empty');
      return;
    }
    setEditError('');
    onUpdate(todo.id, {
      title: trimmedTitle,
      description: editDesc.trim(),
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDesc(todo.description || '');
    setEditError('');
    setIsEditing(false);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="todo-edit-mode">
          <input
            type="text"
            className="todo-input-title edit-mode-input"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              if (editError) setEditError('');
            }}
            placeholder="Task title"
            autoFocus
          />
          <textarea
            className="todo-input-desc edit-mode-textarea"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Task description (optional)"
            rows={2}
          />
          {editError && <p className="form-error-msg">{editError}</p>}
          <div className="todo-edit-actions">
            <button
              type="button"
              className="btn-save"
              onClick={handleSave}
              title="Save changes"
            >
              <Save size={16} /> Save
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={handleCancel}
              title="Cancel"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="todo-view-mode">
          <button
            type="button"
            className="btn-toggle-status"
            onClick={() => onToggleComplete(todo.id, !todo.completed)}
            title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed ? (
              <CheckCircle2 className="icon-completed" size={22} />
            ) : (
              <Circle className="icon-incomplete" size={22} />
            )}
          </button>

          <div className="todo-content">
            <h3 className="todo-title">{todo.title}</h3>
            {todo.description && (
              <p className="todo-description">{todo.description}</p>
            )}
            <div className="todo-meta">
              <span className="todo-date">
                <Calendar size={13} />
                {formatDate(todo.created_at)}
              </span>
              <span className={`status-badge ${todo.completed ? 'badge-done' : 'badge-pending'}`}>
                {todo.completed ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>

          <div className="todo-actions">
            <button
              type="button"
              className="btn-action btn-edit"
              onClick={() => setIsEditing(true)}
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              type="button"
              className="btn-action btn-delete"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
                  onDelete(todo.id);
                }
              }}
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
