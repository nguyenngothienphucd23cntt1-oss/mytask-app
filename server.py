from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)

# Lấy DATABASE_URL từ biến môi trường (Render sẽ cung cấp)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

# Tạo model Task
class Task(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    text = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)

# Tạo bảng nếu chưa có
with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return "Server is running 🚀"

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([
        {"id": t.id, "text": t.text, "completed": t.completed}
        for t in tasks
    ])

@app.route("/tasks", methods=["POST"])
def add_task():
    new_task = Task(
        id=int(__import__("time").time() * 1000),
        text=request.json.get("text"),
        completed=False
    )
    db.session.add(new_task)
    db.session.commit()

    return jsonify({
        "id": new_task.id,
        "text": new_task.text,
        "completed": new_task.completed
    })

@app.route("/tasks/<int:id>", methods=["DELETE"])
def delete_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Deleted"})

@app.route("/tasks/<int:id>", methods=["PUT"])
def toggle_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"error": "Not found"}), 404

    task.completed = not task.completed
    db.session.commit()

    return jsonify({
        "id": task.id,
        "text": task.text,
        "completed": task.completed
    })

if __name__ == "__main__":
    app.run(port=3000, debug=True)s