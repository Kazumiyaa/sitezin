const container = document.querySelector("#intro-particles");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (container && !reducedMotion) {
  const total = window.innerWidth < 600 ? 24 : 44;

  for (let index = 0; index < total; index += 1) {
    const particle = document.createElement("span");
    particle.className = "intro-particle";
    particle.style.setProperty("--x", `${Math.random() * 100}%`);
    particle.style.setProperty("--size", `${1.2 + Math.random() * 3.1}px`);
    particle.style.setProperty("--opacity", `${0.2 + Math.random() * 0.6}`);
    particle.style.setProperty("--duration", `${10 + Math.random() * 16}s`);
    particle.style.setProperty("--delay", `${-Math.random() * 20}s`);
    particle.style.setProperty("--drift", `${-55 + Math.random() * 110}px`);
    container.appendChild(particle);
  }
}
