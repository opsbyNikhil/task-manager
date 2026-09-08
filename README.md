# Task Manager

A full-stack **Task Management Application** built with **React** and **Django REST Framework**.

The application allows users to authenticate using JWT and manage their tasks through a simple React frontend connected to a Django REST API.

---

## 🚀 Tech Stack

### Frontend

* React
* Vite
* Axios
* JavaScript
* CSS

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT
* Django CORS Headers

### Database

* SQLite for local development

---

## 📁 Project Structure

```text
task-manager/
│
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── Login.jsx
│   │   └── ...
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── tasks/
│   ├── manage.py
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   └── ...
│
└── README.md
```

---

## ✨ Features

* User authentication
* JWT access-token authentication
* Login functionality
* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Mark tasks as completed
* Protected API endpoints
* React frontend connected to Django API
* Environment-based configuration
* CORS configuration

---

# 🔐 Authentication

The application uses **JWT authentication**.

After successful login, the access token is stored in the browser's local storage:

```text
localStorage
└── access_token
```

Axios automatically attaches the JWT token to API requests:

```text
Authorization: Bearer <access_token>
```

Protected API requests therefore require authentication.

---

# 🔗 API Configuration

The React frontend gets the Django API URL from an environment variable.

### Frontend `.env.example`

```env
VITE_API_URL=http://localhost:8000/api
```

The Axios configuration uses:

```javascript
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL
});
```

This allows the API URL to be changed without modifying the React source code.

---

# ⚙️ Backend Environment Variables

The Django backend uses environment variables for configuration.

### Backend `.env.example`

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

The actual `.env` file should contain the real secret key.

> Never commit the actual `.env` file or production secrets to Git.

---

# 🛠️ Local Development Setup

## 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

---

# 🐍 Backend Setup

## 2. Open the Backend Directory

```bash
cd backend
```

## 3. Create a Virtual Environment

### Windows

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 4. Install Dependencies

```bash
pip install -r requirements.txt
```

If `python-dotenv` is not already included:

```bash
pip install python-dotenv
```

---

## 5. Create Backend `.env`

Create:

```text
backend/.env
```

Example:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 6. Run Database Migrations

```bash
python manage.py migrate
```

---

## 7. Create a Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an administrator account.

---

## 8. Start Django Server

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://localhost:8000/
```

---

# ⚛️ Frontend Setup

Open another terminal.

## 9. Open Frontend Directory

```bash
cd frontend
```

## 10. Install Dependencies

```bash
npm install
```

---

## 11. Create Frontend `.env`

Create:

```text
frontend/.env
```

Add:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## 12. Start React Development Server

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173/
```

---

# 🔄 Application Flow

```text
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │ localhost:5173      │
                 └──────────┬──────────┘
                            │
                            │ Axios
                            │ JWT
                            ▼
                 ┌─────────────────────┐
                 │   Django REST API   │
                 │ localhost:8000      │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │       SQLite        │
                 │     Database        │
                 └─────────────────────┘
```

---

# 📡 API Endpoints

The application exposes task-management APIs under:

```text
/api/tasks/
```

### Authentication

JWT authentication is used for protected API requests.

Example:

```http
Authorization: Bearer <access_token>
```

### Tasks

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | `/api/tasks/`      | Get all tasks           |
| POST   | `/api/tasks/`      | Create a task           |
| GET    | `/api/tasks/<id>/` | Get a specific task     |
| PUT    | `/api/tasks/<id>/` | Update a task           |
| PATCH  | `/api/tasks/<id>/` | Partially update a task |
| DELETE | `/api/tasks/<id>/` | Delete a task           |

---

# 📝 Task Example

A task contains information such as:

```json
{
    "title": "Learn Kubernetes Advanced",
    "description": "Practice Deployments, Services and Ingress",
    "completed": true
}
```

---

# 🔒 Security

The following files should not be committed to Git:

```text
.env
.env.local
```

Example `.gitignore`:

```gitignore
.env
.env.local
venv/
__pycache__/
*.pyc
db.sqlite3
node_modules/
dist/
```

The `.env.example` files can be committed because they contain placeholder values rather than actual secrets.

---

# 🧪 Testing the API

Start the Django server:

```bash
python manage.py runserver
```

Then access:

```text
http://localhost:8000/api/tasks/
```

Protected endpoints require a valid JWT access token.

---

# 🖥️ Running the Complete Application

You need two terminals.

### Terminal 1 — Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

### Terminal 2 — Frontend

```powershell
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173/
```

---

# 📌 Current Project Status

| Task                          | Status         |
| ----------------------------- | -------------- |
| Build Django REST API         | ✅ Completed    |
| JWT Authentication            | ✅ Completed    |
| React Frontend                | ✅ Completed    |
| Connect React with Django API | ✅ Completed    |
| Task CRUD Operations          | ✅ Completed    |
| Edit Task                     | ✅ Completed    |
| Delete Task                   | ✅ Completed    |
| Delete Confirmation           | ✅ Completed    |
| Frontend `.env` configuration | ✅ Completed    |
| Backend `.env` configuration  | 🔄 In Progress |
| Docker Containerization       | ⏳ Pending      |
| Kubernetes Deployment         | ⏳ Pending      |

---

# 🔮 Future Improvements

Possible future enhancements:

* PostgreSQL database
* Docker containerization
* Docker Compose
* Kubernetes deployment
* Refresh-token handling
* User-specific task ownership
* Task filtering and searching
* Pagination
* Task priorities
* Due dates
* Production deployment
* CI/CD pipeline

---

# 👨‍💻 Author

**Nikhil**

---

## 📄 License

This project is intended for learning and development purposes.
