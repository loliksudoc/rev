
window.addEventListener('DOMContentLoaded', () => {
  const videoSrc = window.innerWidth < 768 ? 'videos/mobile.mp4' : 'videos/desktop.mp4';
  document.getElementById('video-source').src = videoSrc;
  document.getElementById('bg-video').load();

  let user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  if (!user) {
    user = JSON.parse(localStorage.getItem('user')) || {
      id: 123456,
      first_name: "Гость",
      username: "guest",
      photo_url: "https://via.placeholder.com/120"
    };const firebaseConfig = {
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
    
    let userName = "Гость";
    let userAvatar = "image.png";
    
    // Загрузка отзывов
    function showReviews() {
      const container = document.getElementById("reviews-container");
      container.innerHTML = "<p>Загрузка...</p>";
      db.ref("reviews").once("value", (snapshot) => {
        const data = snapshot.val();
        container.innerHTML = "";
        let count = 0;
        for (let key in data) {
          const review = data[key];
          const block = document.createElement("div");
          block.classList.add("review-block");
          block.innerHTML = `
            <div class="review-header">
              <img src="${review.avatar}" class="review-avatar">
              <strong>@${review.username}</strong>
            </div>
            <p>${review.text}</p>
          `;
          container.appendChild(block);
          count++;
        }
        document.getElementById("review-count").innerText = `Всего отзывов: ${count}`;
      });
    }
    
    // Открыть форму
    function openReviewForm() {
      document.getElementById("review-form").style.display = "block";
    }
    
    // Отправить отзыв
    function submitReview() {
      const text = document.getElementById("review-input").value;
      if (text.length < 3) {
        alert("Отзыв слишком короткий!");
        return;
      }
      const newReview = {
        username: userName,
        avatar: userAvatar,
        text: text
      };
      db.ref("reviews").push(newReview, () => {
        alert("✅ Отзыв отправлен!");
        document.getElementById("review-input").value = "";
        showReviews();
      });
    }
    
    // Telegram WebApp
    if (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
      const tg = Telegram.WebApp.initDataUnsafe.user;
      if (tg) {
        userName = tg.username || tg.first_name;
        userAvatar = `https://t.me/i/userpic/320/${tg.username}.jpg`;
        document.getElementById("user-name").innerText = "@" + userName;
        document.getElementById("user-avatar").src = userAvatar;
      }
    }
    
    // Автоопределение видео по устройству
    const video = document.getElementById('bg-video');
    const videoSrc = document.getElementById('video-source');
    
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      videoSrc.src = 'videos/mobile.mp4';
    } else {
      videoSrc.src = 'videos/desktop.mp4';
    }
    video.load();
    
  } else {
    localStorage.setItem('user', JSON.stringify(user));
  }

  const username = user.username || `${user.first_name}_${user.id}`;
  document.getElementById("user-name").innerText = "@" + username;
  document.getElementById("user-avatar").src = user.photo_url;

  firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  });

  const db = firebase.database();

  const search = document.getElementById("search");
  const container = document.getElementById("reviews-container");

  function loadReviews() {
    db.ref("reviews").on("value", (snapshot) => {
      const data = snapshot.val();
      container.innerHTML = "";
      let count = 0;
      for (let key in data) {
        const r = data[key];
        const div = document.createElement("div");
        div.innerHTML = `<strong>@${r.username}</strong>: ${r.text}`;
        container.appendChild(div);
        count++;
      }
      document.getElementById("review-count").innerText = `Всего отзывов: ${count}`;
    });
  }

  search.addEventListener("input", () => {
    const query = search.value.toLowerCase();
    const all = container.querySelectorAll("div");
    all.forEach(el => {
      el.style.display = el.innerText.toLowerCase().includes(query) ? "" : "none";
    });
  });

  window.showReviews = loadReviews;

  window.openReviewForm = () => {
    document.getElementById("review-form").style.display = "block";
  }

  window.submitReview = () => {
    const text = document.getElementById("review-input").value;
    if (!text) return alert("Введите текст");
    const newRef = db.ref("reviews").push();
    newRef.set({
      user_id: user.id,
      username: username,
      text: text,
      photo_url: user.photo_url || ""
    });
    alert("Спасибо за отзыв!");
    document.getElementById("review-form").style.display = "none";
    document.getElementById("review-input").value = "";
  }

  loadReviews();
});
