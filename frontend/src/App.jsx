import React, { useState, useEffect, useCallback } from 'react';
import { todoService } from './services/api';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { CheckSquare, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import './App.css';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to extract descriptive error messages from API or network errors
  const extractErrorMessage = (err, fallbackMessage) => {
    if (err.response?.data) {
      const data = err.response.data;
      if (typeof data === 'string') return data;
      if (data.detail) return data.detail;
      // Handle Django REST Framework serializer validation dicts (e.g. { title: ["..."] })
      if (typeof data === 'object') {
        const errorList = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
          .join(' | ');
        if (errorList) return errorList;
      }
    }
    return err.message || fallbackMessage;
  };

  // Fetch all tasks from Django REST API
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await todoService.getAll();
      setTodos(data);
    } catch (err) {
      console.error('Failed to load todos:', err);
      setError(
        extractErrorMessage(
          err,
          'Failed to connect to the backend server. Make sure Django is running on http://localhost:8000.'
        )
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // Create a new todo
  const handleAddTodo = async (todoData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newTodo = await todoService.create(todoData);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      console.error('Failed to create todo:', err);
      setError(extractErrorMessage(err, 'Failed to create task. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle complete status
  const handleToggleComplete = async (id, completed) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed } : item))
    );
    try {
      await todoService.partialUpdate(id, { completed });
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(extractErrorMessage(err, 'Could not update status on server. Reverting...'));
      fetchTodos();
    }
  };

  // Update title & description
  const handleUpdateTodo = async (id, updatedFields) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
    try {
      const updated = await todoService.partialUpdate(id, updatedFields);
      setTodos((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
    } catch (err) {
      console.error('Failed to update todo:', err);
      setError(extractErrorMessage(err, 'Failed to update task.'));
      fetchTodos();
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    // Optimistic removal
    setTodos((prev) => prev.filter((item) => item.id !== id));
    try {
      await todoService.delete(id);
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError(extractErrorMessage(err, 'Failed to delete task. Reverting...'));
      fetchTodos();
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <CheckSquare size={28} />
          </div>
          <div>
            <h1>TaskMaster</h1>
            <p className="subtitle">React + Django REST + PostgreSQL</p>
          </div>
        </div>
        <button
          className="btn-refresh"
          onClick={fetchTodos}
          title="Refresh tasks"
          disabled={loading}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </header>

      {error && (
        <div className="alert-banner">
          <AlertCircle size={20} className="alert-icon" />
          <div className="alert-content">
            <p>{error}</p>
          </div>
          <button
            type="button"
            className="alert-close"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      <main className="app-main">
        <TodoForm onAdd={handleAddTodo} isSubmitting={isSubmitting} />

        {loading && todos.length === 0 ? (
          <div className="loading-state">
            <Loader2 size={36} className="animate-spin" />
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleComplete={handleToggleComplete}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Simple To-Do Application &bull; Full CRUD Operations</p>
      </footer>
    </div>
  );
}
