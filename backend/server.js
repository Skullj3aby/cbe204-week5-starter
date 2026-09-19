<<<<<<< HEAD
// server.js
// CBE204 Week 5 - Task Manager backend (final version)
//
// This is the file `npm start` runs (see package.json -> "main"/"start").
// It represents the completed state of the lab: full CRUD, input
// validation, and centralized error handling, built up over
// server_initial.js -> server_all.js -> server_all_error.js.
//
// NOTE: the single-task lookup route is intentionally "/api/task/:id"
// (singular), matching the route used throughout server_all.js /
// server_all_error.js / server_challenge.js. The list/create/update/
// delete routes use the plural "/api/tasks".

=======
>>>>>>> 0334150a94a939889ec9f18fdc25695e52a067c0
import express from "express";
import cors from "cors";

const tasks = [
    {
        "id": 1,
        "title": "Study JavaScript",
        "completed": false
    },
    {
        "id": 2,
        "title": "Build REST API",
        "completed": false
    }
<<<<<<< HEAD
];

const app = express();

=======
]

const app = express();
>>>>>>> 0334150a94a939889ec9f18fdc25695e52a067c0
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500']
}));

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.get("/", (req, res) => {
    res.send("Welcome CBE204 Week5!");
});

<<<<<<< HEAD
// Read all tasks
=======
>>>>>>> 0334150a94a939889ec9f18fdc25695e52a067c0
app.get("/api/tasks", (req, res) => {
    res.send(tasks);
});

<<<<<<< HEAD
// Read one task
app.get("/api/task/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "Task ID must be a positive integer" });
    }

    const task = tasks.find(task => (task.id === id));

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
});

// Create a task
app.post("/api/tasks", (req, res) => {
    const { title, completed } = req.body;

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).json({ message: "Title is required" });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be a boolean" });
    }

    const newTask = {
        title: title.trim(),
        completed: completed ?? false,
=======
app.post("/api/tasks", (req, res) => {
    const newTask = {
        ...req.body,
>>>>>>> 0334150a94a939889ec9f18fdc25695e52a067c0
        id: Math.max(...tasks.map(task => task.id), 0) + 1
    };
    tasks.push(newTask);
    res.status(201).json(tasks);
});

<<<<<<< HEAD
// Update a task
app.put("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "Task ID must be a positive integer" });
    }

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const fields = Object.keys(req.body);

    if (fields.length === 0 || fields.some(field => !["title", "completed"].includes(field))) {
        return res.status(400).json({ message: "Only title and completed can be updated" });
    }

    if (req.body.title !== undefined &&
        (typeof req.body.title !== "string" || req.body.title.trim() === "")) {
        return res.status(400).json({ message: "Title must be a non-empty string" });
    }

    if (req.body.completed !== undefined && typeof req.body.completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be a boolean" });
    }

    if (req.body.title !== undefined) {
        task.title = req.body.title.trim();
    }

    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    res.status(200).json(task);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({ message: "Task ID must be a positive integer" });
    }

    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(taskIndex, 1);
    res.status(200).json(tasks);
});

// Unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Centralized error handler (e.g. malformed JSON bodies)
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
        return res.status(400).json({ message: "Invalid JSON body" });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
=======
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
>>>>>>> 0334150a94a939889ec9f18fdc25695e52a067c0
