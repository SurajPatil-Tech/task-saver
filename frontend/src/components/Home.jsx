import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigateTo = useNavigate();

  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${API_URL}/todo/fetch`, {
          withCredentials: true,
        });

        setTodos(response.data.todos || []);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch todos");
        toast.error("Failed to load todos");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const todoCreate = async () => {
    const text = newTodo.trim();

    if (!text) {
      toast.error("Please enter a todo");
      return;
    }

    try {
      setCreating(true);

      const response = await axios.post(
        `${API_URL}/todo/create`,
        {
          text,
          completed: false,
        },
        {
          withCredentials: true,
        }
      );

      setTodos((prevTodos) => [...prevTodos, response.data.newTodo]);
      setNewTodo("");
      toast.success("Todo added successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create todo");
    } finally {
      setCreating(false);
    }
  };

  const todoStatus = async (id) => {
    const todo = todos.find((t) => t._id === id);

    if (!todo) return;

    try {
      setUpdatingId(id);

      const response = await axios.put(
        `${API_URL}/todo/update/${id}`,
        {
          ...todo,
          completed: !todo.completed,
        },
        {
          withCredentials: true,
        }
      );

      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t._id === id ? response.data.todo : t
        )
      );

      toast.success(
        !todo.completed
          ? "Todo completed!"
          : "Todo marked as pending"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to update todo");
    } finally {
      setUpdatingId(null);
    }
  };

  const todoDelete = async (id) => {
    try {
      setDeletingId(id);

      await axios.delete(`${API_URL}/todo/delete/${id}`, {
        withCredentials: true,
      });

      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo._id !== id)
      );

      toast.success("Todo deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete todo");
    } finally {
      setDeletingId(null);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/user/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("jwt");

      toast.success("Logged out successfully");

      setTimeout(() => {
        navigateTo("/login");
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Error logging out");
    }
  };

  const remainingTodos = todos.filter(
    (todo) => !todo.completed
  ).length;

  const completedTodos = todos.filter(
    (todo) => todo.completed
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Stay organized
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Task Saver
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Keep track of your daily tasks.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 shadow-sm transition hover:bg-red-50 hover:text-red-600 active:scale-95"
          >
            Logout
          </button>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-xl shadow-slate-200/70">

          {/* Stats */}
          <div className="grid grid-cols-2 border-b border-slate-100">
            <div className="p-5 text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {remainingTodos}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Remaining
              </p>
            </div>

            <div className="border-l border-slate-100 p-5 text-center">
              <p className="text-2xl font-bold text-emerald-500">
                {completedTodos}
              </p>

              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Completed
              </p>
            </div>
          </div>

          {/* Add Todo */}
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    todoCreate();
                  }
                }}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <button
                onClick={todoCreate}
                disabled={creating}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? "Adding..." : "+ Add Task"}
              </button>
            </div>
          </div>

          {/* Todo List */}
          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading your Task...
                </p>
              </div>
            ) : error ? (
              <div className="rounded-2xl bg-red-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl">
                  ⚠️
                </div>

                <p className="mt-3 font-semibold text-red-600">
                  {error}
                </p>

                <p className="mt-1 text-sm text-red-400">
                  Please check your server and try again.
                </p>
              </div>
            ) : todos.length === 0 ? (
              <div className="py-14 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                  📝
                </div>

                <h2 className="mt-5 text-lg font-semibold text-slate-800">
                  No Task yet
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Add your first task above and get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map((todo, index) => (
                  <div
                    key={todo._id || index}
                    className={`group flex items-center gap-3 rounded-2xl border p-4 transition ${
                      todo.completed
                        ? "border-emerald-100 bg-emerald-50/50"
                        : "border-slate-100 bg-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30"
                    }`}
                  >
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={() => todoStatus(todo._id)}
                      disabled={updatingId === todo._id}
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        todo.completed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 bg-white hover:border-indigo-500"
                      }`}
                    >
                      {todo.completed && (
                        <span className="text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </button>

                    {/* Todo Text */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`break-words text-sm font-medium transition ${
                          todo.completed
                            ? "text-slate-400 line-through"
                            : "text-slate-700"
                        }`}
                      >
                        {todo.text}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => todoDelete(todo._id)}
                      disabled={deletingId === todo._id}
                      className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 opacity-100 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      {deletingId === todo._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!loading && !error && todos.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-center">
              <p className="text-xs font-medium text-slate-400">
                {todos.length}{" "}
                {todos.length === 1 ? "task" : "tasks"} total
                {" • "}
                {completedTodos} completed
              </p>
            </div>
          )}
        </div>

        {/* Bottom Text */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Stay focused • One task at a time
        </p>
      </div>
    </div>
  );
}

export default Home;