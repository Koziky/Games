const API_KEY = "sk-your-api-key-here"; // ⚠️ Visible if you share your repo
const API_URL = "https://api.openai.com/v1/chat/completions";

const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("input");

function addBubble(text, who) {
  const div = document.createElement("div");
  div.className = `bubble ${who}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  addBubble(userText, "user");
  input.value = "";
  addBubble("…thinking", "ai");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-5",
      messages: [{ role: "user", content: userText }]
    })
  });

  const data = await res.json();
  messagesEl.lastChild.textContent = data.choices[0].message.content;
});

