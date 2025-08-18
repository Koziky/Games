const els = {
  convList: document.getElementById('convList'),
  newChat: document.getElementById('newChat'),
  chatTitle: document.getElementById('chatTitle'),
  messages: document.getElementById('messages'),
  input: document.getElementById('input'),
  sendBtn: document.getElementById('sendBtn'),
  attachBtn: document.getElementById('attachBtn'),
  fileInput: document.getElementById('fileInput'),
  lightbox: document.getElementById('lightbox'),
  lightboxImg: document.getElementById('lightboxImg'),
};

let state = JSON.parse(localStorage.getItem("kozai_chats") || "{}");
if(!state.convs) state.convs = [];
if(!state.current) {
  state.current = newConv("New Conversation");
}
renderSidebar(); renderChat();

function save(){ localStorage.setItem("kozai_chats", JSON.stringify(state)); }
function newConv(title){
  const id = crypto.randomUUID();
  state.convs.unshift({id,title,messages:[]});
  return id;
}
function getConv(){ return state.convs.find(c=>c.id===state.current); }

function renderSidebar(){
  els.convList.innerHTML = "";
  state.convs.forEach(c=>{
    const div = document.createElement("div");
    div.textContent = c.title;
    div.className = "conv"+(c.id===state.current?" active":"");
    div.onclick = ()=>{state.current=c.id;save();renderSidebar();renderChat();};
    els.convList.appendChild(div);
  });
}
function renderChat(){
  const conv = getConv();
  els.chatTitle.textContent = conv.title;
  els.messages.innerHTML = "";
  conv.messages.forEach(m=>{
    const msg = document.createElement("div");
    msg.className="msg "+m.role;
    const bubble = document.createElement("div");
    bubble.className="bubble";
    if(m.text) bubble.textContent=m.text;
    if(m.images){
      m.images.forEach(src=>{
        const img=document.createElement("img");
        img.src=src; img.onclick=()=>openLightbox(src);
        bubble.appendChild(img);
      });
    }
    msg.appendChild(bubble);
    els.messages.appendChild(msg);
  });
  els.messages.scrollTop=els.messages.scrollHeight;
}

function send(){
  const txt=els.input.value.trim();
  if(!txt && !pending.length) return;
  addMsg("user",{text:txt,images:pending});
  els.input.value=""; pending=[];
  aiReply(txt);
}
function addMsg(role,{text="",images=[]}){
  const conv=getConv();
  conv.messages.push({role,text,images});
  save(); renderChat();
}
function aiReply(userText){
  const reply="You said: "+userText+"\nThis is Koziky AI’s demo reply ✨";
  setTimeout(()=>addMsg("ai",{text:reply}),700);
}

let pending=[];
els.attachBtn.onclick=()=>els.fileInput.click();
els.fileInput.onchange=e=>{
  [...e.target.files].forEach(f=>{
    const r=new FileReader();
    r.onload=()=>{ pending.push(r.result); };
    r.readAsDataURL(f);
  });
};
els.sendBtn.onclick=send;
els.input.onkeydown=e=>{
  if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); send(); }
};

// Lightbox
function openLightbox(src){
  els.lightboxImg.src=src;
  els.lightbox.showModal();
}
els.lightbox.onclick=()=>els.lightbox.close();
