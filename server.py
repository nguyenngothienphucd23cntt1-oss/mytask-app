from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

tasks = []

@app.route("/")
def home():
    return "Server is running 🚀"

# Lấy danh sách task
@app.route("/tasks", methods=["GET"])
def get_tasks():
    return jsonify(tasks)

# Thêm task
@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = {
        "id": int(time.time() * 1000),
        "text": request.json.get("text"),
        "completed": False
    }
    tasks.append(new_task)
    return jsonify(new_task)

# Xóa task
@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task["id"] != id]
    return jsonify({"message": "Deleted"})

# Toggle task
@app.route("/tasks/<int:id>", methods=["PUT"])
def toggle_task(id):
    for task in tasks:
        if task["id"] == id:
            task["completed"] = not task["completed"]
            return jsonify(task)
    return jsonify({"error": "Task not found"}), 404


if __name__ == "__main__":
    app.run(port=3000, debug=True)