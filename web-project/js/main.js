// main.js - Core functionality for ESMOTECH website

document.addEventListener('DOMContentLoaded', () => {
    console.log('ESMOTECH Platform Loaded');
    initNumberTicker();
    initAceternityGridSpotlight();
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
