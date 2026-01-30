// animation.js

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Global Default Settings for "Smoother and Slower" feel
gsap.defaults({
  duration: 1.8, // Increased from ~0.8 to 1.8 for slow cinematic feel
  ease: "power3.out", // Smooth deceleration
});

// 1. Initial Load Animation (Hero Section)
// Triggered by script.js after preloader finishes
function initLoadAnimations() {
  console.log("Initializing Load Animations...");

  const tl = gsap.timeline();

  // Hero Content Container
  tl.from(".hero-content", {
    y: 100,
    autoAlpha: 0,
    duration: 2,
  });

  // Hero Title Lines (staggered)
  tl.from(
    ".hero-title .line",
    {
      y: 50,
      autoAlpha: 0,
      stagger: 0.3, // Slower stagger
      duration: 2,
      ease: "expo.out", // More dramatic ease
    },
    "-=1.5",
  );

  // Hero Description
  tl.from(
    ".hero-description",
    {
      y: 30,
      autoAlpha: 0,
      duration: 2,
    },
    "-=1.5",
  );

  // Hero Buttons
  tl.from(
    ".hero-buttons a",
    {
      y: 30,
      autoAlpha: 0,
      stagger: 0.2,
      duration: 1.5,
    },
    "-=1.5",
  );

  // Client Showcase Elements
  tl.from(
    ".client-showcase .client-image-wrapper",
    {
      scale: 0,
      autoAlpha: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: "back.out(1.7)",
    },
    "-=1.0",
  );

  tl.from(
    ".client-text",
    {
      x: -20,
      autoAlpha: 0,
      duration: 1.5,
    },
    "-=0.8",
  );

  // Animate Hero Clips (Floating elements)
  gsap.from(".hero-clip", {
    scale: 0,
    rotation: -45,
    autoAlpha: 0,
    duration: 2,
    stagger: 0.3,
    ease: "elastic.out(1, 0.5)",
    delay: 0.5,
  });
}

// 2. Scroll Triggered Animations (Sections)
// Triggered by script.js after preloader finishes
function initScrollAnimations() {
  console.log("Initializing Scroll Animations...");

  // Target ALL sections generically first to ensure everything has some trigger
  const sections = document.querySelectorAll("section:not(#hero)");

  sections.forEach((section) => {
    // Find all major children elements in this section
    // We target: headings, paragraphs, buttons, images, cards, lists
    // EXCLUDED: .video-grid and .swiper (handled by projects.js to avoid conflicts)
    const elements = section.querySelectorAll(
      "h2, h3, p, .btn, .about-video-wrapper, .track, .contact-info-card, .contact-form-card",
    );

    if (elements.length > 0) {
      gsap.from(elements, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%", // Start animation when section top is 85% down viewport
          toggleActions: "play none none reverse",
        },
        y: 50,
        autoAlpha: 0,
        duration: 1.5,
        stagger: 0.15, // Stagger each element for a cascading effect
        ease: "power3.out",
      });
    }
  });

  // Specific complex animations for Timeline/Skills
  // We want the timeline to simply appear, but the items to pop in
  // Note: The horizontal scroll logic would go here if we were implementing that,
  // but for now we just ensure visibility.

  // Animate individual skill items in the timeline
  gsap.utils.toArray(".track").forEach((track, i) => {
    const items = track.querySelectorAll(".skill-item");

    gsap.from(items, {
      scrollTrigger: {
        trigger: track,
        start: "left right", // horizontal trigger logic or just when track appears
        containerAnimation: null, // if we had a horizontal scroll tween
      },
      scale: 0.5,
      autoAlpha: 0,
      duration: 1,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.2 * i,
    });
  });

  // Animate Projects Grid Items
  // We leave this entirely to projects.js to avoid conflicts
  // as the grid is dynamic and has its own specific logic.
}
