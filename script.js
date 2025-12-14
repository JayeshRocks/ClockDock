const FACTS = [
  "Time runs slightly faster at higher altitudes.",
  "A second is defined by vibrations of cesium atoms.",
  "Clocks on satellites must be corrected daily.",
  "Gravity slows time near massive objects.",
  "The Moon is moving away from Earth each year.",
  "Days were shorter when dinosaurs lived.",
  "Earth’s rotation is gradually slowing.",
  "Time zones were created for railways.",
  "Leap seconds are added to keep clocks aligned.",
  "No two atomic clocks tick exactly the same.",

  "Light from the Sun takes about 8 minutes to reach Earth.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Some galaxies have no clear shape.",
  "A day on Venus is longer than its year.",
  "Neutron stars can spin hundreds of times per second.",
  "Space is not completely silent.",
  "The Milky Way is slowly colliding with Andromeda.",
  "Black holes can warp nearby time.",
  "Most of the universe is invisible matter.",
  "Astronauts grow slightly taller in space.",

  "The first computer bug was an actual insect.",
  "Modern CPUs contain billions of transistors.",
  "Early computers had less power than calculators.",
  "Binary uses only two states: on and off.",
  "Programming languages age like spoken languages.",
  "Floating point math can never be perfectly exact.",
  "The internet was not designed for video.",
  "Most software bugs are simple logic errors.",
  "A single typo can crash a system.",
  "Code readability often matters more than speed.",

  "The first hard drive weighed over a ton.",
  "Touchscreens existed before smartphones.",
  "The mouse was invented in the 1960s.",
  "Email is older than the web.",
  "Wi-Fi came from a failed radio experiment.",
  "The QWERTY layout was made to reduce jams.",
  "Early screens used vacuum tubes.",
  "The first webcams watched a coffee pot.",
  "Cameras once required hours of exposure.",
  "Storage used to be measured in kilobytes.",

  "The first video game was made in 1958.",
  "Early games had no save feature.",
  "Some game worlds are larger than real cities.",
  "AI enemies often cheat slightly.",
  "Lag is often caused by distance, not speed.",
  "Game physics are usually approximations.",
  "Speedrunners exploit tiny timing errors.",
  "Retro consoles had strict memory limits.",
  "Textures are often reused invisibly.",
  "Many game sounds are recorded from real objects.",

  "Human reaction time is about 200 milliseconds.",
  "Silence is never truly silent.",
  "Your brain predicts the present.",
  "Most decisions happen before awareness.",
  "Memory changes each time it’s recalled.",
  "Eyes have a blind spot you never notice.",
  "Dreams usually last only seconds.",
  "Your sense of time changes with focus.",
  "The brain uses more power than a light bulb.",
  "Thinking feels continuous but isn’t.",

  "Nothing is perfectly still.",
  "Every clock drifts.",
  "Precision has limits.",
  "Distance creates delay.",
  "Light defines the speed limit.",
  "Randomness appears in nature.",
  "Measurements change outcomes.",
  "Small errors accumulate.",
  "Time cannot be paused.",
  "Systems tend toward noise.",
];

const clock = document.getElementById("clock");

let lastTime = "";

let blocks = [];

let x = 0;
let y = 0;
let tx = 0;
let ty = 0;

function getTimeString() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();

  const is24h = true;

  if (!is24h) {
    hours = hours % 12 || 12;
  }

  return (
    String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0")
  );
}

const DIGITS = {
  0: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  1: ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  2: ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  3: ["01110", "10001", "00001", "00110", "00001", "10001", "01110"],
  4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  5: ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  6: ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  7: ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  8: ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["0", "1", "0", "0", "1", "0", "0"],
};

function renderTimeString(str) {
  clock.innerHTML = "";

  [...str].forEach((char, index) => {
    const grid = document.createElement("div");
    const isColon = char === ":";

    grid.className = isColon ? "colon-grid" : "digit-grid";

    let shouldAnimate = lastTime && lastTime[index] !== char;

    if (shouldAnimate) {
      grid.classList.add("enter");
    }

    DIGITS[char].forEach((row) => {
      [...row].forEach((cell) => {
        const block = document.createElement("div");
        block.className = "block";
        if (cell === "1") block.classList.add("on");
        grid.appendChild(block);
        block.dataset.x = 0;
        block.dataset.y = 0;
      });
    });

    clock.appendChild(grid);
    if (shouldAnimate) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          grid.classList.remove("enter");
        });
      });
    }
  });
}

function updateClock() {
  const currentTime = getTimeString();

  if (currentTime !== lastTime) {
    renderTimeString(currentTime);
    lastTime = currentTime;

    collectBlocks();
  }
}

updateClock();
setInterval(updateClock, 1000);
collectBlocks();
applyGravity();

let lastFactIndex = -1;

function showRandomFact() {
  let index;
  do {
    index = Math.floor(Math.random() * FACTS.length);
  } while (index === lastFactIndex);

  lastFactIndex = index;

  fact.classList.add("fade-out");

  setTimeout(() => {
    fact.textContent = FACTS[index];
    fact.classList.remove("fade-out");
  }, 400);
}

showRandomFact();
setInterval(showRandomFact, 1 * 60 * 1000);

const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
  tx = e.clientX;
  ty = e.clientY;
});

function animateCursor() {
  x += (tx - x) * 0.15;
  y += (ty - y) * 0.15;

  cursor.style.transform = `translate(${x - 4}px, ${y - 4}px)`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

function collectBlocks() {
  blocks = Array.from(document.querySelectorAll(".block.on")).map((b) => {
    const rect = b.getBoundingClientRect();
    return {
      el: b,
      homeX: rect.left + rect.width / 2,
      homeY: rect.top + rect.height / 2,
      x: 0,
      y: 0,
    };
  });
}

function applyGravity() {
  const RADIUS = 120;
  const STRENGTH = 12;
  const RETURN = 0.08;

  blocks.forEach((b) => {
    const dx = tx - b.homeX;
    const dy = ty - b.homeY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let targetX = 0;
    let targetY = 0;

    if (dist < RADIUS && dist > 0.001) {
      const force = 1 - dist / RADIUS;

      const nx = dx / dist;
      const ny = dy / dist;

      const px = -ny;
      const py = nx;

      const pull = force * 240;
      const bend = force * 180 * Math.pow(force, 0.6);

      targetX = nx * pull + px * bend;
      targetY = ny * pull + py * bend;

      const MAX_OFFSET = 55;

      targetX = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, targetX));
      targetY = Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, targetY));
    }

    const relax = dist < RADIUS ? RETURN : RETURN * 0.6;

    b.x += (targetX - b.x) * relax;
    b.y += (targetY - b.y) * relax;

    b.el.style.transform = `translate(${b.x}px, ${b.y}px)`;
  });

  requestAnimationFrame(applyGravity);
}

let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch (err) {
  }
}

function requestFullscreen() {
  const el = document.documentElement;

  if (el.requestFullscreen) el.requestFullscreen();
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
}

const hint = document.getElementById("hint");

function enterAmbientMode() {
  requestFullscreen();
  requestWakeLock();
  hint.remove();

  document.removeEventListener("click", enterAmbientMode);
  document.removeEventListener("touchstart", enterAmbientMode);
}

document.addEventListener("click", enterAmbientMode, { once: true });
document.addEventListener("touchstart", enterAmbientMode, { once: true });

if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
  const cursor = document.getElementById("cursor");
  if (cursor) cursor.style.display = "none";
}
