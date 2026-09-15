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
]

const app = express();
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

app.get("/api/tasks", (req, res) => {
    res.send(tasks);
});

app.post("/api/tasks", (req, res) => {
    const newTask = {
        ...req.body,
        id: Math.max(...tasks.map(task => task.id), 0) + 1
    };
    tasks.push(newTask);
    res.status(201).json(tasks);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});