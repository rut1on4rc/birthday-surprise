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
let selectedAnswer = "";

// =========================================
// NAVIGATION
// =========================================

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

// =========================================
// CONFIG TEXT
// =========================================

function setText() {
  const personName = document.getElementById("personName");
  const letterName = document.getElementById("letterName");
  const ageText = document.getElementById("ageText");
  const dateLine = document.querySelector(".date-line");
  const signature = document.querySelector(".signature");

  if (personName) personName.textContent = CONFIG.name;
  if (letterName) letterName.textContent = CONFIG.name;
  if (ageText) ageText.textContent = CONFIG.age;
  if (dateLine) {
    dateLine.textContent = `${CONFIG.date} · THE MOST SPECIAL DAY`;
  }
  if (signature) {
    signature.textContent = `— ${CONFIG.signature}`;
  }
}

// =========================================
// BACKGROUND MUSIC
// =========================================

const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");

let musicStarted = false;

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
      musicStarted = true;
      updateMusicButton();
    })
    .catch(() => {
      updateMusicButton();
    });
}

// Try autoplay
window.addEventListener("load", () => {
  if (bgMusic) {
    bgMusic.volume = 0.45;
    startMusic();
  }

  updateMusicButton();
});

// Retry after first interaction
document.addEventListener("click", () => {
  if (!musicStarted) startMusic();
}, { passive: true });

document.addEventListener("touchstart", () => {
  if (!musicStarted) startMusic();
}, { passive: true });

document.addEventListener("keydown", () => {
  if (!musicStarted) startMusic();
}, { passive: true });

// Manual music button
if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    if (bgMusic.paused) {
      bgMusic.volume = 0.45;

      bgMusic.play()
        .then(() => {
          musicStarted = true;
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

  bgMusic.addEventListener("play", updateMusicButton);
  bgMusic.addEventListener("pause", updateMusicButton);
  bgMusic.addEventListener("ended", updateMusicButton);

  updateMusicButton();
}

// =========================================
// PIN
// =========================================

function updateDots() {
  dots.forEach((dot, i) => {
    dot.classList.toggle("filled", i < pinInput.length);
  });
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

      setTimeout(() => {
        go("gift");
      }, 220);

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

// =========================================
// GIFT
// =========================================

const giftBox = document.getElementById("giftBox");

if (giftBox) {
  giftBox.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    giftBox.classList.add("open");

    setTimeout(() => {
      go("birthday");
    }, 900);
  });
}

// =========================================
// NEXT BUTTONS
// =========================================

document.querySelectorAll(".next-btn[data-next]").forEach(button => {
  button.addEventListener("click", e => {
    e.preventDefault();
    e.stopPropagation();

    const destination = button.dataset.next;

    if (destination) {
      go(destination);
    }
  });
});

// =========================================
// LETTER
// =========================================

function startLetter() {
  const letter = document.getElementById("letter");

  if (!letter) return;

  letterRun++;

  const runId = letterRun;
  const paragraphs = Array.from(
    letter.querySelectorAll("[data-letter]")
  );

  paragraphs.forEach(p => {
    if (!p.dataset.original) {
      p.dataset.original = p.textContent.trim();
    }

    p.classList.remove("showing");
    p.textContent = "";
  });

  let index = 0;

  function nextParagraph() {
    if (
      runId !== letterRun ||
      index >= paragraphs.length
    ) {
      return;
    }

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

// =========================================
// ANSWER
// =========================================

const answerNote = document.getElementById("answerNote");
const answerYes = document.getElementById("answerYes");
const answerTime = document.getElementById("answerTime");

// =========================================
// SEND ANSWER
// =========================================

function sendAnswer(answer) {
  return new Promise(resolve => {
    const email = CONFIG.responseEmail;

    if (
      !email ||
      email.includes("YOUR_EMAIL_HERE")
    ) {
      console.warn("Response email is not configured.");
      resolve(false);
      return;
    }

    if (window.location.protocol === "file:") {
      console.warn(
        "FormSubmit requires the site to be served over http/https."
      );

      resolve(false);
      return;
    }

    const iframeName =
      `formsubmit_target_${Date.now()}`;

    const iframe = document.createElement("iframe");

    iframe.name = iframeName;
    iframe.style.display = "none";

    document.body.appendChild(iframe);

    const form = document.createElement("form");

    form.method = "POST";
    form.action =
      `https://formsubmit.co/${encodeURIComponent(email)}`;

    form.target = iframeName;
    form.style.display = "none";

    const fields = {
      _subject:
        answer === "YES 💙"
          ? `💙 SHE SAID YES — ${CONFIG.name}`
          : `🥺 SHE NEEDS TIME — ${CONFIG.name}`,

      _captcha: "false",
      _template: "table",

      answer: answer,

      result:
        answer === "YES 💙"
          ? "💙 YES — She wants to give this a chance."
          : "🥺 I NEED TIME — She needs more time.",

      recipient: CONFIG.name,
      sender: CONFIG.signature,

      time: new Date().toLocaleString(
        "id-ID",
        {
          dateStyle: "full",
          timeStyle: "short"
        }
      )
    };

    Object.entries(fields).forEach(
      ([name, value]) => {
        const input =
          document.createElement("input");

        input.type = "hidden";
        input.name = name;
        input.value = value;

        form.appendChild(input);
      }
    );

    document.body.appendChild(form);

    form.submit();

    setTimeout(() => {
      form.remove();
      iframe.remove();

      resolve(true);
    }, 1200);
  });
}

// =========================================
// CUSTOM MESSAGE UI
// =========================================

function createMessageBox() {
  if (document.getElementById("customMessageBox")) {
    return;
  }

  const card =
    document.querySelector(".finale-card");

  if (!card) return;

  const box =
    document.createElement("div");

  box.id = "customMessageBox";
  box.className = "custom-message-box";

  box.innerHTML = `
    <div class="custom-message-inner">

      <p class="custom-message-title">
        💌 Ada sesuatu yang mau kamu sampaikan?
      </p>

      <textarea
        id="customMessage"
        maxlength="1000"
        placeholder="Tulis pesan kamu di sini..."
        aria-label="Pesan untuk Gustavo"
      ></textarea>

      <div class="custom-message-bottom">

        <span id="messageCount">
          0 / 1000
        </span>

        <button
          id="messageSend"
          type="button"
        >
          💌 Kirim Pesan
        </button>

      </div>

      <p
        id="messageStatus"
        class="custom-message-status"
      ></p>

    </div>
  `;

  card.appendChild(box);

  const textarea =
    document.getElementById("customMessage");

  const count =
    document.getElementById("messageCount");

  const send =
    document.getElementById("messageSend");

  if (textarea && count) {
    textarea.addEventListener("input", () => {
      count.textContent =
        `${textarea.value.length} / 1000`;
    });
  }

  if (send) {
    send.addEventListener(
      "click",
      handleCustomMessage
    );
  }
}

// =========================================
// SEND CUSTOM MESSAGE
// =========================================

function sendCustomMessage(message) {
  return new Promise(resolve => {
    const email = CONFIG.responseEmail;

    if (
      !email ||
      email.includes("YOUR_EMAIL_HERE")
    ) {
      resolve(false);
      return;
    }

    if (window.location.protocol === "file:") {
      resolve(false);
      return;
    }

    const iframeName =
      `message_target_${Date.now()}`;

    const iframe =
      document.createElement("iframe");

    iframe.name = iframeName;
    iframe.style.display = "none";

    document.body.appendChild(iframe);

    const form =
      document.createElement("form");

    form.method = "POST";

    form.action =
      `https://formsubmit.co/${encodeURIComponent(email)}`;

    form.target = iframeName;
    form.style.display = "none";

    const fields = {
      _subject:
        `💌 NEW MESSAGE — ${CONFIG.name}`,

      _captcha: "false",
      _template: "table",

      answer:
        selectedAnswer || "No answer selected",

      message: message,

      recipient: CONFIG.name,

      sender: CONFIG.signature,

      time: new Date().toLocaleString(
        "id-ID",
        {
          dateStyle: "full",
          timeStyle: "short"
        }
      )
    };

    Object.entries(fields).forEach(
      ([name, value]) => {
        const input =
          document.createElement("input");

        input.type = "hidden";
        input.name = name;
        input.value = value;

        form.appendChild(input);
      }
    );

    document.body.appendChild(form);

    form.submit();

    setTimeout(() => {
      form.remove();
      iframe.remove();

      resolve(true);
    }, 1200);
  });
}

// =========================================
// CUSTOM MESSAGE HANDLER
// =========================================

async function handleCustomMessage() {
  const textarea =
    document.getElementById("customMessage");

  const status =
    document.getElementById("messageStatus");

  const send =
    document.getElementById("messageSend");

  if (!textarea || !send) return;

  const message =
    textarea.value.trim();

  if (!message) {
    if (status) {
      status.textContent =
        "Tulis pesannya dulu ya 💙";
    }

    textarea.focus();
    return;
  }

  send.disabled = true;
  send.textContent = "Mengirim... 💌";

  if (status) {
    status.textContent =
      "Sedang mengirim pesan... 💌";
  }

  const sent =
    await sendCustomMessage(message);

  if (sent) {
    textarea.value = "";

    const count =
      document.getElementById("messageCount");

    if (count) {
      count.textContent = "0 / 1000";
    }

    send.textContent = "Terkirim 💙";

    if (status) {
      status.textContent =
        "Pesan kamu sudah terkirim. 💌✨";
    }

  } else {
    send.disabled = false;
    send.textContent = "💌 Kirim Pesan";

    if (status) {
      status.textContent =
        "Pesan belum terkirim. Coba lagi ya.";
    }
  }
}

// =========================================
// HANDLE ANSWER
// =========================================

async function handleAnswer(
  answer,
  button,
  message
) {
  if (!answerNote) return;

  selectedAnswer = answer;

  button?.classList.add("is-selected");

  if (
    answerYes &&
    button !== answerYes
  ) {
    answerYes.classList.remove("is-selected");
  }

  if (
    answerTime &&
    button !== answerTime
  ) {
    answerTime.classList.remove("is-selected");
  }

  answerNote.innerHTML =
    `${message}<br>` +
    `<span class="send-status">` +
    `Sending your answer…` +
    `</span>`;

  answerNote.classList.add("is-response");

  const sent =
    await sendAnswer(answer);

  const status =
    answerNote.querySelector(
      ".send-status"
    );

  if (status) {
    if (sent) {
      status.textContent =
        "Answer sent. 💌";
    } else if (
      window.location.protocol === "file:"
    ) {
      status.textContent =
        "Upload the website first, then try again. 🌐";
    } else {
      status.textContent =
        "Couldn’t send yet — check the FormSubmit activation email. 📩";
    }
  }

  // Show custom message box
  createMessageBox();

  const messageBox =
    document.getElementById(
      "customMessageBox"
    );

  if (messageBox) {
    messageBox.classList.add("visible");

    setTimeout(() => {
      messageBox.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 200);
  }
}

// =========================================
// ANSWER BUTTONS
// =========================================

if (answerYes && answerNote) {
  answerYes.addEventListener(
    "click",
    e => {
      e.preventDefault();
      e.stopPropagation();

      handleAnswer(
        "YES 💙",
        answerYes,
        "You just made me really happy. 💙<br>" +
        "Thank you for giving us a chance."
      );
    }
  );
}

if (answerTime && answerNote) {
  answerTime.addEventListener(
    "click",
    e => {
      e.preventDefault();
      e.stopPropagation();

      handleAnswer(
        "I NEED TIME 🌼",
        answerTime,
        "Of course. Take all the time you need. 🌼<br>" +
        "I’ll still be here, and I’ll respect your answer."
      );
    }
  );
}

// =========================================
// MOBILE + MESSAGE STYLES
// =========================================

const customMessageStyles =
  document.createElement("style");

customMessageStyles.textContent = `
  .custom-message-box {
    width: 100%;
    max-width: 520px;
    margin: 24px auto 0;
    box-sizing: border-box;
    opacity: 0;
    transform: translateY(15px);
    pointer-events: none;
    max-height: 0;
    overflow: hidden;
    transition:
      opacity .35s ease,
      transform .35s ease,
      max-height .45s ease;
  }

  .custom-message-box.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    max-height: 500px;
  }

  .custom-message-inner {
    padding: 18px;
    box-sizing: border-box;
  }

  .custom-message-title {
    margin: 0 0 12px;
    text-align: center;
    line-height: 1.5;
  }

  #customMessage {
    width: 100%;
    min-height: 120px;
    padding: 14px;
    box-sizing: border-box;
    resize: vertical;
    border-radius: 14px;
    border: 1px solid rgba(100, 160, 190, .35);
    font: inherit;
    font-size: 16px;
    line-height: 1.5;
    outline: none;
  }

  #customMessage:focus {
    border-color: rgba(70, 150, 200, .7);
    box-shadow:
      0 0 0 3px rgba(100, 190, 230, .15);
  }

  .custom-message-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 10px;
  }

  #messageCount {
    font-size: .8rem;
    opacity: .65;
    white-space: nowrap;
  }

  #messageSend {
    border: 0;
    border-radius: 999px;
    padding: 11px 18px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    min-height: 44px;
  }

  #messageSend:disabled {
    opacity: .65;
    cursor: default;
  }

  .custom-message-status {
    min-height: 20px;
    margin: 10px 0 0;
    text-align: center;
    font-size: .9rem;
    line-height: 1.4;
  }

  @media (max-width: 600px) {
    .custom-message-box {
      max-width: 100%;
    }

    .custom-message-inner {
      padding: 16px 0;
    }

    .custom-message-bottom {
      flex-direction: column;
      align-items: stretch;
    }

    #messageCount {
      text-align: right;
    }

    #messageSend {
      width: 100%;
      min-height: 48px;
    }

    #customMessage {
      min-height: 140px;
    }

    .final-actions {
      width: 100%;
    }

    .answer-btn {
      min-height: 48px;
    }
  }

  @media (max-width: 380px) {
    .custom-message-title {
      font-size: .95rem;
    }

    #customMessage {
      min-height: 120px;
    }
  }
`;

document.head.appendChild(customMessageStyles);

// =========================================
// OPENING SCREEN
// =========================================

const OPENING_DURATION_MS = 2200;

setTimeout(() => {
  const opening =
    document.getElementById("opening");

  const pin =
    document.getElementById("pin");

  if (
    opening &&
    pin &&
    opening.classList.contains("active")
  ) {
    go("pin");
  }
}, OPENING_DURATION_MS);

// =========================================
// INITIALIZE
// =========================================

setText();
updateDots();
updateMusicButton();
