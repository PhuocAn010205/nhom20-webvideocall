const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("roomId");
const userId = Math.floor(Math.random() * 10000);
const username = "User" + userId;

// DOM
const videoGrid = document.getElementById("video-grid");
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

let localStream;
let peerConnections = {}; // { userId: RTCPeerConnection }

// Get media
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localStream = stream;
  addVideoStream(stream, "Bạn");

  // join room
  socket.emit("join-room", { roomId, userId, username });
});

// Thêm video
function addVideoStream(stream, name) {
  const video = document.createElement("video");
  video.srcObject = stream;
  video.autoplay = true;
  video.playsInline = true;
  const wrapper = document.createElement("div");
  wrapper.classList.add("video-card");
  const nameTag = document.createElement("div");
  nameTag.classList.add("name");
  nameTag.innerText = name;
  wrapper.appendChild(video);
  wrapper.appendChild(nameTag);
  videoGrid.appendChild(wrapper);
}

// Khi user mới join
socket.on("user-joined", ({ userId: otherId, username }) => {
  createOffer(otherId);
  notify(`🔔 ${username} đã tham gia`);
});

// Rời phòng
socket.on("user-left", ({ username }) => {
  notify(`❌ ${username} đã rời phòng`);
});

// Nhận offer
socket.on("offer", async ({ from, sdp }) => {
  const pc = createPeerConnection(from);
  await pc.setRemoteDescription(new RTCSessionDescription(sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit("answer", { roomId, to: from, sdp: answer });
});

// Nhận answer
socket.on("answer", async ({ from, sdp }) => {
  await peerConnections[from].setRemoteDescription(new RTCSessionDescription(sdp));
});

// Nhận ICE
socket.on("ice-candidate", ({ from, candidate }) => {
  peerConnections[from].addIceCandidate(new RTCIceCandidate(candidate));
});

// ========== WebRTC functions ==========
function createPeerConnection(otherId) {
  const pc = new RTCPeerConnection();
  peerConnections[otherId] = pc;

  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    addVideoStream(event.streams[0], "Người dùng " + otherId);
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { roomId, to: otherId, candidate: event.candidate });
    }
  };

  return pc;
}

async function createOffer(otherId) {
  const pc = createPeerConnection(otherId);
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit("offer", { roomId, to: otherId, sdp: offer });
}

// ========== Chat ==========
sendBtn.addEventListener("click", () => {
  const msg = chatInput.value.trim();
  if (!msg) return;
  socket.emit("chat-message", {
    roomId,
    senderId: userId,
    senderName: username,
    receiverId: null,
    message: msg
  });
  chatInput.value = "";
});

socket.on("chat-message", (data) => {
  const p = document.createElement("p");
  p.innerHTML = `<b>${data.senderName}:</b> ${data.message}`;
  chatMessages.appendChild(p);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

function notify(msg) {
  const p = document.createElement("p");
  p.innerHTML = `<i>${msg}</i>`;
  chatMessages.appendChild(p);
}
