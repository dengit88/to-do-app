# 📝 Full-Stack To-Do Application (React + Django + PostgreSQL)

A full-stack, responsive To-Do application built with a **React** (Vite) frontend, **Django REST Framework** backend, and **PostgreSQL** database, supporting complete CRUD (Create, Read, Update, Delete) operations.

---

## 📁 Project Architecture & Folder Structure

```text
to-do-app/
├── backend/                       # Django REST API application
│   ├── manage.py                  # Django CLI entrypoint
│   ├── requirements.txt           # Python dependencies & versions
│   ├── .env.example               # Environment variables template
│   ├── .gitignore
│   ├── todo_project/              # Core project configuration
│   │   ├── __init__.py
│   │   ├── settings.py            # Django settings (PostgreSQL & CORS configured)
│   │   ├── urls.py                # Main URL routing
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── todos/                     # To-Do feature application
│       ├── __init__.py
│       ├── admin.py               # Django Admin configuration
│       ├── apps.py
│       ├── models.py              # Todo database model
│       ├── serializers.py         # DRF Serializers
│       ├── views.py               # TodoViewSet (CRUD endpoints)
│       ├── urls.py                # App URL routing (/api/todos/)
│       └── migrations/            # Database schema migrations
│           ├── __init__.py
│           └── 0001_initial.py
│
├── frontend/                      # React SPA (Vite)
│   ├── package.json               # Node dependencies & scripts
│   ├── vite.config.js             # Vite build & dev server config
│   ├── index.html                 # Single Page Application HTML template
│   ├── .env.example               # Frontend environment template
│   ├── .gitignore
│   └── src/
│       ├── main.jsx               # React DOM root entry point
│       ├── App.jsx                # Core application component & state
│       ├── index.css              # Global styles & design tokens
│       ├── App.css                # Component styling & responsiveness
│       ├── services/
│       │   └── api.js             # Axios HTTP client configured for Django REST API
│       └── components/
│           ├── TodoForm.jsx       # Input form for adding tasks
│           ├── TodoItem.jsx       # Single task row with toggle, edit & delete
│           └── TodoList.jsx       # List container with search & status filters
│
└── README.md                      # Complete documentation & setup instructions
```

---

## 🛠️ Technologies & Versions Used

### 1. Frontend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` (LTS recommended) | JavaScript runtime environment |
| **React** | `^18.3.1` | Component-based UI library |
| **React DOM** | `^18.3.1` | DOM renderer for React |
| **Vite** | `^5.4.10` | Next-generation frontend build tool & dev server |
| **Axios** | `^1.7.7` | Promise-based HTTP client for API requests |
| **Lucide React** | `^0.453.0` | Modern, lightweight UI icons |

### 2. Backend
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Python** | `>= 3.10.0` | Core programming language |
| **Django** | `5.1.x` (`>= 5.1.0, < 5.2.0`) | High-level Python Web framework |
| **Django REST Framework** | `3.15.x` (`>= 3.15.0, < 3.16.0`) | Toolkit for building Web APIs |
| **django-cors-headers** | `4.4.x` (`>= 4.4.0, < 4.5.0`) | Cross-Origin Resource Sharing (CORS) handler |
| **psycopg2-binary** | `^2.9.9` | PostgreSQL database adapter for Python |
| **python-dotenv** | `^1.0.1` | Reads key-value pairs from `.env` into environment |

### 3. Database
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **PostgreSQL** | `15.x / 16.x` | Relational database system |

---

## 🔄 CRUD Operations & API Endpoints

The backend exposes a full RESTful interface under `/api/todos/`:

| Operation | HTTP Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- | :--- |
| **Create** | `POST` | `/api/todos/` | Add a new to-do task | `{"title": "Buy groceries", "description": "Milk, eggs, bread"}` |
| **Read (All)** | `GET` | `/api/todos/` | List all tasks (supports query filtering) | *None* |
| **Read (Single)**| `GET` | `/api/todos/{id}/` | Get details of a single task | *None* |
| **Update (Full)**| `PUT` | `/api/todos/{id}/` | Overwrite entire task | `{"title": "Updated", "description": "Notes", "completed": true}` |
| **Update (Partial)**| `PATCH` | `/api/todos/{id}/` | Toggle status or edit fields | `{"completed": true}` |
| **Delete** | `DELETE` | `/api/todos/{id}/` | Remove a task permanently | *None* |

### Query Parameters Supported by `GET /api/todos/`:
- `?completed=true` or `?completed=false` - Filter by completion state
- `?search=query` - Filter by title text

---

## 🐳 Quick Start with Docker Compose (Recommended)

Run the entire full-stack application (PostgreSQL, Django, and React) with a single command:

```bash
docker compose up --build
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Django REST API:** [http://localhost:8000/api/todos/](http://localhost:8000/api/todos/)
- **Django Admin:** [http://localhost:8000/admin/](http://localhost:8000/admin/)
- **PostgreSQL Database:** `localhost:5432` (`db: todo_db`, `user: postgres`, `password: postgres`)

To stop all services:
```bash
docker compose down
```

To stop services and remove database volumes:
```bash
docker compose down -v
```

---

## 🚀 Step-by-Step Manual Setup Guide

### Step 1: PostgreSQL Database Setup

1. Start your PostgreSQL server (using pgAdmin, terminal, or Docker).
2. Create a new database named `todo_db`:
   ```sql
   CREATE DATABASE todo_db;
   ```
3. Ensure a user exists with privileges (default is usually `postgres` with password `postgres` or your custom password).

---

### Step 2: Backend Setup (Django)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows:**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your `.env` file from `.env.example`:
   - On Windows:
     ```powershell
     copy .env.example .env
     ```
   - On Linux/macOS:
     ```bash
     cp .env.example .env
     ```
   - Update database credentials in `.env` if your PostgreSQL username/password/host/port differs:
     ```env
     DB_NAME=todo_db
     DB_USER=postgres
     DB_PASSWORD=your_postgres_password
     DB_HOST=localhost
     DB_PORT=5432
     ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. *(Optional)* Create a superuser to access the Django admin panel:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   *The backend will be live at: [http://localhost:8000](http://localhost:8000)*
   *Django Admin is available at: [http://localhost:8000/admin/](http://localhost:8000/admin/)*
   *API Root is available at: [http://localhost:8000/api/todos/](http://localhost:8000/api/todos/)*

---

### Step 3: Frontend Setup (React)

1. Open a new terminal window and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Create your `.env` file from `.env.example`:
   - On Windows:
     ```powershell
     copy .env.example .env
     ```
   - On Linux/macOS:
     ```bash
     cp .env.example .env
     ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend will run at: [http://localhost:5173](http://localhost:5173)*

---

## 💡 Frontend Features Included

- **Task Creation**: Add tasks with title and optional multi-line notes.
- **Task Status Toggle**: Instant click-to-complete with optimistic UI updates.
- **Inline Editing**: Edit title and description inline without leaving the list.
- **Task Deletion**: Delete items with prompt confirmation.
- **Search & Filtering**:
  - Instant client-side search by title or description notes.
  - Filter tabs: **All**, **Active**, and **Done** with dynamic counters.
- **Error Handling**: Displays informative banner if backend server is unreachable.
- **Modern Responsive Design**: Clean typography, card layouts, smooth transitions, and mobile-friendly styling.
