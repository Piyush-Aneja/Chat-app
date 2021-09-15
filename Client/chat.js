const socket = io.connect("https://online-chat-app28.herokuapp.com/");
const msgdiv = document.getElementById("messagediv");
const msg = document.getElementById("message");
const typingInfo = document.getElementById("typingInfo");
const roompara = document.getElementById("roomid");
const room = document.getElementById("room");
const roombtn = document.getElementById("joinroombtn");

let userName = prompt("Enter your name");
if (userName.trim() === "") userName = "Unknown";
const contactdiv = document.getElementsByClassName("contactsContainer")[0];

function AppendMsg(msg, position, user = "You") {
  let newmsgdiv = document.createElement("div");
  newmsgdiv.innerHTML = `<p> <b>${user} </b>: ${msg} `;
  newmsgdiv.classList.add("msg");
  newmsgdiv.classList.add(position);
  msgdiv.appendChild(newmsgdiv);
  document.getElementsByClassName("chat-window")[0].scrollIntoView();
  // var divi = document.getElementsByClassName("chat-window")[0];
  var divi = document.getElementById("messagediv");
  divi.scrollTop = divi.scrollHeight - divi.clientHeight;
}

function clearSelection() {
  let allPAra = document.getElementsByClassName("idsPara");
  for (let i = 0; i < allPAra.length; i++) {
    allPAra[i].style.backgroundColor = "#0000ff4a";
    allPAra[i].innerText = allPAra[i].innerText.substring(
      allPAra[i].innerText.indexOf(":") + 1
    );
  }

  document.getElementById("room").value = "";
}

function getUsersConnected() {
  //   console.log(`${socket.id} is calling get ids`);
  socket.emit("get-ids", socket.id);
}
getUsersConnected();

function clearChat() {
  msgdiv.innerHTML = "";
}

function sendmsg() {
  if (msg.value.trim() != "") {
    AppendMsg(msg.value, "right");
    socket.emit(
      "chat",
      {
        message: msg.value,
        handle: userName,
      },
      room.value
    );
    msg.value = "";
  }
}

document.getElementById("sendBtn").addEventListener("click", function () {
  sendmsg();
});

roombtn.addEventListener("click", function (e) {
  socket.emit("joinroom", room.value);
});

socket.on("connect", function () {
  roompara.innerHTML = ` <p id="roomheading">  <b> Your Room Id: </b>  ${socket.id} </p> `;
  let name =
    userName.charAt(0).toUpperCase() + userName.substring(1, userName.length);
  document.getElementById("heading").innerHTML = `Welcome ${name} ..!!!`;
});
socket.on("add-id", function (id) {
  finalId.push(id);
  finalId = [...new Set(finalId)];
  showids(finalId);
});

socket.on("remove-id", function (id) {
  finalId = finalId.filter((item) => item !== id);
  typingInfo.innerText = "";

  showids(finalId);
});

socket.on("chat", function (data) {
  typingInfo.innerText = "";
  AppendMsg(data.message, "left", data.handle);
});

msg.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendmsg();
  }
  if (msg.value != "")
    socket.emit(
      "typing",
      { userName: `${userName}`, socketid: `${socket.id}` },
      room.value
    );
});

socket.on("typing", function (data) {
  typingInfo.innerText = `${data.userName} is typing... `;
  console.log(typingInfo.innerText);
});

let finalId = [];
socket.on("receive-ids", function (ids) {
  // let ids = Array.from(idsSet);
  finalId = finalId.concat(ids);
  finalId = finalId.filter((item) => item !== socket.id);
  finalId = [...new Set(finalId)];
  showids(finalId);
});

function showids(ids) {
  while (contactdiv.firstChild) {
    contactdiv.removeChild(contactdiv.firstChild);
  }

  for (let i = 0; i < ids.length; i++) {
    para = document.createElement("p");
    para.classList.add("idsPara");
    para.addEventListener("click", (e) => {
      clearChat();
      let allPAra = document.getElementsByClassName("idsPara");
      // console.log(allPAra);
      for (let i = 0; i < allPAra.length; i++) {
        allPAra[i].style.backgroundColor = "#0000ff4a";
        allPAra[i].innerText = e.target.innerText.substring(
          e.target.innerText.indexOf(":") + 1
        );
      }

      document.getElementById("room").value = ids[i];
      // para.style.backgroundColor = "yellow";
      e.target.style.backgroundColor = "#0000ff78";
      //   e.target.innerText = "Chatting with: " + e.target.innerText;
      e.target.innerHTML = ` <b>  Chatting with:</b>  ` + e.target.innerHTML;
    });
    para.innerText = ids[i];
    contactdiv.appendChild(para);
  }
}
