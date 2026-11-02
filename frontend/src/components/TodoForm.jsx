import React, { useState } from 'react';
import { PlusCircle, AlignLeft } from 'lucide-react';

export default function TodoForm({ onAdd, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Task title cannot be empty.');
      return;
    }
    setError('');
    onAdd({
      title: trimmedTitle,
      description: description.trim(),
    });
    setTitle('');
    setDescription('');
    setShowDescription(false);
  };

  return (
    <form className="todo-form-card" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="todo-input-title"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          disabled={isSubmitting}
        />
        <button
          type="button"
          className={`btn-icon-toggle ${showDescription ? 'active' : ''}`}
          onClick={() => setShowDescription(!showDescription)}
          title={showDescription ? 'Hide description' : 'Add description'}
          disabled={isSubmitting}
        >
          <AlignLeft size={18} />
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting || !title.trim()}
        >
          <PlusCircle size={18} />
          <span>{isSubmitting ? 'Adding...' : 'Add Task'}</span>
        </button>
      </div>

      {showDescription && (
        <div className="description-container">
          <textarea
            className="todo-input-desc"
            placeholder="Add optional notes or description..."
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      )}

      {error && <p className="form-error-msg">{error}</p>}
    </form>
  );
}
