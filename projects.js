// Updated Projects Section - Separate Reels and Long-form Videos

// Data Source - Categorized
const reelsVideos = [
  {
    title: "INSTAGRAM REEL",
    type: "short",
    link: "assets/reel.mp4",
  },
  {
    title: "TIKTOK TREND",
    type: "short",
    link: "assets/doc-edit.mp4",
  },
  {
    title: "PRODUCT TEASER",
    type: "short",
    link: "assets/product.mp4",
  },
  {
    title: "VIRAL SHORT",
    type: "short",
    link: "assets/shorts.mp4",
  },
];

const longFormVideos = [
  {
    title: "DOCUMENTARY EDIT",
    type: "long",
    link: "https://www.youtube.com/watch?v=M7FIvfx5J10",
    description:
      "A compelling documentary showcasing real stories with cinematic editing and powerful narrative structure.",
  },
  {
    title: "PODCAST SERIES",
    type: "long",
    link: "https://www.youtube.com/watch?v=M7FIvfx5J10",
    description:
      "Multi-episode podcast series with professional editing, motion graphics, and seamless transitions.",
  },
  {
    title: "VLOG MASTERCLASS",
    type: "long",
    link: "https://www.youtube.com/watch?v=M7FIvfx5J10",
    description:
      "Travel vlog series with dynamic pacing, color grading, and engaging storytelling techniques.",
  },
  {
    title: "BRAND CAMPAIGN",
    type: "long",
    link: "https://www.youtube.com/watch?v=M7FIvfx5J10",
    description:
      "Commercial brand campaign featuring product showcase, testimonials, and lifestyle shots.",
  },
  {
    title: "EVENT COVERAGE",
    type: "long",
    link: "https://www.youtube.com/watch?v=M7FIvfx5J10",
    description:
      "Live event highlights with multi-cam editing, audio mixing, and cinematic post-production.",
  },
  {
    title: "MUSIC VIDEO",
    type: "long",
    link: "https://www.youtube.com/watch?v=M7FIvfx5J10",
    description:
      "Creative music video with complex effects, color science, and rhythm-based editing.",
  },
];

let reelsSwiper = null;
let youtubeApiReady = false;
let currentModalPlayer = null;

// 1. Load YouTube IFrame API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
  youtubeApiReady = true;
  // We don't wait for this to init the grid anymore, but we update status
}

// Init everything immediately on load
document.addEventListener("DOMContentLoaded", () => {
  initReelsSlider();
  initLongFormGrid();
  initSkillScrollLogic();
});

// === REELS SLIDER ===
function initReelsSlider() {
  const wrapper = document.getElementById("reelsWrapper");
  if (!wrapper) return;
  if (wrapper.children.length > 0) return;

  wrapper.innerHTML = "";

  reelsVideos.forEach((reel, index) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";

    let thumbContent = "";
    if (reel.link.includes("youtube.com") || reel.link.includes("youtu.be")) {
      let videoId = extractYouTubeId(reel.link);
      thumbContent = `<img src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" style="width:100%; height:100%; object-fit:cover; border-radius: 8px;">`;
    } else {
      thumbContent = `<video src="${reel.link}" muted preload="metadata" style="width:100%; height:100%; object-fit:cover; border-radius: 8px;"></video>`;
    }

    slide.innerHTML = `
            <div class="project-card short-form" onclick="openVideoModal(${index}, 'reel')" style="cursor: pointer;">
                <div class="video-wrapper">
                    <div class="video-thumbnail" style="width:100%; height:100%; position:relative;">
                        ${thumbContent}
                        <div class="play-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.3); display:flex; justify-content:center; align-items:center; transition: all 0.3s;">
                            <div class="play-btn-overlay">
                                <i class="ri-play-fill"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card-content">
                    <h3 class="card-title">${reel.title}</h3>
                    <div class="card-tags">
                        <span class="tag">SHORT-FORM</span>
                    </div>
                </div>
            </div>
        `;

    wrapper.appendChild(slide);
  });

  // Initialize Swiper for Reels
  reelsSwiper = new Swiper(".reels-slider", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    initialSlide: 1,
    speed: 600,
    spaceBetween: 0,

    coverflowEffect: {
      rotate: 40,
      stretch: 0,
      depth: 250,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: ".reels-slider .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".reels-slider .swiper-button-next",
      prevEl: ".reels-slider .swiper-button-prev",
    },
    breakpoints: {
      320: {
        effect: "slide",
        slidesPerView: 1.1,
        spaceBetween: 20,
      },
      768: {
        effect: "coverflow",
        slidesPerView: "auto",
      },
    },
  });

  // Animate the Reels Slider
  gsap.from(".reels-slider", {
    scrollTrigger: {
      trigger: "#reels",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    y: 50,
    autoAlpha: 0,
    duration: 1.2,
    ease: "power3.out",
    clearProps: "transform,opacity,visibility",
  });
}

// === LONG-FORM GRID ===
function initLongFormGrid() {
  const gridContainer = document.getElementById("videoGrid");
  if (!gridContainer) return;
  if (gridContainer.children.length > 0) return;

  gridContainer.innerHTML = "";

  longFormVideos.forEach((video, index) => {
    const card = document.createElement("div");
    // Removed 'fade-in-up' to avoid CSS conflicts; GSAP handles opacity
    card.className = "grid-video-card";
    card.onclick = () => openVideoModal(index, "long");

    let thumbContent = "";
    if (video.link.includes("youtube.com") || video.link.includes("youtu.be")) {
      let videoId = extractYouTubeId(video.link);
      thumbContent = `<img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="${video.title}">`;
    } else {
      thumbContent = `<video src="${video.link}" muted preload="metadata"></video>`;
    }

    card.innerHTML = `
            <div class="grid-thumbnail">
                ${thumbContent}
                <div class="grid-play-overlay">
                    <div class="play-btn-overlay">
                        <i class="ri-play-fill"></i>
                    </div>
                </div>
            </div>
            <div class="grid-card-content">
                <h3 class="grid-card-title">${video.title}</h3>
                <p class="grid-card-description">${video.description}</p>
                <div class="grid-card-tags">
                    <span class="tag">LONG-FORM</span>
                </div>
            </div>
        `;

    gridContainer.appendChild(card);
  });

  // Animate the newly injected grid cards
  // Ensure container is visible and layout is recalculated
  gsap.set(gridContainer, { autoAlpha: 1 });
  ScrollTrigger.refresh();

  gsap.from(".grid-video-card", {
    scrollTrigger: {
      trigger: "#videoGrid",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    y: 50,
    autoAlpha: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: "power3.out",
    clearProps: "all", // Ensure clean state after animation
  });
}

// === MODAL LOGIC ===
window.openVideoModal = function (index, type) {
  let video;
  if (type === "reel") {
    video = reelsVideos[index];
  } else {
    video = longFormVideos[index];
  }

  const modal = document.getElementById("videoModal");
  const container = document.getElementById("modalPlayerContainer");
  const loader = document.querySelector(".modal-loader");
  const contentBox = document.querySelector(".modal-content");

  // Reset Classes for Orientation
  contentBox.classList.remove("landscape", "vertical");
  if (video.type === "short") {
    contentBox.classList.add("vertical");
  } else {
    contentBox.classList.add("landscape");
  }

  // Show Modal
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);

  loader.style.display = "block";

  // Clear Previous Player
  container.innerHTML = "";

  // Init Player
  if (video.link.includes("youtube.com") || video.link.includes("youtu.be")) {
    let videoId = extractYouTubeId(video.link);

    const ytDiv = document.createElement("div");
    ytDiv.id = "yt-modal-player";
    container.appendChild(ytDiv);

    currentModalPlayer = new YT.Player("yt-modal-player", {
      height: "100%",
      width: "100%",
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          loader.style.display = "none";
        },
      },
    });
  } else {
    // Local Video
    const videoEl = document.createElement("video");
    videoEl.src = video.link;
    videoEl.style.width = "100%";
    videoEl.style.height = "100%";
    videoEl.style.objectFit = "contain";
    videoEl.controls = true;
    videoEl.autoplay = true;
    videoEl.playsInline = true;

    container.appendChild(videoEl);

    videoEl.oncanplay = () => {
      loader.style.display = "none";
    };
    currentModalPlayer = videoEl;
  }
};

// About Video Modal
window.openAboutVideoModal = function () {
  const video = {
    title: "MY STORY",
    type: "short",
    link: "assets/shorts.mp4",
  };

  const modal = document.getElementById("videoModal");
  const container = document.getElementById("modalPlayerContainer");
  const loader = document.querySelector(".modal-loader");
  const contentBox = document.querySelector(".modal-content");

  contentBox.classList.remove("landscape", "vertical");
  contentBox.classList.add("vertical");

  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("active");
  }, 10);

  loader.style.display = "block";
  container.innerHTML = "";

  const videoEl = document.createElement("video");
  videoEl.src = video.link;
  videoEl.style.width = "100%";
  videoEl.style.height = "100%";
  videoEl.style.objectFit = "contain";
  videoEl.controls = true;
  videoEl.autoplay = true;
  videoEl.playsInline = true;

  container.appendChild(videoEl);

  videoEl.oncanplay = () => {
    loader.style.display = "none";
  };
  currentModalPlayer = videoEl;
};

window.closeVideoModal = function () {
  const modal = document.getElementById("videoModal");
  const container = document.getElementById("modalPlayerContainer");

  modal.classList.remove("active");

  setTimeout(() => {
    modal.style.display = "none";

    if (currentModalPlayer) {
      if (typeof currentModalPlayer.destroy === "function") {
        currentModalPlayer.destroy();
      } else if (currentModalPlayer.pause) {
        currentModalPlayer.pause();
        currentModalPlayer.src = "";
      }
    }
    container.innerHTML = "";
    currentModalPlayer = null;
  }, 300);
};

// Helper: Extract YouTube Video ID
function extractYouTubeId(url) {
  let videoId = "";
  if (url.includes("watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }
  return videoId;
}

// Fallback init
setTimeout(() => {
  if (!youtubeApiReady) {
    initReelsSlider();
    initLongFormGrid();
  }
}, 2000);

// Scroll to Projects on Skill Click
function initSkillScrollLogic() {
  const skills = document.querySelectorAll(".skill-item");
  const reelsSection = document.getElementById("reels");

  if (!reelsSection) return;

  skills.forEach((skill) => {
    skill.style.cursor = "pointer";
    skill.addEventListener("click", () => {
      reelsSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

// Initialize scroll logic after page load
setTimeout(() => {
  initSkillScrollLogic();
  initScrollAnimations(); // Call the new animation init
}, 1000);

// Scroll Animation Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-in-up").forEach((el) => {
    observer.observe(el);
  });
}
