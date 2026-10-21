// Ganti detail personal di objek ini; foto dan audio berada di folder assets.
const PERSONAL = {
  wifeName: 'ISTRIKU',
  yourName: 'SUAMIMU',
  opening: 'Terima kasih untuk segalanya...',
  closing: 'Selamat ulang tahun, sayang. Terima kasih sudah menjadi bagian terindah dalam hidupku. Aku mencintaimu, hari ini dan setiap hari.',
  messages: [
    'Bersamamu, hal-hal sederhana selalu terasa istimewa. Terima kasih sudah membuat hari-hariku lebih hangat.',
    'Tawamu adalah salah satu suara favoritku. Semoga tahun ini memberimu banyak alasan untuk tertawa.',
    'Aku mencintai bukan hanya momen besar, tetapi juga hari-hari biasa yang kita jalani berdampingan.',
    'lahirnya anak pertama kita, momen membahagiakan dimana kita menjadi orang tua dan belajar menjadi keluarga yang utuh',
    'Terima kasih sudah terus berjalan bersamaku, saling belajar, dan tumbuh menjadi kita.',
    'Semoga perjalanan kita ke depan dipenuhi hal-hal baik. Aku tak sabar menulis lebih banyak cerita bersamamu.'
  ]
};

const setText = (selector, value) => document.querySelectorAll(selector).forEach((node) => { node.textContent = value; });
setText('[data-wife-name]', PERSONAL.wifeName);
setText('[data-opening]', PERSONAL.opening);
setText('[data-closing]', PERSONAL.closing);
setText('.closing-signature span', PERSONAL.yourName);
PERSONAL.messages.forEach((message, index) => setText(`[data-message="${index}"]`, message));

const cards = [...document.querySelectorAll('[data-card]')];
function flipCard(card) {
  const flipped = card.classList.toggle('is-flipped');
  card.setAttribute('aria-pressed', String(flipped));
}
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
cards.forEach((card) => {
  if (finePointer.matches) {
    card.addEventListener('pointerenter', () => card.classList.add('is-hovered'));
    card.addEventListener('pointerleave', () => card.classList.remove('is-hovered'));
  }
  card.addEventListener('click', () => {
    card.classList.remove('is-hovered');
    flipCard(card);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      flipCard(card);
    }
    if (event.key === 'Escape' && card.classList.contains('is-flipped')) {
      card.classList.remove('is-flipped');
      card.setAttribute('aria-pressed', 'false');
    }
  });
});

// One Audio element is reused. Playback is only attempted after a user action.
const audio = document.getElementById('birthday-audio');
const toggle = document.getElementById('music-toggle');
const status = document.getElementById('music-status');
const widget = document.querySelector('.music-widget');
let audioUnavailable = false;
function setMusicState(playing, message) {
  toggle.setAttribute('aria-pressed', String(playing));
  toggle.setAttribute('aria-label', playing ? 'Jeda musik' : 'Putar musik');
  toggle.querySelector('.music-button-label').textContent = playing ? 'Jeda musik' : 'Putar musik';
  status.textContent = message;
  widget.classList.toggle('is-playing', playing);
}
function markUnavailable() {
  audioUnavailable = true;
  toggle.disabled = true;
  setMusicState(false, 'Tambahkan file romantic-song.mp3 untuk memutar musik');
}
audio.addEventListener('error', markUnavailable);
audio.addEventListener('playing', () => setMusicState(true, 'Musik sedang diputar'));
audio.addEventListener('pause', () => { if (!audioUnavailable) setMusicState(false, 'Musik dijeda'); });
toggle.addEventListener('click', async () => {
  if (audioUnavailable) return;
  if (!audio.paused) { audio.pause(); return; }
  try {
    await audio.play();
  } catch (error) {
    if (audio.error || error.name === 'NotSupportedError') markUnavailable();
    else setMusicState(false, 'Pemutaran belum diizinkan. Coba tekan lagi.');
  }
});

// Browsers permit audible playback only after a user gesture. The first gesture
// anywhere on the page is the opt-in; the floating button remains an explicit control.
let firstGestureHandled = false;
async function startAfterGesture(event) {
  if (firstGestureHandled) return;
  firstGestureHandled = true;
  // Let the control's click handler own this gesture so it cannot pause playback.
  if (event.target.closest('#music-toggle')) return;
  if (audioUnavailable || !audio.paused) return;
  try {
    await audio.play();
  } catch (error) {
    if (audio.error || error.name === 'NotSupportedError') markUnavailable();
    else setMusicState(false, 'Tekan tombol musik untuk mencoba memutar');
  }
}
document.addEventListener('pointerdown', startAfterGesture, { once: true });
document.addEventListener('keydown', startAfterGesture, { once: true });
