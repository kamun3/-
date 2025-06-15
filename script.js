let servers = [];
let currentPlayer = null;
let currentServer = null;
let playerIndex = null;
let selectedMode = 'مشاهير اليوتيوب'; // اختياره تلقائيًا

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
  document.getElementById("mode1").classList.add("selected");
}

function showJoin() {
  document.getElementById("createSection").style.display = "none";
  document.getElementById("joinSection").style.display = "block";
  updateServerList();
}

function selectMode(mode) {
  selectedMode = mode;
  document.querySelectorAll(".modes button").forEach(btn => btn.classList.remove("selected"));
  event.target.classList.add("selected");
}

function createServer() {
  const name = document.getElementById("serverName").value;
  const pass = document.getElementById("serverPass").value;
  if (!name) return alert("اكتب اسم السيرفر");
  if (!selectedMode) return alert("اختر نوع اللعبة");

  servers.push({ name, pass, players: [currentPlayer], selectedImages: [null, null], mode: selectedMode });
  currentServer = servers[servers.length - 1];
  playerIndex = 0;
  waitForPlayers();
}

function updateServerList() {
  const container = document.getElementById("serverList");
  container.innerHTML = "";
  const search = document.getElementById("searchName").value;

  const filtered = servers.filter(s => s.name.includes(search));
  if (filtered.length === 0) {
    container.innerHTML = "<p>لا توجد سيرفرات حالياً</p>";
    return;
  }

  filtered.forEach(server => {
    const div = document.createElement("div");
    div.innerHTML = `<button onclick="selectServer('${server.name}')">${server.name} - ${server.mode}</button>`;
    container.appendChild(div);
  });
}

let selectedJoinServer = null;
function selectServer(name) {
  const found = servers.find(s => s.name === name);
  if (!found) return alert("السيرفر غير موجود");
  if (found.players.length >= 2) return alert("السيرفر ممتلئ");
  selectedJoinServer = found;

  if (found.pass) {
    document.getElementById("passwordPrompt").style.display = "block";
  } else {
    joinSelectedServer();
  }
}

function confirmJoin() {
  const inputPass = document.getElementById("joinPass").value;
  if (selectedJoinServer.pass !== inputPass) return alert("كلمة المرور غير صحيحة");
  joinSelectedServer();
}

function joinSelectedServer() {
  selectedJoinServer.players.push(currentPlayer);
  currentServer = selectedJoinServer;
  playerIndex = 1;
  document.getElementById("passwordPrompt").style.display = "none";
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

let turn = 0;
function updateTurn() {
  document.getElementById("controls").innerHTML = "";
  const turnInfo = document.getElementById("turnInfo");
  turnInfo.innerText = `الدور عندك: ${currentServer.players[turn]}`;

  if (turn === playerIndex) {
    document.getElementById("controls").innerHTML = `
      <button onclick="enableGuessMode()">🎯 تخمين الصورة</button>
    `;
  }
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
