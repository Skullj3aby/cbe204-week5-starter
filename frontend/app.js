// app.js
// CBE204 Week 5 - Task Manager frontend (final version, referenced by index.html)
//
// Builds on the pattern introduced in app.js -> app_2.js -> app_3.js:
// a single apiRequest() wrapper that every call goes through, so
// success/error handling only has to be written once. This version
// adds the remaining CRUD operations (edit, toggle-complete, delete),
// a loading indicator, and clears the input after adding a task.
//
// The backend (server.js) must be running on http://localhost:3000
// (`npm start`). This file is served separately (e.g. VS Code Live
// Server on port 5500), which is why requests use an absolute URL
// and the backend has CORS enabled for that origin.

const API_BASE = "http://localhost:3000";

// Tracks which task (if any) is currently being edited inline.
let editingTaskId = null;

function showError(message) {
    document.querySelector("#errorMessage").textContent = message || "";
}

function setLoading(isLoading) {
    const indicator = document.querySelector("#loadingIndicator");
    if (indicator) {
        indicator.hidden = !isLoading;
    }
}

/**
 * Wraps fetch() so every API call goes through the same
 * success/error handling.
 */
async function apiRequest(url, options = {}) {
    let response;

    try {
        response = await fetch(url, options);
    } catch (networkError) {
        // fetch() itself throws when the request never reaches the server
        // (server down, wrong port, no connection, blocked by CORS, etc.)
        console.error("Network error calling", url, networkError);
        throw new Error("NETWORK_ERROR");
    }

    if (!response.ok) {
        // The server responds with { message: "..." } on errors.
        let serverMessage = null;
        try {
            const body = await response.json();
            serverMessage = body && body.message;
        } catch (_) {
            /* no JSON body to read - ignore */
        }
        console.error(`API error ${response.status} for ${url}:`, serverMessage);

        const error = new Error(serverMessage || `HTTP ${response.status}`);
        error.status = response.status;
        throw error;
    }

    if (response.status === 204) {
        return null;
    }
    return response.json();
}

/** Translate a thrown error into user-friendly copy (never show raw errors). */
function friendlyMessageFor(error, fallback) {
    if (error.message === "NETWORK_ERROR") {
        return "Unable to connect to the server. Please check that it is running.";
    }
    if (error.status === 400) {
        return error.message || "The task information is invalid.";
    }
    if (error.status === 404) {
        return "The requested task could not be found.";
    }
    if (error.status === 500) {
        return "The server encountered an error. Please try again.";
    }
    return fallback;
}

/* ------------------------------------------------------------------
 * Rendering
 * ---------------------------------------------------------------- */

function renderTasks(tasks) {
    const list = document.querySelector("#taskList");
    list.innerHTML = "";

    if (!tasks.length) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No tasks yet - add one above.";
        list.appendChild(empty);
        return;
    }

    tasks.forEach((task) => {
        const item = document.createElement("div");
        item.className = "task" + (task.completed ? " completed" : "");

        if (editingTaskId === task.id) {
            item.appendChild(buildEditRow(task));
        } else {
            item.appendChild(buildViewRow(task));
        }

        list.appendChild(item);
    });
}

function buildViewRow(task) {
    const fragment = document.createDocumentFragment();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () =>
        toggleCompleted(task.id, checkbox.checked)
    );

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = `${task.id}: ${task.title}`;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "secondary";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
        editingTaskId = task.id;
        loadTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "danger";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => removeTask(task.id));

    actions.append(editBtn, deleteBtn);
    fragment.append(checkbox, title, actions);
    return fragment;
}

function buildEditRow(task) {
    const fragment = document.createDocumentFragment();

    const input = document.createElement("input");
    input.type = "text";
    input.value = task.title;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.textContent = "Save";
    saveBtn.addEventListener("click", () => saveEdit(task.id, input.value));

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "secondary";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
        editingTaskId = null;
        loadTasks();
    });

    actions.append(saveBtn, cancelBtn);
    fragment.append(input, actions);
    return fragment;
}

/* ------------------------------------------------------------------
 * CRUD operations
 * ---------------------------------------------------------------- */

async function loadTasks() {
    setLoading(true);
    showError("");
    try {
        const tasks = await apiRequest(`${API_BASE}/api/tasks`);
        renderTasks(tasks);
    } catch (error) {
        showError(friendlyMessageFor(error, "Unable to load tasks. Please try again."));
    } finally {
        setLoading(false);
    }
}

async function createTask(title) {
    showError("");
    try {
        // POST /api/tasks returns the full updated task list.
        await apiRequest(`${API_BASE}/api/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, completed: false }),
        });
        await loadTasks();
    } catch (error) {
        showError(friendlyMessageFor(error, "Unable to add the task. Please try again."));
    }
}

async function toggleCompleted(id, completed) {
    showError("");
    try {
        // PUT /api/tasks/:id returns only the single updated task.
        await apiRequest(`${API_BASE}/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed }),
        });
        await loadTasks();
    } catch (error) {
        showError(friendlyMessageFor(error, "Unable to update the task."));
    }
}

async function saveEdit(id, newTitle) {
    if (!newTitle.trim()) {
        showError("Title is required");
        return;
    }
    showError("");
    try {
        await apiRequest(`${API_BASE}/api/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle.trim() }),
        });
        editingTaskId = null;
        await loadTasks();
    } catch (error) {
        showError(friendlyMessageFor(error, "Unable to update the task."));
    }
}

async function removeTask(id) {
    showError("");
    try {
        // DELETE /api/tasks/:id returns the full updated task list.
        await apiRequest(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });
        await loadTasks();
    } catch (error) {
        showError(friendlyMessageFor(error, "Unable to delete the task."));
    }
}

/* ------------------------------------------------------------------
 * Wiring
 * ---------------------------------------------------------------- */

document
    .querySelector("#taskForm")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        const input = document.querySelector("#taskTitle");
        const title = input.value.trim();
        if (!title) return;

        await createTask(title);
        input.value = "";
    });

loadTasks();
