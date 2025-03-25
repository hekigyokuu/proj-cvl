const socket = io();
const username = prompt("Enter your username:") || "anonymous_skibidi";

socket.emit("new user", username);

socket.on("chat message", (data) => {
    const chatBox = document.getElementById("chat-box");
    const messageDiv = document.createElement("div");

    if (typeof data === "string") {
        messageDiv.classList.add(data.includes("has left the chat") ? "leave-message" : "join-message");
        messageDiv.textContent = data;
    } else {
        messageDiv.classList.add("message");
        messageDiv.innerHTML = `<strong>${data.user}:</strong> ${data.msg}`;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function sendMessage() {
    const msgInput = document.getElementById("msgInput");
    if (msgInput.value.trim() !== "") {
        socket.emit("chat message", { user: username, msg: msgInput.value });
        msgInput.value = "";
    }
}

document.getElementById("msgInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});