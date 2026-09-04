import { Conversation } from "https://esm.sh/@elevenlabs/client@1.22.0";

const AGENT_ID = "agent_0401m1mxxdw1evyvbw9dm22ynqp0";

/* ============ DOM refs ============ */
const thread = document.getElementById("thread");
const threadEmpty = document.getElementById("threadEmpty");
const statusPill = document.getElementById("statusPill");
const statusText = document.getElementById("statusText");
const errorNote = document.getElementById("errorNote");

const tabText = document.getElementById("tabText");
const tabVoice = document.getElementById("tabVoice");

const textComposer = document.getElementById("textComposer");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");

const chipRow = document.getElementById("chipRow");

/* ============ State ============ */
let mode = "text"; // 'text' | 'voice'
let conversation = null;
let sessionActive = false;
let recentSentTexts = []; // de-dupe: texts we already rendered locally

/* ============ Status helpers ============ */
function setStatus(state, label) {
  statusPill.dataset.state = state;
  statusText.textContent = label;
}

function showError(text) {
  errorNote.textContent = text;
  errorNote.hidden = false;
}
function clearError() {
  errorNote.hidden = true;
  errorNote.textContent = "";
}

/* ============ Thread rendering ============ */
function appendMessage(role, text) {
  threadEmpty.hidden = true;
  const row = document.createElement("div");
  row.className = `msg-row ${role}`;

  const avatar = document.createElement("div");
  if (role === "agent") {
    avatar.className = "msg-avatar";
    avatar.innerHTML = `<img src="assets/logos/AE_Logo.jpg" alt="" />`;
  } else if (role === "user") {
    avatar.className = "msg-avatar user-avatar";
    avatar.textContent = "YOU";
  }

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;

  if (role !== "system") row.appendChild(avatar);
  row.appendChild(bubble);
  thread.appendChild(row);
  thread.scrollTop = thread.scrollHeight;
}

function appendSystemNote(text) {
  threadEmpty.hidden = true;
  const row = document.createElement("div");
  row.className = "msg-row system";
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;
  row.appendChild(bubble);
  thread.appendChild(row);
  thread.scrollTop = thread.scrollHeight;
}

/* ============ Mode tabs (only switchable when idle) ============ */
function setMode(next) {
  if (sessionActive) return; // can't switch mid-session
  mode = next;
  tabText.setAttribute("aria-selected", String(mode === "text"));
  tabVoice.setAttribute("aria-selected", String(mode === "voice"));
  startBtn.textContent = mode === "text" ? "Start Text Session" : "Start Voice Call";
  textComposer.style.display = mode === "text" ? "block" : "none";
}
tabText.addEventListener("click", () => setMode("text"));
tabVoice.addEventListener("click", () => setMode("voice"));

/* ============ Suggested prompt chips ============ */
chipRow.addEventListener("click", async (e) => {
  const chip = e.target.closest("button[data-prompt]");
  if (!chip) return;
  const prompt = chip.dataset.prompt;

  if (mode !== "text") setMode("text");

  if (!sessionActive) {
    await startSession();
  }
  if (sessionActive) {
    sendText(prompt);
  }
});

/* ============ Start / End session ============ */
startBtn.addEventListener("click", startSession);
endBtn.addEventListener("click", endSession);

async function startSession() {
  clearError();
  startBtn.disabled = true;
  setStatus("connecting", "Connecting…");

  try {
    const options = {
      agentId: AGENT_ID,
      onConnect: () => {
        sessionActive = true;
        setStatus("connected", "Connected");
        startBtn.hidden = true;
        endBtn.hidden = false;
        tabText.disabled = true;
        tabVoice.disabled = true;
        if (mode === "text") {
          chatInput.disabled = false;
          sendBtn.disabled = false;
          chatInput.placeholder = "Type a message…";
          chatInput.focus();
        }
        appendSystemNote(mode === "text" ? "Text session started." : "Voice call connected — start talking.");
      },
      onDisconnect: () => {
        sessionActive = false;
        setStatus("idle", "Idle");
        startBtn.hidden = false;
        startBtn.disabled = false;
        endBtn.hidden = true;
        tabText.disabled = false;
        tabVoice.disabled = false;
        chatInput.disabled = true;
        sendBtn.disabled = true;
        chatInput.placeholder = "Start a session to begin typing…";
        appendSystemNote("Session ended.");
      },
      onMessage: (message) => {
        const role = message.role === "user" ? "user" : "agent";
        const text = message.message ?? "";
        if (!text) return;

        if (role === "user") {
          // Skip re-rendering a message we already showed optimistically
          // when the user typed it (text mode).
          const idx = recentSentTexts.indexOf(text);
          if (idx !== -1) {
            recentSentTexts.splice(idx, 1);
            return;
          }
        }
        appendMessage(role, text);
      },
      onModeChange: ({ mode: convoMode }) => {
        if (convoMode === "speaking") setStatus("speaking", "Speaking");
        else if (convoMode === "listening") setStatus("listening", "Listening");
      },
      onError: (message) => {
        showError(typeof message === "string" ? message : "Connection error. Please try again.");
        setStatus("error", "Error");
      },
    };

    if (mode === "text") {
      options.textOnly = true;
      options.connectionType = "websocket";
    } else {
      // Voice mode needs mic permission before the SDK can use it.
      await navigator.mediaDevices.getUserMedia({ audio: true });
      options.connectionType = "webrtc";
    }

    conversation = await Conversation.startSession(options);
  } catch (err) {
    console.error("Failed to start session:", err);
    setStatus("error", "Error");
    startBtn.disabled = false;
    if (err && err.name === "NotAllowedError") {
      showError("Microphone access was denied. Allow microphone access to use Voice Call, or switch to Text Chat.");
    } else {
      showError("Couldn't start the session: " + (err?.message || "unknown error"));
    }
  }
}

async function endSession() {
  if (!conversation) return;
  endBtn.disabled = true;
  try {
    await conversation.endSession();
  } catch (err) {
    console.error("Error ending session:", err);
  } finally {
    conversation = null;
    endBtn.disabled = false;
  }
}

/* ============ Text composer ============ */
function sendText(text) {
  if (!conversation || !sessionActive || !text.trim()) return;
  const trimmed = text.trim();
  recentSentTexts.push(trimmed);
  appendMessage("user", trimmed);
  try {
    conversation.sendUserMessage(trimmed);
  } catch (err) {
    console.error("Failed to send message:", err);
    showError("Failed to send message. The connection may have dropped.");
  }
}

sendBtn.addEventListener("click", () => {
  const text = chatInput.value;
  chatInput.value = "";
  sendText(text);
});
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = chatInput.value;
    chatInput.value = "";
    sendText(text);
  }
});

/* ============ Initial UI state ============ */
setMode("text");
