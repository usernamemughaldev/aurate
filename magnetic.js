const slabs = document.querySelectorAll(".shapesMagnet");

slabs.forEach((slab) => {
    slab.addEventListener("mousemove", (e) => {
        const { left, top, width, height } = slab.getBoundingClientRect();

        // Calculate relative position (-0.5 to 0.5)
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;

        // Strength of magnetic effect (pixels)
        const finalX = x * 30; // Increased strength for visibility
        const finalY = y * 30;

        // Use GSAP 'x' and 'y' which works independently of 'xPercent'/'yPercent'
        gsap.to(slab, {
            x: finalX,
            y: finalY,
            duration: 0.5,
            ease: "power2.out",
            overwrite: 'auto'
        });
    });

    slab.addEventListener('mouseleave', () => {
        gsap.to(slab, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.3)"
        });
    });
});
