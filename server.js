const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Lấy danh sách task
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Thêm task
app.post("/tasks", (req, res) => {
    const newTask = {
        id: Date.now(),
        text: req.body.text,
        completed: false
    };

    tasks.push(newTask);
    res.json(newTask);
});

// Xóa task
app.delete("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(task => task.id !== id);
    res.json({ message: "Deleted" });
});

// Toggle
app.put("/tasks/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    res.json(task);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server chạy ở port ${PORT}`);
});