import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCUnu9IiSmzkJLinrm3u35MzBT7OGq768U",
  authDomain: "trump-0618.firebaseapp.com",
  projectId: "trump-0618",
  storageBucket: "trump-0618.firebasestorage.app",
  messagingSenderId: "277226079530",
  appId: "1:277226079530:web:e7e1ae7aad1245c3530a53"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

signInAnonymously(auth).catch(console.error);

document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    grade: parseInt(document.getElementById("grade").value),
    classNum: parseInt(document.getElementById("classNum").value),
    number: parseInt(document.getElementById("number").value),
    color: document.getElementById("color").value,
    mark: document.getElementById("mark").value,
    value: document.getElementById("value").value
  };
  try {
    await addDoc(collection(db, "cards"), data);
    alert("登録しました！");
    document.getElementById("register-form").reset();
  } catch (error) {
    console.error("登録失敗:", error);
    alert("登録に失敗しました");
  }
});

document.getElementById("searchForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const color = document.getElementById("searchColor").value;
  const mark = document.getElementById("searchMark").value;
  const value = document.getElementById("searchNumber").value;
  const oppositeColor = color === "赤" ? "青" : "赤";

  try {
    const q = query(
      collection(db, "cards"),
      where("color", "==", oppositeColor),
      where("mark", "==", mark),
      where("value", "==", value)
    );
    const querySnapshot = await getDocs(q);

    const resultsDiv = document.getElementById("searchResults");
    if (querySnapshot.empty) {
      resultsDiv.innerHTML = "<p>該当するカードを持っている人は登録されていません。</p>";
      return;
    }

    let html = "<h3>マッチング結果</h3><ul>";
    querySnapshot.forEach(doc => {
      const data = doc.data();
      html += `<li>${data.grade}年 ${data.classNum}組 ${data.number}番（${data.color}の${data.mark}${data.value}）</li>`;
    });
    html += "</ul>";
    resultsDiv.innerHTML = html;
  } catch (error) {
    console.error("検索失敗:", error);
    alert("検索に失敗しました");
  }
});
