from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)  # allow frontend JS requests

# Simple memory + persona
memory = []
persona = "You are Koziky — playful, concise, sometimes adds emojis."

@app.route("/chat", methods=["POST"])
def chat():
    user_input = request.json.get("message", "")
    memory.append(user_input)

    # --- Replace this with your real AI logic (RAG + LLM, etc.) ---
    responses = [
        f"Hmm… tell me more about '{user_input}' 🤔",
        f"Oh! '{user_input}' sounds interesting 😃",
        f"I don’t know about '{user_input}', want to explain?",
        f"Good one! '{user_input}' got me thinking 💭",
    ]
    reply = random.choice(responses)

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
