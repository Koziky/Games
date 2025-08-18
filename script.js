/* =========================
   Modern AI Chat — Client UI
   - Conversations + autosave (localStorage)
   - Send images (attach, paste, drag&drop)
   - Typing animation + smooth render
========================= */

const els = {
  convList: document.getElementById('convList'),
  newChatBtn: document.getElementById('newChatBtn'),
  exportBtn: document.getElementById('exportBtn'),
  clearAllBtn: document.getElementById('clearAllBtn'),
  messages: document.getElementById('messages'),
  input: document.getElementById('input'),
  sendBtn: document.getElementById('sendBtn'),
  attachBtn: document.getElementById('attachBtn'),
  fileInput: document.getElementById('fileInput'),
  chips: document.getElementById('imageChips'),
  chatTitle: document.getElementById('chatTitle'),
  renameBtn: document.getElementById('renameBtn'),
  deleteBtn: document.getElementById('deleteBtn'),
  lightbox: document.getElementById('lightbox'),
  lightboxImg: document.getElementById('lightboxImg'),
};

const STORAGE_KEY = 'koz_ai_chats_v1';

let state = {
  conversations: [],
  currentId: null,
  pendingImages: [] // dataURLs not yet sent
};

// ---------- Storage ----------
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = JSON.parse(raw);
  } catch {}
  if (!state.conversations?.length) {
    const id = createConversation('New Conversation');
    state.currentId = id;
    save();
  }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------- Conversations ----------
function createConversation(title = 'New Conversation') {
  const id = crypto.randomUUID();
  state.conversations.unshift({
    id,
    title,
    createdAt: Date.now(),
    messages: []
  });
  return id;
}

function getCurrentConv() {
  return state.conversations.find(c => c.id === state.currentId);
}

function renameConversation(title) {
  const c = getCurrentConv();
  if (!c) return;
  c.title = title || c.title;
  save(); renderSidebar();
}

function deleteConversation(id) {
  const idx = state.conversations.findIndex(c => c.id === id);
  if (idx >= 0) state.conversations.splice(idx, 1);
  if (!state.conversations.length) {
    const nid = createConversation('New Conversation');
    state.currentId = nid;
  } else if (state.currentId === id) {
    state.currentId = state.conversations[0].id;
  }
  save(); renderSidebar(); renderChat();
}

function renderSidebar() {
  els.convList.innerHTML = '';
  state.conversations.forEach(conv => {
    const item = document.createElement('button');
    item.className = 'conv-item' + (conv.id === state.currentId ? ' active' : '');
    item.setAttribute('role','listitem');
    item.innerHTML = `
      <div class="conv-emoji">💬</div>
      <div class="conv-title">${escapeHtml(conv.title || 'Untitled')}</div>
    `;
    item.addEventListener('click', () => {
      state.currentId = conv.id;
      save(); renderSidebar(); renderChat();
    });
    els.convList.appendChild(item);
  });
}

// ---------- Messages ----------
function renderChat() {
  const conv = getCurrentConv();
  els.chatTitle.textContent = conv?.title || 'Conversation';

  els.messages.innerHTML = '';
  (conv?.messages || []).forEach(m => {
    const node = renderMessage(m);
    els.messages.appendChild(node);
  });
  scrollToBottom();
}

function renderMessage(m) {
  const root = document.createElement('div');
  root.className = `msg ${m.role}`;
  const avatar = document.createElement('div');
  avatar.className = `avatar ${m.role === 'user' ? 'user':''}`;
  avatar.textContent = m.role === 'user' ? 'U' : 'AI';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.innerHTML = `
    <div class="role">${m.role === 'user' ? 'You' : 'Koziky AI'}</div>
    ${m.text ? `<p>${escapeHtml(m.text)}</p>` : ''}
  `;
  if (m.images?.length) {
    const imgs = document.createElement('div');
    imgs.className = 'imgs';
    m.images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'attachment';
      img.addEventListener('click', () => openLightbox(src));
      imgs.appendChild(img);
    });
    bubble.appendChild(imgs);
  }

  root.append(avatar, bubble);
  return root;
}

function addMessage(role, { text = '', images = [] } = {}) {
  const conv = getCurrentConv();
  if (!conv) return;
  const msg = { id: crypto.randomUUID(), role, text, images, createdAt: Date.now() };
  conv.messages.push(msg);
  save();
  const node = renderMessage(msg);
  els.messages.appendChild(node);
  scrollToBottom();
  return msg;
}

function addTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'msg assistant';
  wrap.dataset.typing = '1';
  wrap.innerHTML = `
    <div class="avatar">AI</div>
    <div class="bubble">
      <div class="role">Koziky AI</div>
      <div class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>
    </div>
  `;
  els.messages.appendChild(wrap);
  scrollToBottom();
  return wrap;
}

function replaceTyping(node, text, images = []) {
  node.remove();
  addMessage('assistant', { text, images });
}

// ---------- Composer, images ----------
function refreshChips() {
  if (!state.pendingImages.length) { els.chips.hidden = true; els.chips.innerHTML = ''; return; }
  els.chips.hidden = false;
  els.chips.innerHTML = '';
  state.pendingImages.forEach((src, i) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `<img src="${src}" alt=""><span>Image ${i+1}</span>`;
    const x = document.createElement('button');
    x.title = 'Remove';
    x.textContent = '✕';
    x.addEventListener('click', () => { state.pendingImages.splice(i,1); refreshChips(); });
    chip.appendChild(x);
    els.chips.appendChild(chip);
  });
}

function handleFiles(files) {
  const list = Array.from(files || []);
  if (!list.length) return;
  const promises = list.map(file => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  }));
  Promise.all(promises).then(dataURLs => {
    state.pendingImages.push(...dataURLs);
    refreshChips();
  });
}

function send() {
  const text = els.input.value.trim();
  if (!text && !state.pendingImages.length) return;

  addMessage('user', { text, images: state.pendingImages.slice() });
  els.input.value = '';
  state.pendingImages = [];
  refreshChips();
  autoResize();

  // DEMO assistant (replace with your backend call)
  const typing = addTyping();
  setTimeout(() => {
    const reply = generateDemoReply(text);
    replaceTyping(typing, reply);
  }, 600 + Math.random()*600);
}

// ---------- Utilities ----------
function escapeHtml(s){ return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])) }

function scrollToBottom(){
  requestAnimationFrame(()=>{ els.messages.scrollTop = els.messages.scrollHeight + 1000; });
}

function autoResize(){
  const el = els.input;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 180) + 'px';
}

// Simple title suggestion from first user message
function maybeSetTitleFromFirst(text){
  const conv = getCurrentConv();
  if (!conv) return;
  if (conv.title === 'New Conversation' && text) {
    const trimmed = text.split('\n')[0].slice(0, 40).trim();
    if (trimmed.length >= 3) {
      conv.title = trimmed + (trimmed.endsWith('?') ? '' : '');
      save(); renderSidebar();
    }
  }
}

// Demo reply text (you’d swap this for a real API call)
function generateDemoReply(userText){
  const hasImage = getCurrentConv().messages.slice(-1)[0]?.images?.length > 0;
  const snippets = [
    "Here’s a helpful, structured answer. You can attach more images, and I’ll analyze them too.",
    "I’m built with a modern UI: image uploads, chat memory, and smooth animations. ✨",
    "Tip: use the sidebar to switch or rename chats. Everything auto-saves locally.",
    "You can export this conversation anytime with the Export button."
  ];
  const extra = hasImage ? "\n\nI received your image(s) — click on them to view fullscreen." : "";
  const echo = userText ? `You said: “${userText.slice(0, 140)}”\n\n` : "";
  return `${echo}${snippets[Math.floor(Math.random()*snippets.length)]}${extra}`;
}

function openLightbox(src){
  els.lightboxImg.src = src;
  els.lightbox.showModal();
}

// ---------- Events ----------
els.newChatBtn.addEventListener('click', () => {
  const id = createConversation('New Conversation');
  state.currentId = id; save();
  renderSidebar(); renderChat();
  els.input.focus();
});

els.exportBtn.addEventListener('click', () => {
  const conv = getCurrentConv();
  if (!conv) return;
  const data = {
    title: conv.title,
    createdAt: conv.createdAt,
    messages: conv.messages
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = conv.title.replace(/[^\w\- ]/g,'').trim().replace(/\s+/g,'_').slice(0,40) || 'chat';
  a.href = url; a.download = `${safeTitle}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

els.clearAllBtn.addEventListener('click', () => {
  if (!confirm('Delete ALL conversations? This cannot be undone.')) return;
  state.conversations = [];
  const id = createConversation('New Conversation');
  state.currentId = id;
  save(); renderSidebar(); renderChat();
});

els.renameBtn.addEventListener('click', () => {
  const title = prompt('Rename conversation:', getCurrentConv()?.title || '');
  if (title != null) renameConversation(title.trim());
});

els.deleteBtn.addEventListener('click', () => {
  if (!confirm('Delete this conversation?')) return;
  deleteConversation(state.currentId);
});

els.attachBtn.addEventListener('click', () => els.fileInput.click());
els.fileInput.addEventListener('change', e => handleFiles(e.target.files));

els.sendBtn.addEventListener('click', () => {
  const t = els.input.value.trim();
  maybeSetTitleFromFirst(t);
  send();
});
els.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const t = els.input.value.trim(); maybeSetTitleFromFirst(t); send(); }
});
els.input.addEventListener('input', autoResize);

// Paste images
window.addEventListener('paste', (e) => {
  const items = Array.from(e.clipboardData?.items || []);
  const files = items.filter(i => i.type.startsWith('image/')).map(i => i.getAsFile());
  if (files.length) { handleFiles(files); e.preventDefault(); }
});

// Drag & drop
['dragenter','dragover'].forEach(ev => window.addEventListener(ev, e => { e.preventDefault(); }));
['drop'].forEach(ev => window.addEventListener(ev, e => {
  e.preventDefault();
  const files = e.dataTransfer?.files;
  if (files?.length) handleFiles(files);
}));

// Lightbox close
els.lightbox.addEventListener('click', () => els.lightbox.close());
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && els.lightbox.open) els.lightbox.close(); });

// Init
load();
renderSidebar();
renderChat();
autoResize();
