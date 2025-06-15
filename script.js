let servers = [];
let currentPlayer = null;
let currentServer = null;
let playerIndex = null;

function enterGame() {
  const name = document.getElementById("playerName").value;
  if (!name) return alert("اكتب اسمك أولاً");
  currentPlayer = name;
  document.getElementById("nameSection").style.display = "none";
  document.getElementById("mainMenu").style.display = "block";
}

function showCreate() {
  document.getElementById("createSection").style.display = "block";
  document.getElementById("joinSection").style.display = "none";
}

function showJoin() {
  document.getElementById("createSection").style.display = "none";
  document.getElementById("joinSection").style.display = "block";
}

function createServer() {
  const name = document.getElementById("serverName").value;
  const pass = document.getElementById("serverPass").value;
  if (!name) return alert("اكتب اسم السيرفر");
  servers.push({ name, pass, players: [currentPlayer], selectedImages: [null, null] });
  currentServer = servers[servers.length - 1];
  playerIndex = 0;
  waitForPlayers();
}

function joinServer() {
  const search = document.getElementById("searchName").value;
  const pass = document.getElementById("joinPass").value;
  const found = servers.find(s => s.name === search);
  if (!found) return alert("❌ السيرفر غير موجود");
  if (found.pass && found.pass !== pass) return alert("❌ كلمة المرور غير صحيحة");
  if (found.players.length >= 2) return alert("🚫 السيرفر ممتلئ (الحد 2 لاعبين)");

  found.players.push(currentPlayer);
  currentServer = found;
  playerIndex = 1;
  waitForPlayers();
}

function waitForPlayers() {
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("createSection").style.display = "none";
  document.getElementById("joinSection").style.display = "none";
  document.getElementById("waitingScreen").style.display = "block";

  const interval = setInterval(() => {
    if (currentServer.players.length === 2) {
      clearInterval(interval);
      document.getElementById("waitingScreen").style.display = "none";
      startGame();
    }
  }, 1000);
}

function startGame() {
  document.getElementById("gameArea").style.display = "block";
  loadImages();
  updateTurn();
}

function loadImages() {
  const container = document.getElementById("imageContainer");
  container.innerHTML = "";
  let allImages = Array.from({ length: 25 }, (_, i) => `images/img${i + 1}.jpg`);
  allImages = shuffle(allImages).slice(0, 25);

  allImages.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => selectImage(src);
    container.appendChild(img);
  });
}

function selectImage(src) {
  if (currentServer.selectedImages[playerIndex]) return;

  currentServer.selectedImages[playerIndex] = src;
  const selected = document.getElementById("selectedImage");
  selected.innerHTML = `<h3>✅ اخترت صورة</h3><img src="${src}" width="100">`;

  document.getElementById("controls").innerHTML = "";

  if (currentServer.selectedImages[0] && currentServer.selectedImages[1]) {
    setTimeout(() => {
      updateTurn();
    }, 3000);
  }
}

let isFirstTurn = true;
let turn = 0;
function updateTurn() {
  document.getElementById("controls").innerHTML = "";
  const turnInfo = document.getElementById("turnInfo");
  turnInfo.innerText = `الدور عندك: ${currentServer.players[turn]}`;

  if (turn === playerIndex) {
    document.getElementById("controls").innerHTML = `
      <button onclick="enableDeleteMode()">🗑 حذف الصور</button>
      <button onclick="enableGuessMode()">🎯 تخمين الصورة</button>
    `;
  }
}

let deleteMode = false;
function enableDeleteMode() {
  deleteMode = true;
  const images = document.querySelectorAll("#imageContainer img");
  images.forEach(img => {
    img.onclick = () => {
      img.style.opacity = "0.3";
      img.classList.add("marked-for-deletion");
    };
  });
  document.getElementById("controls").innerHTML += `<br><button onclick="deleteSelectedImages()">تأكيد الحذف</button>`;
}

function deleteSelectedImages() {
  document.querySelectorAll(".marked-for-deletion").forEach(img => img.remove());
  deleteMode = false;
  document.getElementById("controls").innerHTML = "";
  updateTurn();
}

function enableGuessMode() {
  const images = document.querySelectorAll("#imageContainer img");
  images.forEach(img => {
    img.onclick = () => {
      const opponentIndex = (playerIndex + 1) % 2;
      if (img.src.includes(currentServer.selectedImages[opponentIndex])) {
        alert("🎉 فزت!");
        location.reload();
      } else {
        alert("❌ خطأ، انتهت المحاولة.");
        turn = (turn + 1) % 2;
        updateTurn();
      }
    };
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
