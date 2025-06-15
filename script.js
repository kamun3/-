let servers = [];
let currentPlayer = null;
let currentServer = null;
let playerIndex = null;
let selectedMode = null;

function enterGame() {
  const name = document.getElementById("playerName").value;
  if (!name) return alert("📝 الرجاء كتابة الاسم أولاً");

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
  updateServerList();
}

function selectMode(mode) {
  selectedMode = mode;
  alert("✅ تم اختيار: مشاهير اليوتيوب");
}

function underMaintenance() {
  alert("❌ هذا النوع تحت الصيانة حالياً");
}

function createServer() {
  const name = document.getElementById("serverName").value;
  const pass = document.getElementById("serverPass").value;
  if (!name) return alert("📝 الرجاء كتابة اسم السيرفر");
  if (!selectedMode) return alert("❗ اختر نوع اللعبة أولاً");

  servers.push({ name, pass, mode: selectedMode, players: [currentPlayer], selectedImages: [null, null] });
  currentServer = servers[servers.length - 1];
  playerIndex = 0;
  waitForPlayers();
}

function updateServerList() {
  const list = document.getElementById("serverList");
  list.innerHTML = "";

  servers.forEach(server => {
    const btn = document.createElement("button");
    btn.textContent = server.name;
    btn.onclick = () => {
      if (server.pass) {
        const enteredPass = prompt("🔐 هذا السيرفر محمي بكلمة مرور، الرجاء إدخالها:");
        if (enteredPass !== server.pass) {
          alert("❌ كلمة المرور غير صحيحة");
          return;
        }
      }

      if (server.players.length >= 2) return alert("🚫 السيرفر ممتلئ (الحد 2 لاعبين)");

      server.players.push(currentPlayer);
      currentServer = server;
      playerIndex = 1;
      waitForPlayers();
    };
    list.appendChild(btn);
  });

  if (servers.length === 0) {
    list.innerHTML = "<p>لا توجد سيرفرات حالياً</p>";
  }
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
