window.addEventListener('DOMContentLoaded', () => {
  const videoSrc = window.innerWidth < 768 ? 'videos/mobile.mp4' : 'videos/desktop.mp4';
  document.getElementById('video-source').src = videoSrc;
  document.getElementById('bg-video').load();
});

if (!localStorage.getItem('user')) {
  localStorage.setItem('user', JSON.stringify({
    id: 123456,
    username: "testuser",
    first_name: "Test",
    photo_url: "https://via.placeholder.com/120"
  }));
}

function showReviews() {
  const reviews = [
    {
      username: '@anime_fan123',
      avatar: 'https://t.me/i/userpic/320/username.jpg',
      message: 'Очень крутой сайт! Удобно и красиво :)'
    },
    {
      username: '@test_user',
      avatar: 'https://t.me/i/userpic/320/username2.jpg',
      message: 'Оставил отзыв через Telegram — всё супер!'
    }
  ];

  const container = document.getElementById('reviews');
  container.innerHTML = '';
  reviews.forEach(r => {
    container.innerHTML += `
      <div class="review">
        <img src="${r.avatar}" alt="avatar" />
        <div class="content">
          <strong>${r.username}</strong><br/>
          ${r.message}
        </div>
      </div>
    `;
  });
  container.style.display = 'block';
}

function leaveReview() {
  window.open('https://t.me/your_bot?start=leave_review', '_blank');
}
function onTelegramAuth(user) {
  localStorage.setItem('user', JSON.stringify(user));
  alert(`Привет, ${user.first_name}!`);
}

function sendReview(text) {
  const user = JSON.parse(localStorage.getItem('user'));
  const review = {
    id: user.id,
    username: '@' + user.username,
    name: user.first_name,
    avatar: user.photo_url,
    text: text,
    timestamp: Date.now(),
    likes: 0
  };
  db.ref('reviews').push(review);
}

function loadReviews() {
  const container = document.getElementById('reviews');
  container.innerHTML = '';
  db.ref('reviews').on('value', snapshot => {
    const reviews = snapshot.val();
    let count = 0;
    for (let key in reviews) {
      count++;
      const r = reviews[key];
      container.innerHTML += `
        <div class="review">
          <img src="${r.avatar}" />
          <div class="content">
            <strong>${r.username}</strong><br/>
            ${r.text}
            <div class="likes">❤️ ${r.likes} <button onclick="likeReview('${key}')">+</button></div>
          </div>
        </div>
      `;
    }
    document.getElementById('review-count').innerText = `Всего отзывов: ${count}`;
  });
}

function likeReview(id) {
  const ref = db.ref('reviews/' + id + '/likes');
  ref.transaction(current => (current || 0) + 1);
}

function filterReviews() {
  const searchValue = document.getElementById('search').value.toLowerCase();
  const reviews = document.querySelectorAll('.review');
  reviews.forEach(r => {
    const text = r.innerText.toLowerCase();
    r.style.display = text.includes(searchValue) ? 'flex' : 'none';
  });
}
