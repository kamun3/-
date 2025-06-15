const serversURL = "https://github.com/kamun3/celebrity-servers";

let serversData = [];
let filteredServers = [];

// تحميل السيرفرات من JSON
async function loadServers() {
  try {
    const response = await fetch(serversURL);
    if (!response.ok) throw new Error("Failed to fetch servers data");
    serversData = await response.json();
    filteredServers = serversData;
    renderServerList();
  } catch (error) {
    console.error("Error loading servers:", error);
    document.getElementById("serverList").innerHTML = `<p>لا يمكن تحميل السيرفرات حالياً</p>`;
  }
}

// عرض السيرفرات في القائمة
function renderServerList() {
  const listContainer = document.getElementById("serverList");
  listContainer.innerHTML = "";
  if (filteredServers.length === 0) {
    listContainer.innerHTML = "<p>لا يوجد سيرفرات مطابقة</p>";
    return;
  }

  filteredServers.forEach(server => {
    const div = document.createElement("div");
    div.classList.add("server-item");
    div.textContent = server.name;
    div.onclick = () => enterServer(server);
    listContainer.appendChild(div);
  });
}

// وظيفة عند ضغط على سيرفر للدخول
function enterServer(server) {
  if (server.password) {
    const pass = prompt(`السيرفر محمي بكلمة مرور.\nادخل كلمة المرور لـ "${server.name}":`);
    if (pass !== server.password) {
      alert("كلمة المرور غير صحيحة!");
      return;
    }
  }
  alert(`تم الدخول إلى السيرفر: ${server.name}`);
  // هنا تضيف الكود اللازم بعد الدخول (فتح غرفة دردشة، لعب، الخ)
}

// البحث بالسيرفرات
function searchServers() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  filteredServers = serversData.filter(s => s.name.toLowerCase().includes(query));
  renderServerList();
}

// تحميل السيرفرات عند بدء الصفحة
window.onload = loadServers;
