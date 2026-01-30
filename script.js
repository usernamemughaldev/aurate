// --- Initialization ---
console.log("Initializing Portfolio...");

// 1. Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Cursor Logic
const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");

document.addEventListener("mousemove", (e) => {
  gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
  gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
});

document.querySelectorAll("a, button, .swiper-slide").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("active"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
});

// 3. Preloader Simulation & Rendering Text
window.addEventListener("load", () => {
  const loaderText = document.querySelector(".loader-status");
  const loaderMsg = document.querySelector(".loader-text");
  const progressBar = document.querySelector(".progress-bar");
  const preloader = document.querySelector(".preloader");

  const messages = [
    "INITIALIZING CORE...",
    "LOADING ASSETS...",
    "RENDERING FRAMES...",
    "COMPILING...",
    "READY",
  ];
  let msgIndex = 0;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1;
    if (progress > 100) progress = 100;

    loaderText.textContent = `${progress}%`;
    progressBar.style.width = `${progress}%`;

    // Change text based on progress intervals
    if (progress > 20 && msgIndex === 0) {
      msgIndex++;
      loaderMsg.innerText = messages[msgIndex];
    }
    if (progress > 50 && msgIndex === 1) {
      msgIndex++;
      loaderMsg.innerText = messages[msgIndex];
    }
    if (progress > 80 && msgIndex === 2) {
      msgIndex++;
      loaderMsg.innerText = messages[msgIndex];
    }

    if (progress === 100) {
      clearInterval(interval);
      loaderMsg.innerText = messages[4];

      setTimeout(() => {
        gsap.to(preloader, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.classList.remove("loading-state");
            if (typeof initLoadAnimations === "function") initLoadAnimations();
            if (typeof initScrollAnimations === "function")
              initScrollAnimations();

            // Force a refresh of ScrollTrigger after preloader is gone and layout is stable
            ScrollTrigger.refresh();

            // Start music after preloader
            if (typeof startMusic === "function") startMusic();
          },
        });
      }, 800);
    }
  }, 40);
});

// 6. Audio Logic (Howler.js)
// Music plays automatically on load with low volume
const sound = new Howl({
  src: ["assets/audio.mp3"],
  loop: true,
  volume: 0.2, // Low volume (20%)
  html5: true,
  autoplay: false, // Can't autoplay until user interaction, so we'll trigger after preloader
  onloaderror: function (id, error) {
    console.error("Audio load error:", error);
  },
  onplayerror: function (id, error) {
    console.error("Audio play error:", error);
    // Attempt to unlock audio on user interaction
    sound.once("unlock", function () {
      sound.play();
    });
  },
  onload: function () {
    console.log("Audio loaded successfully");
  },
});

const musicToggle = document.getElementById("musicToggle");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
let isPlaying = false; // Start as false, music not playing initially
let musicStarted = false; // Track if music has been started to prevent duplicate calls

// Auto-play music after preloader (called only once)
function startMusic() {
  if (musicStarted) return; // Prevent duplicate calls
  musicStarted = true;

  setTimeout(() => {
    sound.play();
    isPlaying = true;
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  }, 500);
}

musicToggle.addEventListener("click", () => {
  if (isPlaying) {
    // Currently playing, so pause it
    sound.pause();
    isPlaying = false;
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  } else {
    // Currently paused, so play it
    sound.play();
    isPlaying = true;
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  }
});

// 4. Hero Animations (Floating Shapes)
function initHeroAnimations() {
  gsap.to(".hero-title .line", {
    y: 0,
    opacity: 1,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
  });

  // Random floating for shapes (clips)
  gsap.utils.toArray(".hero-clip").forEach((shape) => {
    gsap.to(shape, {
      xPercent: "random(-20, 20)",
      yPercent: "random(-20, 20)",
      rotation: "random(-10, 10)",
      duration: "random(2, 4)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });
}

// 5. Skills Timeline Animation (Parallax)
// We wait for DOM content loaded to ensure elements exist
// 5. Skills Timeline Animation (Parallax)
document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  // --- Random Light/Neon Colors for Clips ---
  // Using distinct light/neon colors for high contrast against dark bg
  const neonColors = [
    { hex: "#FF00FF" }, // Magenta
    { hex: "#00FFFF" }, // Cyan
    { hex: "#00FF00" }, // Lime
    { hex: "#FFFF00" }, // Yellow
    { hex: "#FF4500" }, // OrangeRed
    { hex: "#7FFF00" }, // Chartreuse
    { hex: "#FF1493" }, // DeepPink
    { hex: "#00BFFF" }, // DeepSkyBlue
    { hex: "#FFD700" }, // Gold
  ];

  document.querySelectorAll(".skill-item").forEach((item) => {
    const color = neonColors[Math.floor(Math.random() * neonColors.length)].hex;

    // Apply Neon Glass Style
    item.style.backgroundColor = hexToRgba(color, 0.15); // Light transparent filler
    item.style.border = `1px solid ${color}`;
    item.style.color = color; // Text matches border
    item.style.boxShadow = `0 0 10px ${hexToRgba(color, 0.1)}`; // Subtle glow

    // Randomize width slightly for organic feel
    const width = Math.floor(Math.random() * (350 - 200 + 1) + 200);
    item.style.minWidth = `${width}px`;

    // Hover effect logic is in CSS, but we can enhance here if needed
    item.addEventListener("mouseenter", () => {
      gsap.to(item, {
        boxShadow: `0 0 20px ${hexToRgba(color, 0.4)}`,
        scale: 1.05,
        duration: 0.3,
      });
      item.style.color = "#fff"; // White text on hover
      item.style.backgroundColor = hexToRgba(color, 0.3);
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        boxShadow: `0 0 10px ${hexToRgba(color, 0.1)}`,
        scale: 1,
        duration: 0.3,
      });
      item.style.color = color;
      item.style.backgroundColor = hexToRgba(color, 0.15);
    });
  });

  const timelineSection = document.querySelector("#skills");
  const tracks = document.querySelectorAll(".track");

  // Master Timeline for Pinning
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: timelineSection,
      pin: true,
      scrub: 1,
      end: "+=500", // 50% scroll distance (reduced from original)
      invalidateOnRefresh: true,
    },
  });

  // Parallax Movement (50% of original distances)
  tl.to(tracks[0], { x: -1900, ease: "none" }, 0)
    .to(tracks[1], { x: -1600, ease: "none" }, 0)
    .to(tracks[2], { x: -2100, ease: "none" }, 0)
    .to(".timeline-ruler", { x: -1900, ease: "none" }, 0);

  let scrollTween = tl;

  // 5a. Generate Timeline Ruler Markers
  const ruler = document.querySelector(".timeline-ruler");
  const totalMarkers = 80;
  for (let i = 0; i < totalMarkers; i++) {
    const marker = document.createElement("div");
    marker.style.position = "absolute";
    marker.style.left = `${i * 100}px`;
    marker.style.top = "0";
    marker.style.fontSize = "0.7rem";
    marker.style.color = "#555";
    marker.innerText = `00:00:${i < 10 ? "0" + i : i}`;
    ruler.appendChild(marker);
  }

  // 5b. Sticky Title Logic
  const skillTitle = document.querySelector(".current-skill-text");
  gsap.utils.toArray(".skill-item").forEach((item) => {
    ScrollTrigger.create({
      trigger: item,
      containerAnimation: scrollTween,
      start: "left 50%",
      end: "right 50%",
      onEnter: () => updateSkillTitle(item, true),
      onEnterBack: () => updateSkillTitle(item, true),
      onLeave: () => updateSkillTitle(item, false),
      onLeaveBack: () => updateSkillTitle(item, false),
      toggleClass: { targets: item, className: "active" },
    });
  });

  function updateSkillTitle(item, isActive) {
    if (isActive && skillTitle) {
      const title = item.getAttribute("data-title");
      skillTitle.innerText = title;
      gsap.to(skillTitle, { opacity: 1, duration: 0.2, scale: 1 });
    }
  }
});

// Helper: Hex to RGBA
function hexToRgba(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// End of script
