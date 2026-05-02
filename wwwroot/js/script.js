/* =========================================
   REVEAL ON SCROLL
========================================= */
function handleReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    const triggerBottom = window.innerHeight * 0.88;

    revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", handleReveal);
window.addEventListener("load", handleReveal);

/* =========================================
   SEARCH TOPIC BOOKS
========================================= */
function initBookSearch() {
    const searchInput = document.getElementById("bookSearchInput");
    const bookCards = document.querySelectorAll(".book-card[data-title]");

    if (!searchInput || !bookCards.length) return;

    searchInput.addEventListener("input", () => {
        const term = searchInput.value.trim().toLowerCase();

        bookCards.forEach((card) => {
            const title = (card.dataset.title || "").toLowerCase();
            const text = card.innerText.toLowerCase();
            const match = title.includes(term) || text.includes(term);

            card.classList.toggle("is-hidden", !match);
        });
    });
}

/* =========================================
   NAVBAR (FINAL FIXED)
========================================= */
function initNavbar() {
    const nav = document.getElementById("siteNav");
    const toggle = document.getElementById("menuToggle");
    const dropdowns = document.querySelectorAll(".nav-dropdown");

    // Mobile toggle
    if (toggle && nav) {
        toggle.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            nav.classList.toggle("open");
        });
    }

    // Dropdown open
    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector(".dropdown-trigger");

        if (!trigger) return;

        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const alreadyOpen = dropdown.classList.contains("open");

            dropdowns.forEach((d) => d.classList.remove("open"));

            if (!alreadyOpen) {
                dropdown.classList.add("open");
            }
        });
    });

    // Prevent inside click closing
    document.querySelectorAll(".dropdown-panel").forEach((panel) => {
        panel.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });

    // Click outside close
    document.addEventListener("click", (e) => {
        if (e.target.closest(".nav-dropdown")) return;
        if (e.target.closest("#menuToggle")) return;

        dropdowns.forEach((d) => d.classList.remove("open"));

        if (nav) {
            nav.classList.remove("open");
        }
    });
}

/* =========================================
   EXPERIENCE SLIDER
========================================= */
function initExperienceSliders() {
    const sliders = document.querySelectorAll("[data-slider]");

    sliders.forEach((slider) => {
        const images = slider.querySelectorAll(".exp-story-img");
        const prevBtn = slider.querySelector("[data-prev]");
        const nextBtn = slider.querySelector("[data-next]");

        if (!images.length) return;

        let currentIndex = 0;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle("active", i === index);
            });
            currentIndex = index;
        }

        function nextSlide() {
            showSlide((currentIndex + 1) % images.length);
        }

        function prevSlide() {
            showSlide((currentIndex - 1 + images.length) % images.length);
        }

        if (nextBtn) nextBtn.addEventListener("click", nextSlide);
        if (prevBtn) prevBtn.addEventListener("click", prevSlide);

        showSlide(0);
    });
}

/* =========================================
   TULI TALKS
========================================= */
function initTuliTalks() {
    const cards = document.querySelectorAll(".tt-card");
    const viewer = document.getElementById("ttViewer");
    const player = document.getElementById("ttPlayer");
    const closeBtn = document.getElementById("ttClose");

    if (!cards.length || !viewer || !player || !closeBtn) return;

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const videoSrc = card.dataset.video;
            if (!videoSrc) return;

            player.src = videoSrc;
            viewer.classList.remove("hidden");
            player.play();
        });
    });

    function closeViewer() {
        player.pause();
        player.src = "";
        viewer.classList.add("hidden");
    }

    closeBtn.addEventListener("click", closeViewer);
}

/* =========================================
   INIT
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    handleReveal();
    initBookSearch();
    initNavbar();
    initExperienceSliders();
    initTuliTalks();
});