import React from 'react';
import TodoItem from './TodoItem';
import { Search, Inbox, CheckCircle2 } from 'lucide-react';

export default function TodoList({
  todos,
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  onToggleComplete,
  onUpdate,
  onDelete,
}) {
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;

  const filteredTodos = todos.filter((todo) => {
    // Tab filter
    if (filter === 'active' && todo.completed) return false;
    if (filter === 'completed' && !todo.completed) return false;
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(query);
      const matchesDesc = (todo.description || '').toLowerCase().includes(query);
      if (!matchesTitle && !matchesDesc) return false;
    }
    return true;
  });

  return (
    <div className="todo-list-wrapper">
      {/* Control bar: Search & Filters */}
      <div className="todo-controls">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
            >
              ×
            </button>
          )}
        </div>

        <div className="filter-tabs">
          <button
            type="button"
            className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All <span className="tab-badge">{totalCount}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => onFilterChange('active')}
          >
            Active <span className="tab-badge">{activeCount}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            Done <span className="tab-badge">{completedCount}</span>
          </button>
        </div>
      </div>

      {/* Todo Items */}
      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          {searchQuery ? (
            <>
              <Search size={42} className="empty-icon" />
              <h3>No matching tasks</h3>
              <p>Try adjusting your search query.</p>
            </>
          ) : filter === 'completed' ? (
            <>
              <CheckCircle2 size={42} className="empty-icon" />
              <h3>No completed tasks yet</h3>
              <p>Keep going! Finish your active tasks.</p>
            </>
          ) : (
            <>
              <Inbox size={42} className="empty-icon" />
              <h3>No tasks found</h3>
              <p>Add a new task above to get started!</p>
            </>
          )}
        </div>
      ) : (
        <ul className="todo-items-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
