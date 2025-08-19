// Global variables
let messages = [];
let isTyping = false;

// DOM elements
const messagesArea = document.getElementById('messages-area');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const typingIndicator = document.getElementById('typing-indicator');
const cpuUsage = document.getElementById('cpu-usage');
const memUsage = document.getElementById('mem-usage');
const memoryFill = document.getElementById('memory-fill');
const currentTime = document.getElementById('current-time');

// Matrix canvas setup
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeMatrix();
    initializeChat();
    initializeSystemStatus();
    updateTime();
    setInterval(updateTime, 1000);
    setInterval(updateSystemStats, 5000);
});

// Matrix rain effect
function initializeMatrix() {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = 'アカサタナハマヤラワガザダバパイキシチニヒミリヰギジヂビピウクスツヌフムユルグズヅブプエケセテネヘメレヱゲゼデベペオコソトノホモヨロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }
    
    function draw() {
        // Semi-transparent black background for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff0088'; // Green color with transparency
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
            const text = charArray[Math.floor(Math.random() * charArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Reset drop to top randomly
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 50);
}

// Chat functionality
function initializeChat() {
    // Add initial message with timestamp
    const initialMessage = {
        id: '1',
        content: 'KozyAi terminal initialized. Welcome, user. How may I assist you today?',
        isUser: false,
        timestamp: new Date()
    };
    
    messages.push(initialMessage);
    updateTimestamp();
    
    // Event listeners
    sendButton.addEventListener('click', handleSend);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });
    
    messageInput.addEventListener('input', function() {
        sendButton.disabled = !messageInput.value.trim() || isTyping;
    });
}

function handleSend() {
    const content = messageInput.value.trim();
    if (!content || isTyping) return;
    
    // Add user message
    const userMessage = {
        id: Date.now().toString(),
        content: content,
        isUser: true,
        timestamp: new Date()
    };
    
    messages.push(userMessage);
    addMessageToDOM(userMessage);
    
    messageInput.value = '';
    sendButton.disabled = true;
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        const aiResponse = {
            id: (Date.now() + 1).toString(),
            content: `Processing request: "${content}"\n\nCommand executed successfully. System status: OPERATIONAL\nMemory usage: 67.3% | CPU: 23.1% | Network: SECURE`,
            isUser: false,
            timestamp: new Date()
        };
        
        messages.push(aiResponse);
        addMessageToDOM(aiResponse);
        hideTypingIndicator();
        sendButton.disabled = false;
    }, 1500);
}

function addMessageToDOM(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.isUser ? 'user-message' : 'ai-message'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = `message-content ${!message.isUser ? 'terminal-prompt' : ''}`;
    contentDiv.textContent = message.content;
    
    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';
    const userLabel = message.isUser ? 'user@terminal' : 'kozy@ai';
    metaDiv.innerHTML = `${userLabel} • <span class="timestamp">${message.timestamp.toLocaleTimeString()}</span>`;
    
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(metaDiv);
    messagesArea.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function showTypingIndicator() {
    isTyping = true;
    typingIndicator.style.display = 'flex';
    messagesArea.scrollTop = messagesArea.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    typingIndicator.style.display = 'none';
}

function updateTimestamp() {
    const timestamps = document.querySelectorAll('.timestamp');
    timestamps.forEach((timestamp, index) => {
        if (messages[index]) {
            timestamp.textContent = messages[index].timestamp.toLocaleTimeString();
        }
    });
}

// System status updates
function initializeSystemStatus() {
    updateSystemStats();
}

function updateSystemStats() {
    // Random CPU usage between 20-50%
    const cpu = Math.floor(Math.random() * 30) + 20;
    cpuUsage.textContent = cpu + '%';
    
    // Random memory usage between 30-80%
    const mem = Math.floor(Math.random() * 50) + 30;
    memUsage.textContent = mem + '%';
    memoryFill.style.width = mem + '%';
}

function updateTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString('en-US', { hour12: false });
}

// Additional hacker-style features
function addGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch');
    glitchElements.forEach(element => {
        if (Math.random() < 0.1) { // 10% chance to glitch
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = '';
            }, 100);
        }
    });
}

// Random glitch effects
setInterval(addGlitchEffect, 2000);

// Terminal commands simulation
const terminalCommands = [
    'Accessing neural network...',
    'Establishing secure connection...',
    'Decrypting data packets...',
    'Analyzing user input patterns...',
    'Optimizing response algorithms...',
    'Synchronizing with quantum processors...'
];

function getRandomTerminalResponse(userInput) {
    const randomCommand = terminalCommands[Math.floor(Math.random() * terminalCommands.length)];
    return `${randomCommand}\n\nProcessing: "${userInput}"\nStatus: SUCCESS\nResponse generated in 0.${Math.floor(Math.random() * 999)}ms`;
}
