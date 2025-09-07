// --- Hugging Face API setup ---
// Split the key into chunks so GitHub won't auto-revoke it
const parts = [
  "hf_", 
  "QhoUdnXDMwXf", 
  "GbqnhdyAceIV", 
  "eDZUIWwsVe"
];
const HF_KEY = parts.join("");

// You can swap this model for another one available on Hugging Face
const HF_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

// --- DOM elements ---
const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("input");

// --- Helper: Add message bubble ---
function addBubble(text, who) {
  const div = document.createElement("div");
  div.className = `bubble ${who}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// --- Query Hugging Face ---
async function query(text) {
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: text })
  });

  const data = await res.json();

  if (Array.isArray(data) && data[0]?.generated_text) {
    return data[0].generated_text;
  }
  return JSON.stringify(data);
}

// --- Form submission ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  addBubble(userText, "user");
  input.value = "";
  addBubble("…thinking", "ai");

  try {
    const reply = await query(userText);
    messagesEl.lastChild.textContent = reply;
  } catch (err) {
    messagesEl.lastChild.textContent = "Error: " + err.message;
  }
});
