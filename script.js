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

// 登録
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const grade = parseInt(document.getElementById("grade").value);
  const classNum = parseInt(document.getElementById("classNum").value);
  const number = parseInt(document.getElementById("number").value);
  const color = document.getElementById("color").value;
  const mark = document.getElementById("mark").value;
  const value = document.getElementById("value").value;

  const cardsRef = collection(db, "cards");

  // 重複チェッククエリ
  const q = query(cardsRef,
    where("grade", "==", grade),
    where("classNum", "==", classNum),
    where("number", "==", number),
    where("color", "==", color),
    where("mark", "==", mark),
    where("value", "==", value)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    alert("このカード情報はすでに登録されています！");
    return;
  }

  // 新規登録
  await addDoc(cardsRef, {
    grade, classNum, number, color, mark, value
  });

  alert("登録しました！");
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
