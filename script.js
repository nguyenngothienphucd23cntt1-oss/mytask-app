const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const API_URL = "https://mytask-app-letq.onrender.com/tasks";

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
}

function renderTasks(tasks) {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </span>
            <div>
                <button onclick="toggleTask(${task.id})">✔</button>
                <button onclick="deleteTask(${task.id})">❌</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

async function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    taskInput.value = "";
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

async function toggleTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    fetchTasks();
}

addBtn.addEventListener("click", addTask);
fetchTasks();