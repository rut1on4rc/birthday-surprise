const CONFIG = {
  name: "Nanda Kurnia Ramadani",
  age: "",
  date: "29 SEPTEMBER",
  pin: "2908",
  signature: "Gustavo",
  responseEmail: "rution969@gmail.com"
};

const screens = Array.from(document.querySelectorAll(".screen"));
const dots = Array.from(document.querySelectorAll("#dots i"));
let pinInput = "";
let letterRun = 0;

function go(id) {
  const target = document.getElementById(id);
  if (!target) return;
  screens.forEach(screen => {
    const active = screen === target;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", active ? "false" : "true");
  });
  target.scrollTop = 0;
  window.scrollTo(0, 0);

  if (id === "letter") {
    startLetter();
  }
}

window.go = go;
window.show = go;

function setText() {
  const personName = document.getElementById("personName");
  const letterName = document.getElementById("letterName");
  const ageText = document.getElementById("ageText");
  const dateLine = document.querySelector(".date-line");
  const signature = document.querySelector(".signature");

  if (personName) personName.textContent = CONFIG.name;
  if (letterName) letterName.textContent = CONFIG.name;
  if (ageText) ageText.textContent = CONFIG.age;
  if (dateLine) dateLine.textContent = `${CONFIG.date} · THE MOST SPECIAL DAY`;
  if (signature) signature.textContent = `— ${CONFIG.signature}`;
}

// Background music: try autoplay immediately, then retry on the first user
// interaction anywhere on the page. Browsers may still block audible autoplay,
// but this gives the smoothest possible behavior without requiring a Play button.
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicStarted = false;

async function startMusic() {
  if (!bgMusic || musicStarted) return true;
  try {
    bgMusic.volume = 0.55;
    await bgMusic.play();
    musicStarted = true;
    musicToggle?.classList.add("playing");
    return true;
  } catch (err) {
    console.warn("Music autoplay was blocked; waiting for user interaction.", err);
    return false;
  }
}

// Best-effort autoplay on page load. Chrome/Safari may reject this if there is
// no prior user gesture. In that case the listeners below retry silently on
// the first click/tap/key press anywhere on the page.
if (bgMusic) {
  bgMusic.volume = 0.55;
  bgMusic.load();
  startMusic();

  const unlockMusic = () => {
    startMusic();
    if (musicStarted) {
      window.removeEventListener("pointerdown", unlockMusic);
      window.removeEventListener("touchstart", unlockMusic);
      window.removeEventListener("keydown", unlockMusic);
    }
  };

  window.addEventListener("pointerdown", unlockMusic, { passive: true });
  window.addEventListener("touchstart", unlockMusic, { passive: true });
  window.addEventListener("keydown", unlockMusic);
}

if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", async e => {
    e.preventDefault();
    e.stopPropagation();
    if (bgMusic.paused) {
      try {
        bgMusic.volume = 0.55;
        await bgMusic.play();
        musicStarted = true;
        musicToggle.classList.add("playing");
      } catch (err) {
        console.warn("Could not play music:", err);
      }
    } else {
      bgMusic.pause();
      musicToggle.classList.remove("playing");
    }
  });
}

function updateDots() {
  dots.forEach((dot, i) => dot.classList.toggle("filled", i < pinInput.length));
}

function resetPin() {
  pinInput = "";
  updateDots();
}

function handlePin(key) {
  if (key === "clear") {
    resetPin();
    return;
  }

  if (key === "back") {
    pinInput = pinInput.slice(0, -1);
    updateDots();
    return;
  }

  if (!/^\d$/.test(key) || pinInput.length >= 4) return;

  pinInput += key;
  updateDots();

  if (pinInput.length === 4) {
    if (pinInput === CONFIG.pin) {
      resetPin();
      setTimeout(() => go("gift"), 220);
    } else {
      const card = document.querySelector("#pin .card");
      if (card) {
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
      }
      setTimeout(resetPin, 420);
    }
  }
}

document.querySelectorAll("#pin .keypad button").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    startMusic();
    handlePin(button.dataset.key);
  });
});

const giftBox = document.getElementById("giftBox");
if (giftBox) {
  giftBox.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    giftBox.classList.add("open");
    setTimeout(() => go("birthday"), 900);
  });
}

document.querySelectorAll(".next-btn[data-next]").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const destination = button.dataset.next;
    if (destination) go(destination);
  });
});

function startLetter() {
  const letter = document.getElementById("letter");
  if (!letter) return;

  letterRun++;
  const runId = letterRun;
  const paragraphs = Array.from(letter.querySelectorAll("[data-letter]"));

  paragraphs.forEach(p => {
    if (!p.dataset.original) p.dataset.original = p.textContent.trim();
    p.classList.remove("showing");
    p.textContent = "";
  });

  let index = 0;

  function nextParagraph() {
    if (runId !== letterRun || index >= paragraphs.length) return;

    const p = paragraphs[index++];
    const text = p.dataset.original || "";
    p.classList.add("showing");

    let char = 0;
    const timer = setInterval(() => {
      if (runId !== letterRun) {
        clearInterval(timer);
        return;
      }

      char++;
      p.textContent = text.slice(0, char);

      if (char >= text.length) {
        clearInterval(timer);
        setTimeout(nextParagraph, 650);
      }
    }, 24);
  }

  nextParagraph();
}


const answerNote = document.getElementById("answerNote");
const answerYes = document.getElementById("answerYes");
const answerTime = document.getElementById("answerTime");

// FormSubmit works through a normal POST as well as AJAX. We use a hidden iframe
// + real HTML form submission here because it is more reliable on static hosting.
function sendAnswer(answer) {
  return new Promise(resolve => {
    const email = CONFIG.responseEmail;
    if (!email || email.includes("YOUR_EMAIL_HERE")) {
      console.warn("Response email is not configured.");
      resolve(false);
      return;
    }

    if (window.location.protocol === "file:") {
      console.warn("FormSubmit requires the site to be served over http/https, not opened directly as a file.");
      resolve(false);
      return;
    }

    const iframeName = `formsubmit_target_${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.method = "POST";
    form.action = `https://formsubmit.co/${encodeURIComponent(email)}`;
    form.target = iframeName;
    form.style.display = "none";

    const fields = {
      _subject: `Birthday Surprise — ${CONFIG.name} answered`,
      _captcha: "false",
      _template: "table",
      answer,
      recipient: CONFIG.name,
      sender: CONFIG.signature,
      time: new Date().toLocaleString("id-ID", {
        dateStyle: "full",
        timeStyle: "short"
      })
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);

    // A normal form POST cannot expose a reliable success response because the
    // destination is cross-origin, so show the status after the request is sent.
    form.submit();
    setTimeout(() => {
      form.remove();
      iframe.remove();
      resolve(true);
    }, 1200);
  });
}

async function handleAnswer(answer, button, message) {
  if (!answerNote) return;

  button?.classList.add("is-selected");
  if (answerYes && button !== answerYes) answerYes.classList.remove("is-selected");
  if (answerTime && button !== answerTime) answerTime.classList.remove("is-selected");

  answerNote.innerHTML = `${message}<br><span class="send-status">Sending your answer…</span>`;
  answerNote.classList.add("is-response");

  const sent = await sendAnswer(answer);
  const status = answerNote.querySelector(".send-status");
  if (status) {
    if (sent) {
      status.textContent = "Answer sent. 💌";
    } else if (window.location.protocol === "file:") {
      status.textContent = "Upload the website first, then try again. 🌐";
    } else {
      status.textContent = "Couldn’t send yet — check the FormSubmit activation email. 📩";
    }
  }
}

if (answerYes && answerNote) {
  answerYes.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    handleAnswer(
      "YES 💙",
      answerYes,
      "You just made me really happy. 💙<br>Thank you for giving us a chance."
    );
  });
}

if (answerTime && answerNote) {
  answerTime.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();
    handleAnswer(
      "I NEED TIME 🌼",
      answerTime,
      "Of course. Take all the time you need. 🌼<br>I’ll still be here, and I’ll respect your answer."
    );
  });
}

// Opening screen fix: automatically advance to the PIN after the short intro.
// This must be explicit because the opening screen is intentionally marked
// "active" in the HTML and otherwise has no event that advances it.
const OPENING_DURATION_MS = 2200;
setTimeout(() => {
  const opening = document.getElementById("opening");
  const pin = document.getElementById("pin");
  if (opening && pin && opening.classList.contains("active")) {
    go("pin");
  }
}, OPENING_DURATION_MS);

// ===============================
// BACKGROUND MUSIC
// ===============================
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

function updateMusicButton() {
  if (!musicToggle || !bgMusic) return;

  if (bgMusic.paused) {
    musicToggle.textContent = "▶";
    musicToggle.setAttribute("aria-label", "Play music");
    musicToggle.classList.remove("playing");
  } else {
    musicToggle.textContent = "⏸";
    musicToggle.setAttribute("aria-label", "Pause music");
    musicToggle.classList.add("playing");
  }
}

function startMusic() {
  if (!bgMusic || !bgMusic.paused) return;

  bgMusic.volume = 0.45;

  bgMusic.play()
    .then(() => {
      updateMusicButton();
    })
    .catch(() => {
      updateMusicButton();
    });
}

// Coba autoplay saat halaman dibuka
window.addEventListener("load", () => {
  startMusic();
});

// Kalau autoplay diblokir,
// musik mulai pada interaksi pertama user.
document.addEventListener("click", startMusic);
document.addEventListener("touchstart", startMusic);
document.addEventListener("keydown", startMusic);

// Tombol musik manual
if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (bgMusic.paused) {
      bgMusic.play()
        .then(() => {
          updateMusicButton();
        })
        .catch(() => {
          updateMusicButton();
        });
    } else {
      bgMusic.pause();
      updateMusicButton();
    }
  });

  // Sinkron otomatis kalau audio berubah
  bgMusic.addEventListener("play", updateMusicButton);
  bgMusic.addEventListener("pause", updateMusicButton);
  bgMusic.addEventListener("ended", updateMusicButton);

  // Set tampilan tombol saat awal
  updateMusicButton();
}
