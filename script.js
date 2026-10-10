/* Pocket Giggles — homepage fun & secrets.
 *
 * Easter eggs (shh!):
 *   1. Coin hunt — 5 hidden coins. Find them all for the Golden Pocket.
 *   2. Click the brass jeans button 5 times… it pops off!
 *   3. Rummage in the mystery pockets to find pocket lint.
 *   4. Type "capy" (or tap "capybara" in the footer) for a capybara parade.
 *   5. Type "giggle" and everything giggles.
 *   6. Konami code (↑↑↓↓←→←→BA) for disco pockets.
 *   7. Hover the capy for a few seconds and it finds a yuzu.
 *   8. Sit still and the capy will call you over.
 *   9. Visit at night (8pm–6am) and the capy is asleep. Try ?night / ?day.
 *  10. Leave the tab and the capy misses you.
 *  11. Open the browser console. 👀
 */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const body = document.body;
  const fx = $("#fx");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem("pg:" + key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("pg:" + key, JSON.stringify(value)); } catch { /* private mode */ }
    },
  };

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Sound: tiny synth blips, no audio files ---------- */

  let soundOn = store.get("sound", true);
  let audio;
  const soundBtn = $("#soundToggle");

  function renderSoundBtn() {
    soundBtn.textContent = soundOn ? "🔊" : "🔇";
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.setAttribute("aria-label", soundOn ? "Sound on" : "Sound off");
  }
  renderSoundBtn();

  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    store.set("sound", soundOn);
    renderSoundBtn();
    if (soundOn) sfx.pop();
  });

  function tone(freq, start, dur, type = "sine", vol = 0.12) {
    if (!soundOn) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const t = audio.currentTime + start;
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain).connect(audio.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch { /* no audio, no problem */ }
  }

  const sfx = {
    pop: () => { tone(520, 0, 0.12, "triangle"); tone(780, 0.05, 0.1, "triangle"); },
    coin: () => { tone(988, 0, 0.1, "square", 0.06); tone(1319, 0.08, 0.3, "square", 0.06); },
    giggle: () => [660, 880, 700, 940, 760, 1000].forEach((f, i) => tone(f, i * 0.07, 0.08, "sine", 0.1)),
    boing: () => { tone(200, 0, 0.3, "sawtooth", 0.05); tone(400, 0.05, 0.25, "triangle", 0.08); },
    rustle: () => [0, 0.05, 0.11, 0.16].forEach((s) => tone(rand(180, 320), s, 0.05, "sawtooth", 0.03)),
    march: () => [523, 659, 784, 659, 523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.15, 0.12, "square", 0.04)),
    fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.12, i === 5 ? 0.6 : 0.14, "square", 0.05)),
  };

  /* ---------- Toast ---------- */

  const toastEl = $("#toast");
  let toastTimer;
  function toast(html, ms = 2800) {
    toastEl.innerHTML = html;
    toastEl.classList.add("is-showing");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-showing"), ms);
  }

  /* ---------- Logo letters (so they can giggle one by one) ---------- */

  const logo = $("#logo");
  const label = logo.textContent;
  logo.setAttribute("aria-label", label);
  logo.innerHTML = [...label]
    .map((ch, i) => ch === " "
      ? '<span class="space" aria-hidden="true"> </span>'
      : `<span class="letter" aria-hidden="true" style="animation-delay:${i * -0.07}s">${ch}</span>`)
    .join("");
  $$(".letter", logo).forEach((l) => l.addEventListener("mouseenter", () => tone(rand(500, 900), 0, 0.06, "sine", 0.05)));

  /* ---------- Night time ---------- */

  const params = new URLSearchParams(location.search);
  const hour = new Date().getHours();
  const isNight = params.has("night") || (!params.has("day") && (hour >= 20 || hour < 6));
  if (isNight) body.classList.add("night");

  const stars = $(".stars");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("i");
    s.style.left = rand(0, 100) + "%";
    s.style.top = rand(0, 100) + "%";
    s.style.animationDelay = rand(0, 2) + "s";
    const size = rand(2, 5);
    s.style.width = s.style.height = size + "px";
    stars.appendChild(s);
  }

  /* ---------- Coin hunt ---------- */

  const COINS = ["loop", "hem", "lint", "button", "parade"];
  let found = new Set(store.get("coins", []).filter((c) => COINS.includes(c)));
  const counter = $("#coinCounter");
  const countEl = $("#coinCount");

  function renderCoins(bump) {
    countEl.textContent = found.size;
    counter.hidden = found.size === 0;
    if (bump) {
      counter.classList.remove("is-bumped");
      void counter.offsetWidth;
      counter.classList.add("is-bumped");
    }
  }

  function collectCoin(id, el) {
    if (el) el.classList.add("is-found");
    if (found.has(id)) return;
    found.add(id);
    store.set("coins", [...found]);
    sfx.coin();
    renderCoins(true);
    if (found.size === COINS.length) {
      setTimeout(goGolden, 500);
    } else {
      const left = COINS.length - found.size;
      toast(`<span class="big">🪙</span>You found a coin! ${left} more hiding…`);
    }
  }

  function wireCoin(el) {
    const id = el.dataset.coin;
    if (found.has(id)) { el.remove(); return; }
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      collectCoin(id, el);
      setTimeout(() => el.remove(), 700);
    });
  }
  $$("[data-coin]").forEach(wireCoin);

  // Drop a clickable coin somewhere on screen (for coins earned by doing things).
  function dropCoin(id, x, y) {
    if (found.has(id)) return;
    const c = document.createElement("button");
    c.type = "button";
    c.className = "coin coin--loose";
    c.dataset.coin = id;
    c.setAttribute("aria-label", "A shiny coin! Grab it!");
    c.style.left = Math.min(Math.max(x, 12), window.innerWidth - 40) + "px";
    c.style.top = Math.min(Math.max(y, 12), window.innerHeight - 40) + "px";
    document.body.appendChild(c);
    wireCoin(c);
    c.animate(
      [{ transform: "translateY(-60px) scale(.3)", opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 500, easing: "cubic-bezier(.3,1.6,.5,1)" }
    );
  }

  function goGolden() {
    body.classList.add("golden");
    store.set("golden", true);
    sfx.fanfare();
    confetti(120);
    toast('<span class="big">👑</span>All 5 coins! Capy crowns you <b>Pocket Champion!</b>', 5000);
  }

  if (store.get("golden", false) && found.size === COINS.length) body.classList.add("golden");
  renderCoins(false);

  /* ---------- Confetti ---------- */

  const CONFETTI_COLORS = ["#ffc94a", "#ff6fae", "#2ec4b6", "#8b6cf0", "#fff8e7", "#ff8a3d"];
  function confetti(n = 80) {
    if (reducedMotion) return;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i");
      p.className = "confetti";
      p.style.left = rand(0, 100) + "vw";
      p.style.background = pick(CONFETTI_COLORS);
      p.style.setProperty("--dur", rand(2.2, 4) + "s");
      p.style.setProperty("--drift", rand(-120, 120) + "px");
      p.style.setProperty("--spin", rand(360, 1080) + "deg");
      p.style.animationDelay = rand(0, 0.6) + "s";
      p.addEventListener("animationend", () => p.remove());
      fx.appendChild(p);
    }
  }

  /* ---------- The jeans button pops off ---------- */

  const jeansBtn = $("#jeansButton");
  let btnClicks = 0;
  let btnTimer;
  jeansBtn.addEventListener("click", () => {
    if (jeansBtn.classList.contains("is-popped")) return;
    btnClicks++;
    clearTimeout(btnTimer);
    btnTimer = setTimeout(() => { btnClicks = 0; }, 1500);

    if (btnClicks < 5) {
      sfx.pop();
      jeansBtn.classList.remove("is-wobbly");
      void jeansBtn.offsetWidth;
      jeansBtn.classList.add("is-wobbly");
      if (btnClicks === 3) toast("Careful… it's getting loose! 😬", 1600);
      return;
    }

    btnClicks = 0;
    sfx.boing();
    jeansBtn.style.setProperty("--pop-x", (Math.random() < 0.5 ? -1 : 1) * rand(100, 180) + "px");
    jeansBtn.classList.add("is-popped");
    toast('<span class="big">😱</span>POP! The button flew off! Good thing these pants have a belt.', 3200);
    const r = jeansBtn.getBoundingClientRect();
    setTimeout(() => dropCoin("button", r.left + r.width / 2 - 14, r.top + r.height + 16), 350);
    jeansBtn.addEventListener("animationend", () => jeansBtn.classList.remove("is-popped"), { once: true });
  });

  /* ---------- Mystery pockets: rummage for pocket lint ---------- */

  const LINT = [
    ["🧦", "One sock. Where's the other one?!"],
    ["🪨", "A very cool rock. 10/10 rock."],
    ["🐞", "A ladybug! She says hi."],
    ["🍬", "A candy wrapper… someone ate the candy."],
    ["🧷", "A safety pin. Safe and sound!"],
    ["🔘", "A button! Not the kind you press."],
    ["🖍️", "A crayon. The color is 'Capybara Brown'."],
    ["🐛", "A wiggly worm! Wiggle wiggle."],
    ["🎟️", "A ticket to… a game that isn't ready yet!"],
    ["☁️", "Pocket fluff. Extremely fluffy."],
    ["🦷", "A tiny tooth?! The tooth fairy missed one."],
    ["🥨", "Half a pretzel. Still crunchy!"],
    ["📝", "A note: \"New game coming soon. Don't tell anyone.\""],
    ["🧵", "Shh! This game is still being sewn."],
  ];
  let lintBag = [];
  let rummages = 0;

  $$(".pocket--soon").forEach((pocket) => {
    pocket.addEventListener("click", () => {
      rummages++;
      sfx.rustle();
      pocket.classList.remove("is-rummaging");
      void pocket.offsetWidth;
      pocket.classList.add("is-rummaging");

      const r = pocket.getBoundingClientRect();
      if (rummages === 4 && !found.has("lint")) {
        toast('<span class="big">✨</span>Wait… something shiny is in here!');
        dropCoin("lint", r.left + r.width / 2 - 14, r.top + r.height * 0.15);
        return;
      }
      if (!lintBag.length) lintBag = [...LINT].sort(() => Math.random() - 0.5);
      const [emoji, text] = lintBag.pop();
      toast(`<span class="big">${emoji}</span>${text}`);
    });
  });

  /* ---------- Capy: idle calling, yuzu, tab title ---------- */

  const capy = $("#capyPocket");

  // Sit still for a bit and the capy calls you over.
  let idleTimer;
  const CALLS = ["psst… wanna play?", "over here! 👋", "pick me! pick me!", "I'm in the pocket!"];
  function resetIdle() {
    capy.classList.remove("is-calling");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      $(".speech", capy).textContent = isNight ? "zzz… oh! wanna play?" : pick(CALLS);
      capy.classList.add("is-calling");
      sfx.pop();
    }, 15000);
  }
  ["pointermove", "keydown", "scroll", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, resetIdle, { passive: true })
  );
  resetIdle();

  // Hover the capy long enough and it finds a yuzu (capybaras love yuzu baths).
  let yuzuTimer;
  capy.addEventListener("mouseenter", () => {
    yuzuTimer = setTimeout(() => {
      if (capy.classList.contains("has-yuzu")) return;
      capy.classList.add("has-yuzu");
      sfx.pop();
      toast('<span class="big">🍊</span>Capy found a yuzu! Very relaxing.');
    }, 3000);
  });
  capy.addEventListener("mouseleave", () => clearTimeout(yuzuTimer));

  // A little giggle when you actually head into the game.
  capy.addEventListener("click", () => sfx.giggle());

  // The capy misses you when you switch tabs.
  const realTitle = document.title;
  let titleTimer;
  document.addEventListener("visibilitychange", () => {
    clearTimeout(titleTimer);
    if (document.hidden) {
      document.title = "Come back! The capy misses you 🥺";
    } else {
      document.title = "Yay, you're back! 🎉";
      titleTimer = setTimeout(() => { document.title = realTitle; }, 2000);
    }
  });

  /* ---------- Capybara parade ---------- */

  const RIDERS = ["🐤", "🍊", "🐸", "", "🦋", "🐢", ""];
  let parading = false;
  function parade() {
    if (parading) return;
    parading = true;
    sfx.march();
    toast('<span class="big">🎺</span>Capybara parade!', 2200);

    const count = 7;
    const dur = reducedMotion ? 0.01 : 9;
    for (let i = 0; i < count; i++) {
      const c = document.createElement("div");
      c.className = "parade-capy";
      c.style.setProperty("--dur", dur + "s");
      c.style.animationDelay = i * 0.9 + "s";
      c.style.width = (i === count - 1 ? 70 : rand(100, 130)) + "px"; // the last one is a baby
      const rider = RIDERS[i % RIDERS.length];
      c.innerHTML = `<svg viewBox="0 0 150 100"><use href="#capy-walk"/></svg>${rider ? `<span class="rider">${rider}</span>` : ""}`;
      c.addEventListener("animationend", (e) => {
        if (e.target !== c) return;
        c.remove();
        if (i === count - 1) {
          parading = false;
          // The baby capy drops a coin on its way out.
          dropCoin("parade", window.innerWidth - 70, window.innerHeight - 70);
        }
      });
      fx.appendChild(c);
    }
  }
  $("#capyWord").addEventListener("click", parade);

  /* ---------- Secret words & the Konami code ---------- */

  const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let keys = [];
  let typed = "";

  function giggleMode() {
    body.classList.add("giggling");
    sfx.giggle();
    setTimeout(sfx.giggle, 600);
    toast('<span class="big">🤭</span>Hee hee hee! Everything has the giggles!');
    setTimeout(() => body.classList.remove("giggling"), 4000);
  }

  function discoMode() {
    body.classList.add("disco");
    confetti(80);
    sfx.fanfare();
    toast('<span class="big">🪩</span>Disco pockets! Groovy!', 3500);
    setTimeout(() => body.classList.remove("disco"), 10000);
  }

  window.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input, textarea")) return;
    const k = e.key.toLowerCase();

    keys = [...keys, k].slice(-KONAMI.length);
    if (keys.join() === KONAMI.join()) { keys = []; discoMode(); return; }

    if (k.length === 1) {
      typed = (typed + k).slice(-10);
      if (typed.endsWith("capy")) { typed = ""; parade(); }
      else if (typed.endsWith("giggle")) { typed = ""; giggleMode(); }
    }
  });

  /* ---------- A hello for curious kids who open the console ---------- */

  console.log(
    "%c🫧 Hi there, curious coder! 🫧",
    "font: 700 20px Fredoka, sans-serif; color: #2ec4b6;"
  );
  console.log(
    "%cYou peeked inside the code pocket! Here's a secret: try typing  capy  or  giggle  on the page.\nAnd there are 5 coins hiding around. Can you find them all?",
    "font: 14px Fredoka, sans-serif; color: #b9773f;"
  );
})();
