import { useEffect, useState } from "react";

import api from "./api";

import Login from "./Login";
import LoginOTP from "./LoginOTP";
import Register from "./Register";
import RegisterOTP from "./RegisterOTP";

import "./App.css";

function App() {
  // =========================
  // AUTHENTICATION
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access_token"),
  );

  /*
   * Authentication screen:
   *
   * login
   * login-otp
   * register
   * register-otp
   */
  const [authScreen, setAuthScreen] = useState("login");

  // Email being used during OTP verification
  const [authEmail, setAuthEmail] = useState("");

  // =========================
  // LOGIN
  // =========================

  const handleLoginOTP = (email) => {
    setAuthEmail(email);
    setAuthScreen("login-otp");
  };

  // =========================
  // LOGIN SUCCESS
  // =========================

  const handleLogin = () => {
    setIsLoggedIn(true);
    setAuthScreen("login");
    setAuthEmail("");
  };

  // =========================
  // GO TO REGISTER
  // =========================

  const handleRegister = () => {
    setAuthScreen("register");
    setAuthEmail("");
  };

  // =========================
  // REGISTRATION OTP
  // =========================

  const handleRegisterOTP = (email) => {
    setAuthEmail(email);
    setAuthScreen("register-otp");
  };

  // =========================
  // REGISTRATION COMPLETE
  // =========================

  const handleRegistrationComplete = () => {
    setAuthEmail("");
    setAuthScreen("login");
  };

  // =========================
  // BACK TO LOGIN
  // =========================

  const handleBackToLogin = () => {
    setAuthEmail("");
    setAuthScreen("login");
  };

  // =========================
  // BACK TO REGISTER
  // =========================

  const handleBackToRegister = () => {
    setAuthEmail("");
    setAuthScreen("register");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setIsLoggedIn(false);
    setAuthEmail("");
    setAuthScreen("login");

    setTasks([]);
  };

  // =========================
  // TASK STATE
  // =========================

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Edit
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Delete
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  // Toast
  const [toast, setToast] = useState("");

  // =========================
  // FETCH TASKS
  // =========================

  useEffect(() => {
    if (isLoggedIn) {
      fetchTasks();
    }
  }, [isLoggedIn]);

  // =========================
  // TOAST
  // =========================

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  // =========================
  // GET TASKS
  // =========================

  const fetchTasks = () => {
    api
      .get("/tasks/")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  // =========================
  // ADD TASK
  // =========================

  const addTask = (event) => {
    event.preventDefault();

    const newTask = {
      title,
      description,
      completed: false,
    };

    api
      .post("/tasks/", newTask)
      .then((response) => {
        setTasks((previousTasks) => [response.data, ...previousTasks]);

        setTitle("");
        setDescription("");

        showToast("Task created successfully");
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  };

  // =========================
  // TOGGLE STATUS
  // =========================

  const toggleTaskStatus = (task) => {
    api
      .patch(`/tasks/${task.id}/`, {
        completed: !task.completed,
      })
      .then((response) => {
        setTasks((previousTasks) =>
          previousTasks.map((currentTask) =>
            currentTask.id === task.id ? response.data : currentTask,
          ),
        );

        showToast(task.completed ? "Task marked as pending" : "Task completed");
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  };

  // =========================
  // DELETE
  // =========================

  const openDeletePopup = (id) => {
    setDeleteTaskId(id);
  };

  const closeDeletePopup = () => {
    setDeleteTaskId(null);
  };

  const deleteTask = () => {
    api
      .delete(`/tasks/${deleteTaskId}/`)
      .then(() => {
        setTasks((previousTasks) =>
          previousTasks.filter((task) => task.id !== deleteTaskId),
        );

        setDeleteTaskId(null);

        showToast("Task deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  // =========================
  // EDIT
  // =========================

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = (id) => {
    const updatedTask = {
      title: editTitle,
      description: editDescription,
    };

    api
      .patch(`/tasks/${id}/`, updatedTask)
      .then((response) => {
        setTasks((previousTasks) =>
          previousTasks.map((task) => (task.id === id ? response.data : task)),
        );

        cancelEdit();

        showToast("Task updated successfully");
      })
      .catch((error) => {
        console.error("Error editing task:", error);
      });
  };

  // =========================
  // AUTHENTICATION SCREENS
  // =========================

  if (!isLoggedIn) {
    if (authScreen === "register") {
      return (
        <Register
          onRegisterOTP={handleRegisterOTP}
          onBackToLogin={handleBackToLogin}
        />
      );
    }

    if (authScreen === "register-otp") {
      return (
        <RegisterOTP
          email={authEmail}
          onRegistrationComplete={handleRegistrationComplete}
          onBack={handleBackToRegister}
        />
      );
    }

    if (authScreen === "login-otp") {
      return (
        <LoginOTP
          email={authEmail}
          onLogin={handleLogin}
          onBack={handleBackToLogin}
        />
      );
    }

    return <Login onLoginOTP={handleLoginOTP} onRegister={handleRegister} />;
  }

  // =========================
  // STATISTICS
  // =========================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = totalTasks - completedTasks;

  // =========================
  // TASK MANAGER UI
  // =========================

  return (
    <div className="app">
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <div className="brand">
          TASK<span>FLOW</span>
        </div>

        <div className="nav-right">
          <span className="user-name">NIKHIL</span>

          <button className="logout-button" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </header>

      {/* =========================
          HERO
      ========================= */}

      <main>
        <section className="hero">
          <div className="hero-label">
            <span className="hero-dot"></span>
            PERSONAL WORKSPACE
          </div>

          <h1>
            YOUR WORK.
            <br />
            <span>ORGANIZED.</span>
          </h1>

          <div className="hero-bottom">
            <p>A focused workspace for everything you need to get done.</p>

            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{totalTasks}</strong>
                <span>TOTAL</span>
              </div>

              <div className="hero-stat">
                <strong>{completedTasks}</strong>
                <span>DONE</span>
              </div>

              <div className="hero-stat">
                <strong>{pendingTasks}</strong>
                <span>PENDING</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            CREATE TASK
        ========================= */}

        <section className="create-section">
          <div className="section-number">01</div>

          <div className="section-content">
            <div className="section-heading">
              <span>CREATE</span>
              <h2>NEW TASK</h2>
            </div>

            <form className="task-form" onSubmit={addTask}>
              <div className="form-field">
                <label>TASK TITLE</label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="What needs to be done?"
                  required
                />
              </div>

              <div className="form-field">
                <label>DESCRIPTION</label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Add some context..."
                  rows="3"
                />
              </div>

              <button className="primary-button" type="submit">
                ADD TASK
                <span>→</span>
              </button>
            </form>
          </div>
        </section>

        {/* =========================
            TASK LIST
        ========================= */}

        <section className="tasks-section">
          <div className="section-number">02</div>

          <div className="section-content">
            <div className="tasks-header">
              <div className="section-heading">
                <span>YOUR WORK</span>
                <h2>TASKS</h2>
              </div>

              <div className="task-count">
                {String(totalTasks).padStart(2, "0")} TOTAL
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="empty-state">
                <span>00</span>

                <p>
                  No tasks yet.
                  <br />
                  Start by creating one above.
                </p>
              </div>
            ) : (
              <div className="task-table-wrapper">
                <table className="task-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>TASK</th>
                      <th>DESCRIPTION</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((task, index) => (
                      <tr
                        key={task.id}
                        className={task.completed ? "task-row-completed" : ""}
                      >
                        <td className="table-index">
                          {String(index + 1).padStart(2, "0")}
                        </td>

                        {editingTaskId === task.id ? (
                          <td colSpan="4">
                            <div className="table-edit">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(event) =>
                                  setEditTitle(event.target.value)
                                }
                              />

                              <textarea
                                value={editDescription}
                                onChange={(event) =>
                                  setEditDescription(event.target.value)
                                }
                                rows="2"
                              />

                              <div className="edit-actions">
                                <button
                                  className="save-button"
                                  onClick={() => saveEdit(task.id)}
                                >
                                  SAVE
                                </button>

                                <button
                                  className="cancel-button"
                                  onClick={cancelEdit}
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          </td>
                        ) : (
                          <>
                            <td className="table-title">{task.title}</td>

                            <td className="table-description">
                              {task.description || "No description provided."}
                            </td>

                            <td>
                              <span
                                className={`status ${
                                  task.completed
                                    ? "status-complete"
                                    : "status-pending"
                                }`}
                              >
                                {task.completed ? "COMPLETE" : "PENDING"}
                              </span>
                            </td>

                            <td className="table-actions">
                              <button onClick={() => toggleTaskStatus(task)}>
                                {task.completed ? "PENDING" : "COMPLETE"}
                              </button>

                              <button onClick={() => startEdit(task)}>
                                EDIT
                              </button>

                              <button
                                className="delete-action"
                                onClick={() => openDeletePopup(task.id)}
                              >
                                DELETE
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* =========================
          DELETE MODAL
      ========================= */}

      {deleteTaskId !== null && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-number">03</div>

            <span className="modal-label">CONFIRM ACTION</span>

            <h2>
              DELETE
              <br />
              THIS TASK?
            </h2>

            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button className="cancel-modal" onClick={closeDeletePopup}>
                CANCEL
              </button>

              <button className="confirm-delete" onClick={deleteTask}>
                DELETE TASK →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          TOAST
      ========================= */}

      {toast && (
        <div className="toast">
          <span className="toast-dot"></span>
          {toast}
        </div>
      )}

      {/* =========================
          FOOTER
      ========================= */}

      <footer>
        <div>
          TASK<span>FLOW</span>
        </div>

        <p>FOCUS. EXECUTE. COMPLETE.</p>

        <span>© 2026</span>
      </footer>
    </div>
  );
}

export default App;
