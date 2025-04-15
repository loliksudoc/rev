const firebaseConfig = {
  apiKey: "AIzaSyC83E0zz8J6TTlBFt9lN2l36holVgJMzt4",
  authDomain: "revv-d414a.firebaseapp.com",
  projectId: "revv-d414a",
  storageBucket: "revv-d414a.appspot.com",
  messagingSenderId: "45145521283",
  appId: "1:45145521283:web:76796e9b1c31527dc66fb6",
  measurementId: "G-2DJJENHFW3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let userName = null;
let userAvatar = null;
let userId = null;

// Telegram WebApp auth
if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe?.user) {
  const user = Telegram.WebApp.initDataUnsafe.user;
  userName = user.username || user.first_name;
  userAvatar = `https://t.me/i/userpic/320/${user.username}.jpg`;
  userId = user.id;

  document.getElementById("user-name").innerHTML = `<a href="https://t.me/${user.username}" target="_blank">@${userName}</a>`;
  document.getElementById("user-avatar").src = userAvatar;
} else {
  alert("⚠️ Вход возможен только через Telegram WebApp. Зайдите через Telegram.");
}

// Показ отзывов
function showReviews() {
  const container = document.getElementById("reviews-container");
  container.innerHTML = "<p>Загрузка...</p>";
  db.ref("reviews").once("value", (snapshot) => {
    const data = snapshot.val();
    container.innerHTML = "";
    let count = 0;
    if (data) {
      for (let key in data) {
        const review = data[key];
        const block = document.createElement("div");
        block.classList.add("review-block");
        block.innerHTML = `
          <div class="review-header">
            <img src="${review.avatar}" class="review-avatar">
            <strong><a href="tg://user?id=${review.userId}" target="_blank">@${review.username}</a></strong>
          </div>
          <p>${review.text}</p>
        `;
        container.appendChild(block);
        count++;
      }
    }
    document.getElementById("review-count").innerText = `Всего отзывов: ${count}`;
  });
}

// Показ формы
function openReviewForm() {
  document.getElementById("review-form").style.display = "block";
}

// Отправка отзыва
function submitReview() {
  const text = document.getElementById("review-input").value.trim();
  if (!userName || !userId) {
    alert("⚠️ Не удалось определить пользователя. Зайдите через Telegram WebApp.");
    return;
  }
  if (text.length < 3) {
    alert("❗ Отзыв слишком короткий.");
    return;
  }

  const newReview = {
    username: userName,
    avatar: userAvatar,
    userId: userId,
    text: text
  };

  db.ref("reviews").push(newReview, (error) => {
    if (error) {
      alert("❌ Ошибка при отправке отзыва. Попробуйте позже.");
    } else {
      alert("✅ Отзыв отправлен!");
      document.getElementById("review-input").value = "";
      showReviews();
    }
  });
}

// Адаптивный фон
const videoSrc = document.getElementById('video-source');
if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
  videoSrc.src = 'videos/mobile.mp4';
} else {
  videoSrc.src = 'videos/desktop.mp4';
}
document.getElementById('bg-video').load();
