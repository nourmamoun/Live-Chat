let username = prompt("Enter your name:");
if (!username) username = "Anonymous";

// Show username in HTML
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("username-display").textContent = `You are chatting as: ${username}`;
});

const socket = new WebSocket("ws://localhost:12345");
const chatBox = document.getElementById("box-chat");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
let onlineCountDisplay = document.getElementById("online-count");

socket.onopen = (event) =>{
    console.log(event)
}

socket.onmessage = (event) => {
    console.log(event)

    if (event.data.startsWith("Online clients:")) {
        onlineCountDisplay.textContent = event.data;  
    } else {
        console.log(event)
        appendMessage(event.data, 'other');
    }
    
};

function appendMessage(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendButton.onclick = () => {
  const msg = messageInput.value;
  if (msg.trim()) {
    const fullMessage = `${username}: ${msg}`;
    socket.send(fullMessage);
    appendMessage("You: " + msg, 'you');
    messageInput.value = "";
  }
};

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendButton.click();
}
});


