const photoCards = document.querySelectorAll(".photo-card");
const modal = document.querySelector("#photo-modal");
const modalImage = document.querySelector("#modal-image");
const closeModalButton = document.querySelector("#close-modal");

function openPhoto(image) {
  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePhoto() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

photoCards.forEach((card) => {
  card.addEventListener("click", () => {
    openPhoto(card.querySelector("img"));
  });
});

closeModalButton.addEventListener("click", closePhoto);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closePhoto();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePhoto();
});

const discordLink = document.querySelector("[data-copy]");
const discordStatus = document.querySelector("#discord-status");

discordLink.addEventListener("click", async (event) => {
  event.preventDefault();

  const username = discordLink.dataset.copy;

  try {
    await navigator.clipboard.writeText(username);
    discordStatus.textContent = "usuário copiado!";
  } catch {
    discordStatus.textContent = username;
  }

  setTimeout(() => {
    discordStatus.textContent = "clique para copiar";
  }, 1800);
});


// =========================================================
// PLAYER DE MÚSICA
// =========================================================

const musicSection = document.querySelector(".music-section");
const musicAudio = document.querySelector("#music-audio");
const playButton = document.querySelector("#play-button");
const playIcon = document.querySelector("#play-icon");
const playerStatus = document.querySelector("#player-status");
const musicHelp = document.querySelector("#music-help");
const progressInput = document.querySelector("#music-progress");
const currentTimeText = document.querySelector("#current-time");
const durationText = document.querySelector("#duration");
const volumeInput = document.querySelector("#music-volume");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainingSeconds}`;
}

function updateRangeFill(input, percentage) {
  const safePercentage = Math.max(0, Math.min(100, percentage));
  input.style.setProperty("--range-progress", `${safePercentage}%`);
}

function setPlayerState(isPlaying) {
  musicSection.classList.toggle("is-playing", isPlaying);
  playButton.setAttribute("aria-pressed", String(isPlaying));
  playButton.setAttribute("aria-label", isPlaying ? "Pausar música" : "Tocar música");
  playIcon.textContent = isPlaying ? "❚❚" : "▶";
  playerStatus.textContent = isPlaying ? "tocando agora" : "música pausada";
}

musicAudio.volume = Number(volumeInput.value);
updateRangeFill(volumeInput, musicAudio.volume * 100);

playButton.addEventListener("click", async () => {
  try {
    if (musicAudio.paused) {
      await musicAudio.play();
    } else {
      musicAudio.pause();
    }
  } catch (error) {
    playerStatus.textContent = "arquivo não encontrado";
    musicHelp.classList.add("music-error");
    console.warn("Adicione assets/musica.mp3 para usar o player.", error);
  }
});

musicAudio.addEventListener("play", () => setPlayerState(true));
musicAudio.addEventListener("pause", () => setPlayerState(false));

musicAudio.addEventListener("loadedmetadata", () => {
  durationText.textContent = formatTime(musicAudio.duration);
  playerStatus.textContent = "pronta para tocar";
});

musicAudio.addEventListener("timeupdate", () => {
  currentTimeText.textContent = formatTime(musicAudio.currentTime);

  if (!Number.isFinite(musicAudio.duration) || musicAudio.duration === 0) return;

  const percentage = (musicAudio.currentTime / musicAudio.duration) * 100;
  progressInput.value = percentage;
  updateRangeFill(progressInput, percentage);
});

progressInput.addEventListener("input", () => {
  if (!Number.isFinite(musicAudio.duration)) return;

  const percentage = Number(progressInput.value);
  musicAudio.currentTime = (percentage / 100) * musicAudio.duration;
  updateRangeFill(progressInput, percentage);
});

volumeInput.addEventListener("input", () => {
  musicAudio.volume = Number(volumeInput.value);
  updateRangeFill(volumeInput, musicAudio.volume * 100);
});

musicAudio.addEventListener("error", () => {
  playerStatus.textContent = "adicione musica.mp3";
  musicHelp.classList.add("music-error");
});

// =========================================================
// PARTÍCULAS, ESTRELAS E BRILHO DO CURSOR
// =========================================================

const effectsContainer = document.querySelector("#particles");
const cursorGlow = document.querySelector("#cursor-glow");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

function createWhiteEffects() {
  if (reducedMotion || !effectsContainer) return;

  const particleCount = window.innerWidth < 650 ? 22 : 42;

  for (let index = 0; index < particleCount; index += 1) {
    const particle = document.createElement("span");
    const isCross = index % 7 === 0;

    particle.className = `white-particle${isCross ? " cross" : ""}`;
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${1.5 + Math.random() * 3.2}px`);
    particle.style.setProperty("--opacity", `${0.22 + Math.random() * 0.52}`);
    particle.style.setProperty("--duration", `${9 + Math.random() * 15}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 22}s`);
    particle.style.setProperty("--drift", `${-45 + Math.random() * 90}px`);

    effectsContainer.appendChild(particle);
  }

  for (let index = 0; index < 3; index += 1) {
    const star = document.createElement("span");
    star.className = "shooting-star";
    star.style.setProperty("--top", `${8 + Math.random() * 48}%`);
    star.style.setProperty("--star-duration", `${10 + Math.random() * 8}s`);
    star.style.setProperty("--star-delay", `${-Math.random() * 15}s`);
    effectsContainer.appendChild(star);
  }
}

createWhiteEffects();

if (!reducedMotion && !coarsePointer && cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
    cursorGlow.classList.add("visible");
  });

  document.documentElement.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("visible");
  });

  window.addEventListener("pointerdown", (event) => {
    const sparks = 8;

    for (let index = 0; index < sparks; index += 1) {
      const spark = document.createElement("span");
      spark.className = "click-spark";
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      spark.style.setProperty("--angle", `${index * (360 / sparks)}deg`);
      spark.style.setProperty("--distance", `${18 + Math.random() * 24}px`);

      document.body.appendChild(spark);
      window.setTimeout(() => spark.remove(), 750);
    }
  });
}
