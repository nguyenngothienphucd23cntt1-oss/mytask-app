const addBtn = document.getElementById("addBtn");
const taskInput = document.getElementById("taskInput");
const tableBody = document.querySelector("#taskTable tbody");

const API_URL = "https://mytask-app-1.onrender.com/tasks";

async function fetchTasks() {
    const res = await fetch(API_URL);
    const tasks = await res.json();
    renderTasks(tasks);
}

function renderTasks(tasks) {
    tableBody.innerHTML = "";

    tasks.forEach(task => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${task.id}</td>
            <td class="${task.completed ? 'completed' : ''}">
                ${task.text}
            </td>
            <td>${task.completed ? "✔" : "❌"}</td>
            <td>
                <button onclick="toggleTask(${task.id})">Toggle</button>
                <button onclick="deleteTask(${task.id})">Xóa</button>
            </td>
        `;

        tableBody.appendChild(row);
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