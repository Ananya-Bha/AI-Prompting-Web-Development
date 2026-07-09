const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const playerNameEl = document.getElementById("playerName");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const waveModalEl = document.getElementById("waveModal");
const waveModalTitleEl = document.getElementById("waveModalTitle");
const waveModalTimerEl = document.getElementById("waveModalTimer");
const startScreenEl = document.getElementById("startScreen");
const emojiFieldEl = document.getElementById("emojiField");
const mainEmojiFieldEl = document.getElementById("mainEmojiField");
const startCardEl = document.querySelector(".screen-content");
const gameShellEl = document.querySelector(".game-shell");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const switchProfileBtn = document.getElementById("switchProfileBtn");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderboardModalEl = document.getElementById("leaderboardModal");
const closeLeaderboardBtn = document.getElementById("closeLeaderboardBtn");
const leaderboardBodyEl = document.getElementById("leaderboardBody");
const leaderboardMetaEl = document.getElementById("leaderboardMeta");
const rankBadgeEl = document.getElementById("rankBadge");
const themeDefaultBtn = document.getElementById("themeDefaultBtn");
const themePopBtn = document.getElementById("themePopBtn");
const themeCoolBtn = document.getElementById("themeCoolBtn");
const STORAGE_KEY = "spaceInvadersHighScores";
const THEME_STORAGE_KEY = "spaceInvadersTheme";
const GAME_BACKGROUND_BY_THEME = {
  default: "../Assets/background.png",
  pop: "../Assets/background_warm.jpg",
  cool: "../Assets/background_cool.webp",
};

const assets = {
  background: new Image(),
  player: new Image(),
  enemy: new Image(),
  bullet: new Image(),
};

assets.background.src = "../Assets/background.png";
assets.player.src = "../Assets/player.png";
assets.enemy.src = "../Assets/enemy.png";
assets.bullet.src = "../Assets/bullet.png";

const game = {
  running: false,
  score: 0,
  keys: {
    left: false,
    right: false,
  },
  player: {
    width: 64,
    height: 64,
    x: canvas.width / 2 - 32,
    y: canvas.height - 76,
    speed: 370,
  },
  bullets: [],
  enemies: [],
  bulletCooldownMs: 190,
  bulletTimer: 0,
  enemySpawnTimer: 0,
  nextEnemySpawnMs: randomInRange(420, 1150),
  waveNumber: 1,
  waveState: "cooldown",
  waveCooldownMsRemaining: 0,
  waveStartBannerMsRemaining: 0,
  enemiesToSpawnThisWave: 0,
  enemiesSpawnedThisWave: 0,
  enemiesDestroyedThisWave: 0,
  lastTs: 0,
};

let currentPlayerName = "Guest";
let highScoresByPlayer = loadHighScores();
let dragState = null;
const emojiMotionByNode = new Map();
const mainEmojiMotionByNode = new Map();
let emojiMotionRafId = 0;
let emojiMotionLastTs = 0;

const START_SCREEN_EMOJIS = [
  "🚀",
  "🛸",
  "🌟",
  "✨",
  "🪐",
  "☄️",
  "🌌",
  "💫",
  "🌠",
  "🔭",
  "🛰️",
  "👾",
  "⭐",
  "🌙",
  "🧪",
  "⚡",
  "🌀",
  "🎮",
];

const START_SCREEN_EMOJIS_POP = [
  "🎉",
  "🎊",
  "💖",
  "🌈",
  "🧡",
  "💛",
  "💜",
  "🪩",
  "✨",
  "🌟",
  "🎵",
  "🎶",
  "🎮",
  "🕹️",
  "🦄",
  "🎯",
  "🔥",
  "🍭",
];

const START_SCREEN_EMOJIS_COOL = [
  "❄️",
  "💧",
  "🧊",
  "🌊",
  "🔷",
  "🔹",
  "🌌",
  "🌀",
  "🛰️",
  "☄️",
  "🌙",
  "🪐",
  "⭐",
  "✨",
  "🔭",
  "🧿",
  "🧪",
  "🎮",
];

const MAIN_PAGE_EMOJIS = [
  "☄️",
  "✨",
  "⭐",
  "🌠",
  "💫",
  "🛰️",
  "🛸",
  "🚀",
  "🌙",
  "🪐",
  "🌌",
  "🔭",
  "👾",
  "⚡",
  "🌀",
  "🌟",
  "🌍",
  "🌎",
  "🌏",
  "🧪",
  "🧬",
  "🪄",
  "🧿",
  "🎯",
  "🎮",
];

let currentTheme = "default";

function loadHighScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

function saveHighScores() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(highScoresByPlayer));
}

function getCurrentHighScore() {
  return Number(highScoresByPlayer[currentPlayerName] || 0);
}

function ensurePlayerExists(name) {
  if (!(name in highScoresByPlayer)) {
    highScoresByPlayer[name] = 0;
    saveHighScores();
  }
}

function setCurrentPlayer(name) {
  currentPlayerName = name;
  ensurePlayerExists(currentPlayerName);
  updateHud();
}

function updateHud() {
  playerNameEl.textContent = `Player: ${currentPlayerName}`;
  scoreEl.textContent = `Current Score: ${game.score}`;
  highScoreEl.textContent = `High Score: ${getCurrentHighScore()}`;
  const rank = getCurrentPlayerRank();
  rankBadgeEl.textContent = `Your Rank: #${rank}`;
}

function updateHighScoreIfNeeded() {
  if (game.score > getCurrentHighScore()) {
    highScoresByPlayer[currentPlayerName] = game.score;
    saveHighScores();
  }
}

function getStartEmojiPoolForTheme(themeName) {
  if (themeName === "pop") return START_SCREEN_EMOJIS_POP;
  if (themeName === "cool") return START_SCREEN_EMOJIS_COOL;
  return START_SCREEN_EMOJIS;
}

function refreshStartEmojiSymbolsForTheme() {
  const pool = getStartEmojiPoolForTheme(currentTheme);
  if (pool.length === 0) {
    return;
  }

  emojiMotionByNode.forEach((_motion, node) => {
    node.textContent = pool[Math.floor(Math.random() * pool.length)];
  });
}

function setActiveThemeButton() {
  if (!themeDefaultBtn || !themePopBtn || !themeCoolBtn) {
    return;
  }

  themeDefaultBtn.classList.toggle("active", currentTheme === "default");
  themePopBtn.classList.toggle("active", currentTheme === "pop");
  themeCoolBtn.classList.toggle("active", currentTheme === "cool");
}

function setGameBackgroundForTheme(themeName) {
  const nextBackgroundSrc = GAME_BACKGROUND_BY_THEME[themeName] || GAME_BACKGROUND_BY_THEME.default;
  if (assets.background.src.endsWith(nextBackgroundSrc.replace("../", ""))) {
    return;
  }

  assets.background.src = nextBackgroundSrc;
  assets.background.addEventListener(
    "load",
    () => {
      if (!game.running) {
        draw();
      }
    },
    { once: true }
  );
}

function applyTheme(themeName, persist = true) {
  const validTheme = ["default", "pop", "cool"].includes(themeName) ? themeName : "default";
  currentTheme = validTheme;

  if (validTheme === "default") {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.setAttribute("data-theme", validTheme);
  }

  setActiveThemeButton();
  refreshStartEmojiSymbolsForTheme();
  setGameBackgroundForTheme(validTheme);

  if (persist) {
    localStorage.setItem(THEME_STORAGE_KEY, validTheme);
  }
}

function initThemeSwitcher() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || "default";
  applyTheme(savedTheme, false);

  themeDefaultBtn?.addEventListener("click", () => applyTheme("default"));
  themePopBtn?.addEventListener("click", () => applyTheme("pop"));
  themeCoolBtn?.addEventListener("click", () => applyTheme("cool"));
}

function triggerEmojiPop(emojiNode) {
  emojiNode.classList.remove("pop");
  void emojiNode.offsetWidth;
  emojiNode.classList.add("pop");
}

function spawnEmojiTrailDot(fieldEl, x, y, size = 4) {
  if (!fieldEl) {
    return;
  }

  const dot = document.createElement("span");
  dot.className = "trail-dot";
  dot.style.width = `${size}px`;
  dot.style.height = `${size}px`;
  dot.style.left = `${x}px`;
  dot.style.top = `${y}px`;
  fieldEl.appendChild(dot);

  dot.addEventListener("animationend", () => {
    dot.remove();
  });
}

function randomSignedSpeed(min, max) {
  const speed = randomInRange(min, max);
  return Math.random() < 0.5 ? -speed : speed;
}

function getNodeMass(emojiNode) {
  const size = parseFloat(emojiNode.style.fontSize) || 28;
  return Math.max(0.7, Math.min(1.7, size / 24));
}

function getSizeAdjustedVelocity(emojiNode, minSpeed, maxSpeed) {
  const mass = getNodeMass(emojiNode);
  const speedScale = 1 / Math.sqrt(mass);
  return {
    vx: randomSignedSpeed(minSpeed, maxSpeed) * speedScale,
    vy: randomSignedSpeed(minSpeed, maxSpeed) * speedScale,
    mass,
  };
}

function getCardObstacleRect() {
  if (!emojiFieldEl || !startCardEl) {
    return null;
  }

  const fieldRect = emojiFieldEl.getBoundingClientRect();
  const cardRect = startCardEl.getBoundingClientRect();

  return {
    left: cardRect.left - fieldRect.left,
    right: cardRect.right - fieldRect.left,
    top: cardRect.top - fieldRect.top,
    bottom: cardRect.bottom - fieldRect.top,
  };
}

function getMainObstacleRect() {
  if (!mainEmojiFieldEl || !gameShellEl) {
    return null;
  }

  const fieldRect = mainEmojiFieldEl.getBoundingClientRect();
  const shellRect = gameShellEl.getBoundingClientRect();

  return {
    left: shellRect.left - fieldRect.left,
    right: shellRect.right - fieldRect.left,
    top: shellRect.top - fieldRect.top,
    bottom: shellRect.bottom - fieldRect.top,
  };
}

function intersectsRect(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function resolveOutsideObstacle(emojiNode, obstacle, x, y) {
  if (!obstacle) {
    return { x, y };
  }

  const nodeRect = emojiNode.getBoundingClientRect();
  const nodeWidth = nodeRect.width || 24;
  const nodeHeight = nodeRect.height || 24;
  const pad = 4;

  const emojiRect = {
    left: x,
    right: x + nodeWidth,
    top: y,
    bottom: y + nodeHeight,
  };

  if (!intersectsRect(emojiRect, obstacle)) {
    return { x, y };
  }

  const pushLeft = Math.abs(emojiRect.right - obstacle.left);
  const pushRight = Math.abs(obstacle.right - emojiRect.left);
  const pushTop = Math.abs(emojiRect.bottom - obstacle.top);
  const pushBottom = Math.abs(obstacle.bottom - emojiRect.top);
  const minPush = Math.min(pushLeft, pushRight, pushTop, pushBottom);

  if (minPush === pushLeft) {
    return { x: obstacle.left - nodeWidth - pad, y };
  }
  if (minPush === pushRight) {
    return { x: obstacle.right + pad, y };
  }
  if (minPush === pushTop) {
    return { x, y: obstacle.top - nodeHeight - pad };
  }

  return { x, y: obstacle.bottom + pad };
}

function resolveOutsideCard(emojiNode, x, y) {
  return resolveOutsideObstacle(emojiNode, getCardObstacleRect(), x, y);
}

function placeEmojiAtInField(fieldEl, obstacle, emojiNode, x, y) {
  const bounds = fieldEl.getBoundingClientRect();
  const nodeRect = emojiNode.getBoundingClientRect();
  const clampedX = Math.max(8, Math.min(x, bounds.width - nodeRect.width - 8));
  const clampedY = Math.max(8, Math.min(y, bounds.height - nodeRect.height - 8));
  const adjusted = resolveOutsideObstacle(emojiNode, obstacle, clampedX, clampedY);

  emojiNode.style.left = `${adjusted.x}px`;
  emojiNode.style.top = `${adjusted.y}px`;
  return adjusted;
}

function placeEmojiAt(emojiNode, x, y) {
  return placeEmojiAtInField(emojiFieldEl, getCardObstacleRect(), emojiNode, x, y);
}

function onEmojiPointerMove(event) {
  if (!dragState) {
    return;
  }

  const { node, pointerId, offsetX, offsetY } = dragState;
  if (event.pointerId !== pointerId) {
    return;
  }

  const bounds = emojiFieldEl.getBoundingClientRect();
  const x = event.clientX - bounds.left - offsetX;
  const y = event.clientY - bounds.top - offsetY;

  if (Math.abs(x - dragState.startX) > 2 || Math.abs(y - dragState.startY) > 2) {
    dragState.moved = true;
  }

  const placed = placeEmojiAt(node, x, y);
  const motion = emojiMotionByNode.get(node);
  if (motion) {
    motion.x = placed.x;
    motion.y = placed.y;
  }
}

function onEmojiPointerUp(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const { node, moved } = dragState;
  node.classList.remove("dragging");

  if (moved) {
    node.dataset.suppressClick = "1";
    window.setTimeout(() => {
      delete node.dataset.suppressClick;
    }, 0);
  }

  dragState = null;
}

function createEmojiNode(symbol) {
  const emojiNode = document.createElement("button");
  emojiNode.type = "button";
  emojiNode.className = "emoji-node";
  emojiNode.textContent = symbol;
  emojiNode.setAttribute("aria-label", "decorative emoji");
  emojiNode.style.fontSize = `${randomInRange(20, 36)}px`;

  emojiNode.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const nodeRect = emojiNode.getBoundingClientRect();
    dragState = {
      node: emojiNode,
      pointerId: event.pointerId,
      offsetX: event.clientX - nodeRect.left,
      offsetY: event.clientY - nodeRect.top,
      startX: parseFloat(emojiNode.style.left) || 0,
      startY: parseFloat(emojiNode.style.top) || 0,
      moved: false,
    };

    emojiNode.classList.add("dragging");
    emojiNode.setPointerCapture(event.pointerId);
  });

  emojiNode.addEventListener("click", (event) => {
    if (emojiNode.dataset.suppressClick === "1") {
      event.preventDefault();
      return;
    }

    triggerEmojiPop(emojiNode);
  });

  return emojiNode;
}

function createPassiveEmojiNode(symbol) {
  const emojiNode = document.createElement("span");
  emojiNode.className = "emoji-node passive";
  emojiNode.textContent = symbol;
  emojiNode.style.fontSize = `${randomInRange(16, 30)}px`;
  return emojiNode;
}

function updateEmojiMotionGroup({
  fieldEl,
  motionMap,
  obstacleRect,
  dt,
  ignoreNode = null,
  maxSpeed = 70,
  minSpeed = 16,
}) {
  if (!fieldEl || motionMap.size === 0) {
    return;
  }

  const bounds = fieldEl.getBoundingClientRect();
  const activeMotions = [];

  motionMap.forEach((motion, node) => {
    if (ignoreNode && node === ignoreNode) {
      return;
    }

    const nodeWidth = node.offsetWidth || 28;
    const nodeHeight = node.offsetHeight || 28;
    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, bounds.width - nodeWidth - 8);
    const maxY = Math.max(minY, bounds.height - nodeHeight - 8);

    motion.x += motion.vx * dt;
    motion.y += motion.vy * dt;

    if (motion.x <= minX) {
      motion.x = minX;
      motion.vx = Math.abs(motion.vx);
    } else if (motion.x >= maxX) {
      motion.x = maxX;
      motion.vx = -Math.abs(motion.vx);
    }

    if (motion.y <= minY) {
      motion.y = minY;
      motion.vy = Math.abs(motion.vy);
    } else if (motion.y >= maxY) {
      motion.y = maxY;
      motion.vy = -Math.abs(motion.vy);
    }

    if (obstacleRect) {
      const emojiRect = {
        left: motion.x,
        right: motion.x + nodeWidth,
        top: motion.y,
        bottom: motion.y + nodeHeight,
      };

      if (intersectsRect(emojiRect, obstacleRect)) {
        const pushLeft = Math.abs(emojiRect.right - obstacleRect.left);
        const pushRight = Math.abs(obstacleRect.right - emojiRect.left);
        const pushTop = Math.abs(emojiRect.bottom - obstacleRect.top);
        const pushBottom = Math.abs(obstacleRect.bottom - emojiRect.top);
        const minPush = Math.min(pushLeft, pushRight, pushTop, pushBottom);
        const pad = 4;

        if (minPush === pushLeft) {
          motion.x = obstacleRect.left - nodeWidth - pad;
          motion.vx = -Math.abs(motion.vx);
        } else if (minPush === pushRight) {
          motion.x = obstacleRect.right + pad;
          motion.vx = Math.abs(motion.vx);
        } else if (minPush === pushTop) {
          motion.y = obstacleRect.top - nodeHeight - pad;
          motion.vy = -Math.abs(motion.vy);
        } else {
          motion.y = obstacleRect.bottom + pad;
          motion.vy = Math.abs(motion.vy);
        }
      }
    }

    activeMotions.push({ node, motion, nodeWidth, nodeHeight });
  });

  for (let i = 0; i < activeMotions.length; i += 1) {
    for (let j = i + 1; j < activeMotions.length; j += 1) {
      const a = activeMotions[i];
      const b = activeMotions[j];

      const ax = a.motion.x + a.nodeWidth * 0.5;
      const ay = a.motion.y + a.nodeHeight * 0.5;
      const bx = b.motion.x + b.nodeWidth * 0.5;
      const by = b.motion.y + b.nodeHeight * 0.5;
      const dx = bx - ax;
      const dy = by - ay;
      const distance = Math.hypot(dx, dy) || 0.0001;
      const radiusA = Math.min(a.nodeWidth, a.nodeHeight) * 0.33;
      const radiusB = Math.min(b.nodeWidth, b.nodeHeight) * 0.33;
      const minDistance = radiusA + radiusB;

      if (distance >= minDistance) {
        continue;
      }

      const nx = dx / distance;
      const ny = dy / distance;
      const overlap = minDistance - distance;
      const massA = a.motion.mass || 1;
      const massB = b.motion.mass || 1;
      const totalMass = massA + massB;

      a.motion.x -= nx * overlap * (massB / totalMass);
      a.motion.y -= ny * overlap * (massB / totalMass);
      b.motion.x += nx * overlap * (massA / totalMass);
      b.motion.y += ny * overlap * (massA / totalMass);

      const rvx = a.motion.vx - b.motion.vx;
      const rvy = a.motion.vy - b.motion.vy;
      const velocityAlongNormal = rvx * nx + rvy * ny;

      if (velocityAlongNormal > 0) {
        continue;
      }

      const restitution = 0.95;
      const impulse = (-(1 + restitution) * velocityAlongNormal) / (1 / massA + 1 / massB);
      const impulseX = impulse * nx;
      const impulseY = impulse * ny;

      a.motion.vx += impulseX / massA;
      a.motion.vy += impulseY / massA;
      b.motion.vx -= impulseX / massB;
      b.motion.vy -= impulseY / massB;
    }
  }

  activeMotions.forEach(({ node, motion, nodeWidth, nodeHeight }) => {
    const minX = 8;
    const minY = 8;
    const maxX = Math.max(minX, bounds.width - nodeWidth - 8);
    const maxY = Math.max(minY, bounds.height - nodeHeight - 8);

    motion.x = Math.max(minX, Math.min(maxX, motion.x));
    motion.y = Math.max(minY, Math.min(maxY, motion.y));

    if (obstacleRect) {
      const emojiRect = {
        left: motion.x,
        right: motion.x + nodeWidth,
        top: motion.y,
        bottom: motion.y + nodeHeight,
      };

      if (intersectsRect(emojiRect, obstacleRect)) {
        const pushed = resolveOutsideObstacle(node, obstacleRect, motion.x, motion.y);
        motion.x = pushed.x;
        motion.y = pushed.y;
      }
    }

    const speed = Math.hypot(motion.vx, motion.vy) || 1;
    if (speed > maxSpeed) {
      motion.vx = (motion.vx / speed) * maxSpeed;
      motion.vy = (motion.vy / speed) * maxSpeed;
    } else if (speed < minSpeed) {
      motion.vx = (motion.vx / speed) * minSpeed;
      motion.vy = (motion.vy / speed) * minSpeed;
    }

    node.style.left = `${motion.x}px`;
    node.style.top = `${motion.y}px`;

    motion.trailTimer = (motion.trailTimer || 0) + dt;
    if (motion.trailTimer >= (motion.trailInterval || 0.08)) {
      motion.trailTimer = 0;

      const cx = motion.x + nodeWidth * 0.5;
      const cy = motion.y + nodeHeight * 0.5;
      const dirSpeed = Math.hypot(motion.vx, motion.vy) || 1;
      const ux = motion.vx / dirSpeed;
      const uy = motion.vy / dirSpeed;

      const trailX = cx - ux * randomInRange(8, 13) + randomInRange(-1.6, 1.6);
      const trailY = cy - uy * randomInRange(8, 13) + randomInRange(-1.6, 1.6);
      spawnEmojiTrailDot(fieldEl, trailX, trailY, randomInRange(2.2, 4.4));
    }
  });
}

function stepEmojiMotion(timestamp) {
  if (!emojiFieldEl) {
    return;
  }

  if (!emojiMotionLastTs) {
    emojiMotionLastTs = timestamp;
  }

  const dt = Math.min(0.04, (timestamp - emojiMotionLastTs) / 1000);
  emojiMotionLastTs = timestamp;

  updateEmojiMotionGroup({
    fieldEl: emojiFieldEl,
    motionMap: emojiMotionByNode,
    obstacleRect: getCardObstacleRect(),
    dt,
    ignoreNode: dragState ? dragState.node : null,
    maxSpeed: 66,
    minSpeed: 14,
  });

  emojiMotionRafId = requestAnimationFrame(stepEmojiMotion);
}

function startEmojiMotion() {
  if (emojiMotionRafId) {
    return;
  }

  emojiMotionLastTs = 0;
  emojiMotionRafId = requestAnimationFrame(stepEmojiMotion);
}

function initStartScreenEmojis() {
  if (!emojiFieldEl || emojiFieldEl.dataset.ready === "1") {
    return;
  }

  emojiFieldEl.dataset.ready = "1";
  const themeEmojiPool = getStartEmojiPoolForTheme(currentTheme);

  const total = 40;
  const prioritizedBandCount = 18;
  const placedPoints = [];
  const minGap = 38;
  const obstacle = getCardObstacleRect();

  const isValidPoint = (x, y, node) => {
    const nodeRect = node.getBoundingClientRect();
    const w = nodeRect.width || 24;
    const h = nodeRect.height || 24;
    const rect = { left: x, right: x + w, top: y, bottom: y + h };

    if (obstacle && intersectsRect(rect, obstacle)) {
      return false;
    }

    for (const p of placedPoints) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.hypot(dx, dy) < minGap) {
        return false;
      }
    }

    return true;
  };

  for (let i = 0; i < total; i += 1) {
    const symbol = themeEmojiPool[Math.floor(Math.random() * themeEmojiPool.length)];
    const emojiNode = createEmojiNode(symbol);
    emojiFieldEl.appendChild(emojiNode);

    const bounds = emojiFieldEl.getBoundingClientRect();
    const nodeRect = emojiNode.getBoundingClientRect();
    const nodeW = nodeRect.width || 24;
    const nodeH = nodeRect.height || 24;

    const minX = 10;
    const maxX = Math.max(12, bounds.width - nodeW - 10);
    const minY = 10;
    const maxY = Math.max(12, bounds.height - nodeH - 10);

    let startX = randomInRange(minX, maxX);
    let startY = randomInRange(minY, maxY);

    const chooseBand = () => {
      if (!obstacle || i >= prioritizedBandCount) {
        return { x: randomInRange(minX, maxX), y: randomInRange(minY, maxY) };
      }

      const useTop = i % 2 === 0;
      if (useTop) {
        const topMaxY = Math.max(minY, obstacle.top - nodeH - 10);
        if (topMaxY > minY) {
          return { x: randomInRange(minX, maxX), y: randomInRange(minY, topMaxY) };
        }
      } else {
        const bottomMinY = Math.min(maxY, obstacle.bottom + 10);
        if (bottomMinY < maxY) {
          return { x: randomInRange(minX, maxX), y: randomInRange(bottomMinY, maxY) };
        }
      }

      return { x: randomInRange(minX, maxX), y: randomInRange(minY, maxY) };
    };

    for (let attempt = 0; attempt < 80; attempt += 1) {
      const candidate = chooseBand();
      const candidateX = candidate.x;
      const candidateY = candidate.y;
      if (isValidPoint(candidateX, candidateY, emojiNode)) {
        startX = candidateX;
        startY = candidateY;
        break;
      }
    }

    const placed = placeEmojiAt(emojiNode, startX, startY);
    placedPoints.push({ x: placed.x, y: placed.y });
    const velocity = getSizeAdjustedVelocity(emojiNode, 22, 54);
    emojiMotionByNode.set(emojiNode, {
      x: placed.x,
      y: placed.y,
      vx: velocity.vx,
      vy: velocity.vy,
      mass: velocity.mass,
      trailTimer: randomInRange(0, 0.08),
      trailInterval: randomInRange(0.06, 0.1),
    });
  }

  window.addEventListener("pointermove", onEmojiPointerMove);
  window.addEventListener("pointerup", onEmojiPointerUp);
  startEmojiMotion();
}

function initMainPageEmojis() {
  if (!mainEmojiFieldEl || mainEmojiFieldEl.dataset.ready === "1") {
    return;
  }

  mainEmojiFieldEl.dataset.ready = "1";

  const total = 14;
  const placedPoints = [];
  const minGap = 64;
  const obstacle = getMainObstacleRect();

  const isValidPoint = (x, y, node) => {
    const nodeRect = node.getBoundingClientRect();
    const w = nodeRect.width || 20;
    const h = nodeRect.height || 20;
    const rect = { left: x, right: x + w, top: y, bottom: y + h };

    if (obstacle && intersectsRect(rect, obstacle)) {
      return false;
    }

    for (const p of placedPoints) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.hypot(dx, dy) < minGap) {
        return false;
      }
    }

    return true;
  };

  for (let i = 0; i < total; i += 1) {
    const symbol = MAIN_PAGE_EMOJIS[Math.floor(Math.random() * MAIN_PAGE_EMOJIS.length)];
    const emojiNode = createPassiveEmojiNode(symbol);
    mainEmojiFieldEl.appendChild(emojiNode);

    const bounds = mainEmojiFieldEl.getBoundingClientRect();
    const nodeRect = emojiNode.getBoundingClientRect();
    const nodeW = nodeRect.width || 20;
    const nodeH = nodeRect.height || 20;
    const minX = 8;
    const maxX = Math.max(10, bounds.width - nodeW - 8);
    const minY = 8;
    const maxY = Math.max(10, bounds.height - nodeH - 8);

    let startX = randomInRange(minX, maxX);
    let startY = randomInRange(minY, maxY);
    for (let attempt = 0; attempt < 160; attempt += 1) {
      const candidateX = randomInRange(minX, maxX);
      const candidateY = randomInRange(minY, maxY);
      if (isValidPoint(candidateX, candidateY, emojiNode)) {
        startX = candidateX;
        startY = candidateY;
        break;
      }
    }

    const placed = placeEmojiAtInField(mainEmojiFieldEl, obstacle, emojiNode, startX, startY);
    placedPoints.push({ x: placed.x, y: placed.y });

    const velocity = getSizeAdjustedVelocity(emojiNode, 6, 20);
    mainEmojiMotionByNode.set(emojiNode, {
      x: placed.x,
      y: placed.y,
      vx: velocity.vx,
      vy: velocity.vy,
      mass: velocity.mass,
      trailTimer: randomInRange(0, 0.18),
      trailInterval: randomInRange(0.14, 0.24),
    });
  }

  startEmojiMotion();
}

function shuffleMainPageEmojis() {
  if (!mainEmojiFieldEl || mainEmojiMotionByNode.size === 0) {
    return;
  }

  const obstacle = getMainObstacleRect();
  const bounds = mainEmojiFieldEl.getBoundingClientRect();
  const placedPoints = [];
  const minGap = 64;

  const isValidPoint = (x, y, node) => {
    const nodeRect = node.getBoundingClientRect();
    const w = nodeRect.width || 20;
    const h = nodeRect.height || 20;
    const rect = { left: x, right: x + w, top: y, bottom: y + h };

    if (obstacle && intersectsRect(rect, obstacle)) {
      return false;
    }

    for (const p of placedPoints) {
      const dx = p.x - x;
      const dy = p.y - y;
      if (Math.hypot(dx, dy) < minGap) {
        return false;
      }
    }

    return true;
  };

  mainEmojiMotionByNode.forEach((motion, node) => {
    const nodeRect = node.getBoundingClientRect();
    const nodeW = nodeRect.width || 20;
    const nodeH = nodeRect.height || 20;
    const minX = 8;
    const maxX = Math.max(10, bounds.width - nodeW - 8);
    const minY = 8;
    const maxY = Math.max(10, bounds.height - nodeH - 8);

    let startX = randomInRange(minX, maxX);
    let startY = randomInRange(minY, maxY);

    for (let attempt = 0; attempt < 160; attempt += 1) {
      const candidateX = randomInRange(minX, maxX);
      const candidateY = randomInRange(minY, maxY);
      if (isValidPoint(candidateX, candidateY, node)) {
        startX = candidateX;
        startY = candidateY;
        break;
      }
    }

    const placed = placeEmojiAtInField(mainEmojiFieldEl, obstacle, node, startX, startY);
    placedPoints.push({ x: placed.x, y: placed.y });

    const velocity = getSizeAdjustedVelocity(node, 6, 20);
    motion.x = placed.x;
    motion.y = placed.y;
    motion.vx = velocity.vx;
    motion.vy = velocity.vy;
    motion.mass = velocity.mass;
  });
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function resetPlayerPosition() {
  game.player.x = canvas.width / 2 - game.player.width / 2;
  game.player.y = canvas.height - game.player.height - 4;
}

function getEnemyWinLineY() {
  return game.player.y + game.player.height - 6;
}

function getWaveConfig(waveNumber) {
  const spawnMin = Math.max(320, 840 - waveNumber * 36);
  const spawnMax = Math.max(spawnMin + 120, 1260 - waveNumber * 48);
  const speedMin = 36 + waveNumber * 7;
  const speedMax = 74 + waveNumber * 9;
  const enemiesToSpawn = 7 + waveNumber * 3;
  const cooldownSec = Math.min(15, 5 + Math.floor((waveNumber - 1) / 2));

  return {
    spawnMin,
    spawnMax,
    speedMin,
    speedMax,
    enemiesToSpawn,
    cooldownSec,
  };
}

function hideWaveModal() {
  waveModalEl.classList.add("hidden");
}

function showWaveCooldownModal() {
  const secondsLeft = Math.max(0, Math.ceil(game.waveCooldownMsRemaining / 1000));
  waveModalTitleEl.textContent = `Wave ${game.waveNumber} Incoming`;
  waveModalTimerEl.textContent = `Starts in: ${secondsLeft}`;
  waveModalEl.classList.remove("hidden");
}

function showWaveStartModal() {
  waveModalTitleEl.textContent = `Wave ${game.waveNumber}`;
  waveModalTimerEl.textContent = "Good luck!";
  waveModalEl.classList.remove("hidden");
}

function beginWaveCooldown() {
  game.waveState = "cooldown";
  game.enemies = [];
  game.bullets = [];
  game.enemySpawnTimer = 0;
  game.enemiesSpawnedThisWave = 0;
  game.enemiesDestroyedThisWave = 0;
  game.waveCooldownMsRemaining = getWaveConfig(game.waveNumber).cooldownSec * 1000;
  showWaveCooldownModal();
}

function beginWave() {
  const config = getWaveConfig(game.waveNumber);
  game.waveState = "active";
  game.waveCooldownMsRemaining = 0;
  game.waveStartBannerMsRemaining = 1300;
  game.enemiesToSpawnThisWave = config.enemiesToSpawn;
  game.enemiesSpawnedThisWave = 0;
  game.enemiesDestroyedThisWave = 0;
  game.enemySpawnTimer = 0;
  game.nextEnemySpawnMs = randomInRange(config.spawnMin, config.spawnMax);
  showWaveStartModal();
}

function fireBullet() {
  game.bullets.push({
    width: 16,
    height: 32,
    x: game.player.x + game.player.width / 2 - 8,
    y: game.player.y - 24,
    speed: 520,
  });
}

function spawnEnemy() {
  const width = 56;
  const height = 56;
  const waveConfig = getWaveConfig(game.waveNumber);

  game.enemies.push({
    width,
    height,
    x: randomInRange(0, canvas.width - width),
    y: -height,
    speed: randomInRange(waveConfig.speedMin, waveConfig.speedMax),
  });

  game.enemiesSpawnedThisWave += 1;
}

function resizeCanvasToContainer() {
  const area = canvas.parentElement;
  const nextWidth = Math.max(320, Math.floor(area.clientWidth));
  const nextHeight = Math.max(240, Math.floor(area.clientHeight));

  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
    resetPlayerPosition();

    game.bullets = game.bullets.filter(
      (bullet) => bullet.x + bullet.width >= 0 && bullet.x <= canvas.width && bullet.y <= canvas.height
    );

    game.enemies = game.enemies.filter(
      (enemy) => enemy.x + enemy.width >= 0 && enemy.x <= canvas.width && enemy.y <= canvas.height + enemy.height
    );
  }
}

function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function endGame() {
  game.running = false;
  game.waveState = "ended";
  hideWaveModal();
  updateHighScoreIfNeeded();
  updateHud();
  finalScoreEl.textContent = `Final Score: ${game.score}`;
  gameOverEl.classList.remove("hidden");
}

function resetGameState() {
  game.running = false;
  game.score = 0;
  game.bullets = [];
  game.enemies = [];
  game.keys.left = false;
  game.keys.right = false;
  game.enemySpawnTimer = 0;
  game.nextEnemySpawnMs = randomInRange(420, 1150);
  game.waveNumber = 1;
  game.waveState = "cooldown";
  game.waveCooldownMsRemaining = 0;
  game.waveStartBannerMsRemaining = 0;
  game.enemiesToSpawnThisWave = 0;
  game.enemiesSpawnedThisWave = 0;
  game.enemiesDestroyedThisWave = 0;
  game.bulletTimer = game.bulletCooldownMs;
  game.lastTs = 0;
  updateHud();
  finalScoreEl.textContent = "Final Score: 0";
  gameOverEl.classList.add("hidden");
  hideWaveModal();
  resetPlayerPosition();
}

function startGame() {
  resetGameState();
  game.running = true;
  beginWaveCooldown();
  startScreenEl.classList.add("hidden");
  requestAnimationFrame(loop);
}

function getSortedLeaderboardRows() {
  return Object.entries(highScoresByPlayer)
    .map(([player, score]) => ({
      player,
      score: Number(score) || 0,
    }))
    .sort((a, b) => b.score - a.score || a.player.localeCompare(b.player));
}

function getCurrentPlayerRank() {
  const rows = getSortedLeaderboardRows();
  const index = rows.findIndex((row) => row.player === currentPlayerName);
  return index >= 0 ? index + 1 : rows.length + 1;
}

function renderLeaderboard() {
  const rows = getSortedLeaderboardRows();
  const currentRank = getCurrentPlayerRank();
  const topRows = rows.slice(0, 5);

  if (rows.length === 0) {
    leaderboardBodyEl.innerHTML = '<tr><td colspan="3">No profiles yet.</td></tr>';
    leaderboardMetaEl.textContent = "Top 5 Profiles";
    return;
  }

  let html = topRows
    .map((row, index) => {
      const isCurrent = row.player === currentPlayerName;
      return `<tr class="${isCurrent ? "current-row" : ""}"><td>${index + 1}</td><td>${row.player}</td><td>${row.score}</td></tr>`;
    })
    .join("");

  const currentIsInTopFive = topRows.some((row) => row.player === currentPlayerName);
  if (!currentIsInTopFive) {
    html += `<tr class="separator-row"><td colspan="3">...</td></tr>`;
    html += `<tr class="current-row"><td>${currentRank}</td><td>${currentPlayerName}</td><td>${getCurrentHighScore()}</td></tr>`;
  }

  leaderboardBodyEl.innerHTML = html;
  leaderboardMetaEl.textContent = `Top 5 Profiles · Your Rank: #${currentRank}`;
}

function openLeaderboard() {
  if (gameOverEl.classList.contains("hidden")) {
    return;
  }
  renderLeaderboard();
  leaderboardModalEl.classList.remove("hidden");
}

function closeLeaderboard() {
  leaderboardModalEl.classList.add("hidden");
}

function promptForProfileName(defaultName) {
  const typedName = window.prompt("Enter profile name:", defaultName);
  if (typedName === null) {
    return null;
  }

  return typedName.trim() || "Player";
}

function askPlayerNameAndStart() {
  const selectedName = promptForProfileName(currentPlayerName);
  if (!selectedName) {
    return;
  }

  setCurrentPlayer(selectedName);
  startGame();
}

function restartGame() {
  resetGameState();
  game.running = true;
  beginWaveCooldown();
  closeLeaderboard();
  requestAnimationFrame(loop);
}

function switchProfileAndRestart() {
  const selectedName = promptForProfileName(currentPlayerName);
  if (!selectedName) {
    return;
  }

  setCurrentPlayer(selectedName);
  restartGame();
}

function update(dtMs) {
  const dt = dtMs / 1000;

  if (game.keys.left) {
    game.player.x -= game.player.speed * dt;
  }
  if (game.keys.right) {
    game.player.x += game.player.speed * dt;
  }

  game.player.x = Math.max(0, Math.min(canvas.width - game.player.width, game.player.x));

  game.bulletTimer += dtMs;

  if (game.waveState === "cooldown") {
    game.waveCooldownMsRemaining = Math.max(0, game.waveCooldownMsRemaining - dtMs);
    showWaveCooldownModal();

    if (game.waveCooldownMsRemaining <= 0) {
      beginWave();
    }
  } else if (game.waveState === "active") {
    const waveConfig = getWaveConfig(game.waveNumber);
    game.enemySpawnTimer += dtMs;

    const canSpawnMore = game.enemiesSpawnedThisWave < game.enemiesToSpawnThisWave;
    if (canSpawnMore && game.enemySpawnTimer >= game.nextEnemySpawnMs) {
      spawnEnemy();
      game.enemySpawnTimer = 0;
      game.nextEnemySpawnMs = randomInRange(waveConfig.spawnMin, waveConfig.spawnMax);
    }

    if (game.waveStartBannerMsRemaining > 0) {
      game.waveStartBannerMsRemaining = Math.max(0, game.waveStartBannerMsRemaining - dtMs);
      showWaveStartModal();
      if (game.waveStartBannerMsRemaining <= 0) {
        hideWaveModal();
      }
    }
  }

  for (const bullet of game.bullets) {
    bullet.y -= bullet.speed * dt;
  }

  for (const enemy of game.enemies) {
    enemy.y += enemy.speed * dt;
  }

  for (let e = game.enemies.length - 1; e >= 0; e -= 1) {
    const enemy = game.enemies[e];

    for (let b = game.bullets.length - 1; b >= 0; b -= 1) {
      const bullet = game.bullets[b];
      if (intersects(bullet, enemy)) {
        game.enemies.splice(e, 1);
        game.bullets.splice(b, 1);
        game.enemiesDestroyedThisWave += 1;
        game.score += 1;
        updateHighScoreIfNeeded();
        updateHud();
        break;
      }
    }
  }

  game.bullets = game.bullets.filter((b) => b.y + b.height >= 0);

  game.enemies = game.enemies.filter((enemy) => {
    if (enemy.y + enemy.height >= getEnemyWinLineY()) {
      endGame();
      return false;
    }
    return enemy.y <= canvas.height + enemy.height;
  });

  if (
    game.waveState === "active" &&
    game.enemiesSpawnedThisWave >= game.enemiesToSpawnThisWave &&
    game.enemies.length === 0
  ) {
    game.waveNumber += 1;
    beginWaveCooldown();
  }
}

function draw() {
  resizeCanvasToContainer();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);

  for (const bullet of game.bullets) {
    ctx.drawImage(assets.bullet, bullet.x, bullet.y, bullet.width, bullet.height);
  }

  for (const enemy of game.enemies) {
    ctx.drawImage(assets.enemy, enemy.x, enemy.y, enemy.width, enemy.height);
  }

  ctx.drawImage(assets.player, game.player.x, game.player.y, game.player.width, game.player.height);
}

function loop(timestamp) {
  if (!game.running) {
    draw();
    return;
  }

  if (!game.lastTs) game.lastTs = timestamp;
  const dtMs = Math.min(45, timestamp - game.lastTs);
  game.lastTs = timestamp;

  update(dtMs);
  draw();
  requestAnimationFrame(loop);
}

function onKeyDown(event) {
  if (event.key === "ArrowLeft") {
    game.keys.left = true;
  }
  if (event.key === "ArrowRight") {
    game.keys.right = true;
  }

  if (event.code === "Space") {
    event.preventDefault();

    if (game.bulletTimer >= game.bulletCooldownMs && game.running && game.waveState === "active") {
      fireBullet();
      game.bulletTimer = 0;
    }
  }
}

function onKeyUp(event) {
  if (event.key === "ArrowLeft") {
    game.keys.left = false;
  }
  if (event.key === "ArrowRight") {
    game.keys.right = false;
  }
}

function waitForImage(image) {
  if (image.complete) return Promise.resolve();
  return new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });
}

Promise.all([
  waitForImage(assets.background),
  waitForImage(assets.player),
  waitForImage(assets.enemy),
  waitForImage(assets.bullet),
])
  .then(() => {
    resizeCanvasToContainer();
    initThemeSwitcher();
    initStartScreenEmojis();
    setCurrentPlayer(currentPlayerName);
    closeLeaderboard();
    resetGameState();
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resizeCanvasToContainer);
    startBtn.addEventListener("click", askPlayerNameAndStart);
    restartBtn.addEventListener("click", restartGame);
    switchProfileBtn.addEventListener("click", switchProfileAndRestart);
    leaderboardBtn.addEventListener("click", openLeaderboard);
    closeLeaderboardBtn.addEventListener("click", closeLeaderboard);
    leaderboardModalEl.addEventListener("click", (event) => {
      if (event.target === leaderboardModalEl) {
        closeLeaderboard();
      }
    });
    draw();
  })
  .catch(() => {
    game.running = false;
    gameOverEl.textContent = "ASSET LOAD ERROR";
    gameOverEl.classList.remove("hidden");
  });
