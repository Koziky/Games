async function sendMessage() {
  const input = document.getElementById("message");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  // Send to backend
  const res = await fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  addMessage(data.reply, "bot");
}

function addMessage(text, sender) {
  const log = document.getElementById("chat-log");
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}
