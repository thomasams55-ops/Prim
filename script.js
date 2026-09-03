const NTFY_TOPIC = 'tembak-jr8kQx2mZp9';
const NAMA = document.getElementById('namaCewek').textContent;

const RUNAWAY_TEXTS = [
  "Nggak dulu deh",
  "Yakin nih mau nolak?",
  "Kejar dulu makanya wkwk",
  "Eh mau kemana?",
  "Tombol sebelah kanan aja 👉",
  "Susah ya buat ditekan?",
  "Terpaksa juga gak apa-apa deh!",
  `Jangan kabur dong ${NAMA}`,
  "Pilih 'Ya' aja kenapa sih 😂"
];

// Emoji besar yang muncul di tengah layar, disesuaikan dengan kata-kata di tombol
const EMOJI_MAP = {
  "Nggak dulu deh": "🙅‍♀️",
  "Yakin nih mau nolak?": "🤨",
  "Kejar dulu makanya wkwk": "🏃‍♀️",
  "Eh mau kemana?": "👀",
  "Tombol sebelah kanan aja 👉": "👉",
  "Susah ya buat ditekan?": "😤",
  "Terpaksa juga gak apa-apa deh!": "😏",
  [`Jangan kabur dong ${NAMA}`]: "🥺",
  "Pilih 'Ya' aja kenapa sih 😂": "😂"
};

function showBigEmoji(text){
  const emoji = EMOJI_MAP[text] || "😳";
  const el = document.createElement('div');
  el.className = 'big-emoji-pop';
  el.textContent = emoji;
  const container = document.getElementById('bigEmoji');
  container.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function showResult(){
  document.getElementById('result').classList.add('show');
  document.querySelector('.choices').style.display = 'none';

  fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: 'POST',
    body: `${NAMA} klik YA! 💕 Selamat, kalian resmian sekarang.`,
    headers: { 'Title': 'Jawaban Diterima 🎉' }
  }).catch(err => console.log('Gagal kirim notifikasi:', err));
}

let lastMoveTime = 0;
let isFirstNoPress = true;

function runAway(btn){
  const now = Date.now();
  if (now - lastMoveTime < 150) return;
  lastMoveTime = now;

  // Efek emoji besar di tengah, cuma muncul saat pertama kali ditekan
  if (isFirstNoPress) {
    showBigEmoji(btn.textContent);
    isFirstNoPress = false;
  }

  const btnRect = btn.getBoundingClientRect();
  const yesRect = document.getElementById('yes').getBoundingClientRect();
  const margin = 20;
  const w = btnRect.width;
  const h = btnRect.height;

  if (btn.style.position !== 'fixed') {
    btn.style.position = 'fixed';
    btn.style.margin = '0';
    btn.style.zIndex = '9999';
  }

  const maxX = Math.max(margin, window.innerWidth - w - margin);
  const maxY = Math.max(margin, window.innerHeight - h - margin);

  // Jarak minimum dari tombol Ya, biar nggak nongol deket-deket
  const minDist = Math.max(window.innerWidth, window.innerHeight) * 0.4;
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;

  let x, y, tries = 0;
  do {
    x = margin + Math.random() * (maxX - margin);
    y = margin + Math.random() * (maxY - margin);
    const dx = (x + w / 2) - yesCenterX;
    const dy = (y + h / 2) - yesCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    tries++;
    if (dist >= minDist || tries > 20) break;
  } while (true);

  btn.style.left = x + 'px';
  btn.style.top = y + 'px';

  btn.textContent = RUNAWAY_TEXTS[Math.floor(Math.random() * RUNAWAY_TEXTS.length)];
}

// Floating hearts background
const heartsContainer = document.getElementById('hearts');
const HEART_SYMBOLS = ['💗', '💕', '💖', '🩷'];

function spawnHeart(){
  const h = document.createElement('div');
  h.className = 'heart';
  h.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (14 + Math.random() * 18) + 'px';
  const duration = 6 + Math.random() * 6;
  h.style.animationDuration = duration + 's';
  heartsContainer.appendChild(h);
  setTimeout(() => h.remove(), duration * 1000);
}

setInterval(spawnHeart, 500);
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 200);


