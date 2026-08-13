const header = document.querySelector("[data-header]");
const video = document.querySelector("[data-gameplay-video]");
const soundButton = document.querySelector("[data-sound-toggle]");
const soundLabel = document.querySelector("[data-sound-label]");
const revealItems = document.querySelectorAll(".reveal");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 30);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (video && soundButton && soundLabel) {
  soundButton.addEventListener("click", async () => {
    video.muted = !video.muted;
    soundButton.setAttribute("aria-pressed", String(!video.muted));
    soundLabel.textContent = video.muted ? "사운드 켜기" : "사운드 끄기";

    if (video.paused) {
      try {
        await video.play();
      } catch {
        // Browser autoplay policies can still prevent playback until direct interaction.
      }
    }
  });

  const videoObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    },
    { threshold: 0.15 },
  );

  videoObserver.observe(video);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    const target = id && id !== "#" ? document.querySelector(id) : null;
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  });
});
