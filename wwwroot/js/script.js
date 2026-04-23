/* =========================================
   MOBILE MENU
========================================= */
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        siteNav.classList.toggle("open");
    });
}

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
   FLIPBOOK DATA
========================================= */
const bookData = {
    greeting: [
        { word: "Hello", desc: "A friendly sign used to start a conversation." },
        { word: "Thank You", desc: "Used to express appreciation and gratitude." },
        { word: "Good Morning", desc: "A greeting used at the start of the day." }
    ],
    daily: [
        { word: "Eat", desc: "A common word used in everyday communication." },
        { word: "Drink", desc: "Another basic word used in daily conversation." },
        { word: "Sleep", desc: "Used to express rest or bedtime." }
    ],
    feelings: [
        { word: "Happy", desc: "Expresses a positive emotional state." },
        { word: "Sad", desc: "Expresses a low or unhappy emotional state." },
        { word: "Excited", desc: "Shows strong positive energy or anticipation." }
    ]
};

let flipBookInstance = null;

/* =========================================
   FLIPBOOK HELPERS
========================================= */
function destroyFlipBook() {
    if (flipBookInstance) {
        try {
            flipBookInstance.destroy();
        } catch (e) {
            console.warn("Flipbook destroy warning:", e);
        }
        flipBookInstance = null;
    }
}

function resetFlipBookContainer() {
    const wrap = document.querySelector(".flipbook-wrap");
    if (!wrap) return null;

    wrap.innerHTML = '<div id="flipBook" class="flip-book"></div>';
    return document.getElementById("flipBook");
}

function buildFlipPages(type, targetEl) {
    const topic = document.getElementById("viewerTopic");

    if (!targetEl || !topic || !bookData[type]) return false;

    topic.textContent = type;
    targetEl.innerHTML = "";

    const cover = document.createElement("div");
    cover.className = "flip-page";
    cover.innerHTML = `
        <div class="flip-page-content">
            <p class="book-category">Topic Book</p>
            <h3>${type}</h3>
            <p class="book-text">Swipe to explore the pages inside.</p>
            <span class="page-number">Cover</span>
        </div>
    `;
    targetEl.appendChild(cover);

    bookData[type].forEach((item, index) => {
        const page = document.createElement("div");
        page.className = "flip-page";
        page.innerHTML = `
            <div class="flip-page-content">
                <p class="book-category">${type}</p>
                <h3>${item.word}</h3>
                <p class="book-text">${item.desc}</p>
                <span class="page-number">${String(index + 1).padStart(2, "0")}</span>
            </div>
        `;
        targetEl.appendChild(page);
    });

    const endPage = document.createElement("div");
    endPage.className = "flip-page";
    endPage.innerHTML = `
        <div class="flip-page-content">
            <p class="book-category">End</p>
            <h3>${type}</h3>
            <p class="book-text">Go back to choose another topic book.</p>
            <span class="page-number">End</span>
        </div>
    `;
    targetEl.appendChild(endPage);

    return true;
}

function initFlipBook(targetEl) {
    if (!targetEl) return false;

    if (typeof St === "undefined" || !St.PageFlip) {
        console.error("PageFlip library not loaded.");
        return false;
    }

    flipBookInstance = new St.PageFlip(targetEl, {
        width: 380,
        height: 480,
        size: "stretch",
        minWidth: 260,
        maxWidth: 760,
        minHeight: 360,
        maxHeight: 520,
        maxShadowOpacity: 0.35,
        showCover: true,
        mobileScrollSupport: false,
        useMouseEvents: true,
        swipeDistance: 30
    });

    flipBookInstance.loadFromHTML(targetEl.querySelectorAll(".flip-page"));
    return true;
}

/* =========================================
   OPEN / CLOSE BOOK
========================================= */
function openBook(type) {
    const viewer = document.getElementById("bookViewer");
    if (!viewer || !bookData[type]) return;

    destroyFlipBook();

    const freshFlipBook = resetFlipBookContainer();
    if (!freshFlipBook) return;

    const built = buildFlipPages(type, freshFlipBook);
    if (!built) return;

    viewer.classList.remove("hidden");
    viewer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const header = document.querySelector(".site-header");
    if (header) {
        header.style.display = "none";
    }

    const footer = document.querySelector(".site-footer");
    if (footer) {
        footer.style.display = "none";
    }

    setTimeout(() => {
        initFlipBook(freshFlipBook);
    }, 80);
}

function closeBook() {
    const viewer = document.getElementById("bookViewer");
    if (!viewer) return;

    viewer.classList.add("hidden");
    viewer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    const header = document.querySelector(".site-header");
    if (header) {
        header.style.display = "";
    }

    const footer = document.querySelector(".site-footer");
    if (footer) {
        footer.style.display = "";
    }

    destroyFlipBook();
}

window.openBook = openBook;
window.closeBook = closeBook;

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
            const match = title.includes(term);
            card.classList.toggle("is-hidden", !match);
        });
    });
}

/* =========================================
   INIT
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    handleReveal();
    initBookSearch();
    initKBISliders();
    initTuliTalks();
    initTuliTalksHover();
    initTuliTalksSearch();

    document.querySelectorAll(".book-card[data-book]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.book;
            openBook(type);
        });
    });

    const backBtn = document.getElementById("viewerBackBtn");
    const closeBtn = document.getElementById("viewerCloseBtn");
    const viewer = document.getElementById("bookViewer");

    if (backBtn) backBtn.addEventListener("click", closeBook);
    if (closeBtn) closeBtn.addEventListener("click", closeBook);

    if (viewer) {
        viewer.addEventListener("click", (e) => {
            if (e.target === viewer) {
                closeBook();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        const viewerEl = document.getElementById("bookViewer");
        if (!viewerEl || viewerEl.classList.contains("hidden")) return;

        if (e.key === "Escape") {
            closeBook();
        }
    });

    /* ==============================
       CLICKABLE NAV DROPDOWNS
    ============================== */
    const dropdowns = document.querySelectorAll(".nav-dropdown");

    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector(".dropdown-trigger");

        if (trigger) {
            trigger.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isMobile = window.innerWidth <= 768;
                const isOpen = dropdown.classList.contains("open");

                if (isMobile) {
                    dropdowns.forEach((d) => {
                        if (d !== dropdown) {
                            d.classList.remove("open");
                        }
                    });

                    dropdown.classList.toggle("open", !isOpen);
                } else {
                    dropdowns.forEach((d) => {
                        d.classList.remove("open");
                    });

                    if (!isOpen) {
                        dropdown.classList.add("open");
                    }
                }
            });
        }
    });

    document.querySelectorAll(".dropdown-panel").forEach((panel) => {
        panel.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    });

    /* ==============================
       GLOBAL CLICK OUTSIDE
    ============================== */
    document.addEventListener("click", (e) => {
        const nav = document.getElementById("siteNav");
        const toggle = document.getElementById("menuToggle");

        if (nav && nav.contains(e.target)) return;
        if (toggle && toggle.contains(e.target)) return;

        if (siteNav) {
            siteNav.classList.remove("open");
        }

        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("open");
        });
    });
});
/* =========================================
   EXPERIENCE IMAGE SLIDERS
========================================= */
function initExperienceSliders() {
    const sliders = document.querySelectorAll("[data-slider]");

    sliders.forEach((slider) => {
        const images = slider.querySelectorAll(".exp-story-img");
        const prevBtn = slider.querySelector("[data-prev]");
        const nextBtn = slider.querySelector("[data-next]");
        const story = slider.closest(".exp-story");
        const thumbs = story ? story.querySelectorAll(".exp-thumb") : [];

        if (!images.length) return;

        let currentIndex = 0;
        let autoSlide;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle("active", i === index);
            });

            thumbs.forEach((thumb, i) => {
                thumb.classList.toggle("active-thumb", i === index);
            });

            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % images.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showSlide(prevIndex);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlide = setInterval(nextSlide, 3000);
        }

        function stopAutoSlide() {
            if (autoSlide) {
                clearInterval(autoSlide);
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                prevSlide();
                startAutoSlide();
            });
        }

        // click main image area to go next
        slider.addEventListener("click", () => {
            nextSlide();
            startAutoSlide();
        });

        // click thumbnail to switch
        thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", () => {
                showSlide(index);
                startAutoSlide();
            });
        });

        // pause when hovered
        slider.addEventListener("mouseenter", stopAutoSlide);
        slider.addEventListener("mouseleave", startAutoSlide);

        showSlide(0);
        startAutoSlide();
    });
}

/* =========================================
   DETAIL PAGE SLIDERS
========================================= */
function initDetailSliders() {
    const sliders = document.querySelectorAll(".detail-hero-slider[data-slider]");

    sliders.forEach((slider) => {
        const images = slider.querySelectorAll(".detail-hero-img");
        const prevBtn = slider.querySelector("[data-prev]");
        const nextBtn = slider.querySelector("[data-next]");
        const pageContainer = slider.closest(".container");
        const thumbs = pageContainer ? pageContainer.querySelectorAll(".detail-thumb") : [];

        if (!images.length) return;

        let currentIndex = 0;
        let autoSlide;

        function showSlide(index) {
            images.forEach((img, i) => {
                img.classList.toggle("active", i === index);
            });

            thumbs.forEach((thumb, i) => {
                thumb.classList.toggle("active-thumb", i === index);
            });

            currentIndex = index;
        }

        function nextSlide() {
            showSlide((currentIndex + 1) % images.length);
        }

        function prevSlide() {
            showSlide((currentIndex - 1 + images.length) % images.length);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlide = setInterval(nextSlide, 3000);
        }

        function stopAutoSlide() {
            if (autoSlide) clearInterval(autoSlide);
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                prevSlide();
                startAutoSlide();
            });
        }

        slider.addEventListener("click", () => {
            nextSlide();
            startAutoSlide();
        });

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", () => {
                showSlide(index);
                startAutoSlide();
            });
        });

        slider.addEventListener("mouseenter", stopAutoSlide);
        slider.addEventListener("mouseleave", startAutoSlide);

        showSlide(0);
        startAutoSlide();
    });
}
/* =========================================
   KBI STORY SLIDERS
========================================= */
function initKBISliders() {
    const sliders = document.querySelectorAll("[data-kbi-slider]");

    sliders.forEach((slider) => {
        const slides = slider.querySelectorAll(".kbi-slide");
        const prevBtn = slider.querySelector("[data-prev]");
        const nextBtn = slider.querySelector("[data-next]");
        const section = slider.closest(".kbi-section");
        const thumbs = section ? section.querySelectorAll(".kbi-thumb") : [];

        if (!slides.length) return;

        let currentIndex = 0;
        let autoSlide;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });

            thumbs.forEach((thumb, i) => {
                thumb.classList.toggle("active-thumb", i === index);
            });

            currentIndex = index;
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % slides.length;
            showSlide(nextIndex);
        }

        function prevSlide() {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(prevIndex);
        }

        function startAutoSlide() {
            stopAutoSlide();
            autoSlide = setInterval(nextSlide, 3000);
        }

        function stopAutoSlide() {
            if (autoSlide) {
                clearInterval(autoSlide);
            }
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                nextSlide();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                prevSlide();
                startAutoSlide();
            });
        }

        slider.addEventListener("click", () => {
            nextSlide();
            startAutoSlide();
        });

        thumbs.forEach((thumb, index) => {
            thumb.addEventListener("click", () => {
                showSlide(index);
                startAutoSlide();
            });
        });

        slider.addEventListener("mouseenter", stopAutoSlide);
        slider.addEventListener("mouseleave", startAutoSlide);

        showSlide(0);
        startAutoSlide();
    });
}
function initTuliTalks() {
    const cards = document.querySelectorAll(".tt-card");
    const viewer = document.getElementById("ttViewer");
    const player = document.getElementById("ttPlayer");
    const closeBtn = document.getElementById("ttClose");

    if (!viewer || !player) return;

    cards.forEach(card => {
        card.addEventListener("click", () => {
            const videoSrc = card.dataset.video;

            player.src = videoSrc;
            viewer.classList.remove("hidden");

            setTimeout(() => {
                player.play();
            }, 100);
        });
    });

    function closeViewer() {
        player.pause();
        player.src = "";
        viewer.classList.add("hidden");
    }

    closeBtn.addEventListener("click", closeViewer);
    viewer.addEventListener("click", (e) => {
        if (e.target.classList.contains("tt-viewer-overlay")) {
            closeViewer();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeViewer();
    });
}
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

    viewer.addEventListener("click", (e) => {
        if (e.target.classList.contains("tt-viewer-overlay")) {
            closeViewer();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeViewer();
        }
    });
}
function initTuliTalksHover() {
    const cards = document.querySelectorAll(".tt-card");

    if (!cards.length) return;

    cards.forEach(card => {
        const video = card.querySelector("video");
        if (!video) return;

        card.addEventListener("mouseenter", () => {
            video.play();
        });

        card.addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}
function initTuliTalksSearch() {
    const input = document.getElementById("ttSearch");
    const cards = document.querySelectorAll(".tt-card");

    if (!input || !cards.length) return;

    input.addEventListener("input", () => {
        const value = input.value.toLowerCase();

        cards.forEach(card => {
            const text = card.innerText.toLowerCase();

            if (text.includes(value)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
}