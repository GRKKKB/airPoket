document.addEventListener("scroll", () => {
    const sections = document.querySelectorAll(".section-background");

    
    const body = document.body;

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            const bgColor = section.getAttribute("data-bg");

            body.style.backgroundColor = bgColor;
        }
    });
});
