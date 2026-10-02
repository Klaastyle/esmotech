// main.js - Core functionality for ESMOTECH website

document.addEventListener('DOMContentLoaded', () => {
    console.log('ESMOTECH Platform Loaded');
    initNumberTicker();
    initAceternityGridSpotlight();
    initStickyScroll();
});

/**
 * Aceternity UI: Grid Spotlight Interaction
 * Dynamically tracks cursor over CAD grid blueprint sections
 */
function initAceternityGridSpotlight() {
    const grids = document.querySelectorAll('.reafilat-hub-wrapper');
    grids.forEach(grid => {
        grid.addEventListener('mousemove', e => {
            const rect = grid.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            grid.style.setProperty('--mouse-x', `${x}%`);
            grid.style.setProperty('--mouse-y', `${y}%`);
        });
        grid.addEventListener('mouseleave', () => {
            grid.style.setProperty('--mouse-x', '50%');
            grid.style.setProperty('--mouse-y', '50%');
        });
    });
}

/**
 * Magic UI: Number Ticker Component
 * Smoothly animates numbers upwards using quartic ease-out
 * with optional delay and locale formatting (e.g. 5.000)
 */
function initNumberTicker() {
    const tickers = document.querySelectorAll('.number-ticker');
    if (!tickers.length) return;

    tickers.forEach(el => {
        if (el._tickerTimer) clearInterval(el._tickerTimer);

        const target = parseFloat(el.getAttribute('data-value') || '0');
        const start = parseFloat(el.getAttribute('data-start') || '0');
        const delay = parseFloat(el.getAttribute('data-delay') || '0') * 1000;
        const duration = parseFloat(el.getAttribute('data-duration') || '1800');
        const isLocale = el.getAttribute('data-format') === 'locale';
        const formatter = isLocale ? new Intl.NumberFormat('ca-ES') : null;

        el.textContent = formatter ? formatter.format(start) : start;

        setTimeout(() => {
            const startTime = Date.now();
            el._tickerTimer = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                const currentValue = Math.round(start + (target - start) * easeProgress);

                el.textContent = formatter ? formatter.format(currentValue) : currentValue;

                if (progress >= 1) {
                    clearInterval(el._tickerTimer);
                    el._tickerTimer = null;
                    el.textContent = formatter ? formatter.format(target) : target;
                }
            }, 20);
        }, delay);
    });
}

/**
 * Aceternity UI: Features with Sticky Scroll
 * Switches active media card as the user scrolls past each feature block
 */
function initStickyScroll() {
    const steps = document.querySelectorAll('.sticky-scroll-step');
    const mediaCards = document.querySelectorAll('.sticky-scroll-media-card');
    if (!steps.length || !mediaCards.length) return;

    function setActiveStep(index) {
        steps.forEach((step, idx) => {
            if (idx === index) {
                step.classList.add('is-active');
            } else {
                step.classList.remove('is-active');
            }
        });

        mediaCards.forEach((card, idx) => {
            if (idx === index) {
                card.classList.add('is-active');
            } else {
                card.classList.remove('is-active');
            }
        });
    }

    // Scroll listener with optimal threshold calculation
    function checkScroll() {
        const viewportCenter = window.innerHeight * 0.45;
        let bestIndex = 0;
        let minDistance = Infinity;

        steps.forEach((step, idx) => {
            const rect = step.getBoundingClientRect();
            const stepCenter = rect.top + rect.height / 2;
            const distance = Math.abs(viewportCenter - stepCenter);

            if (distance < minDistance) {
                minDistance = distance;
                bestIndex = idx;
            }
        });

        setActiveStep(bestIndex);
    }

    window.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll, { passive: true });
    // Run on init
    checkScroll();
}

