// Theme Management System
class ThemeManager {
    constructor() {
      this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
      this.applyTheme(this.currentTheme);
      this.initializeToggle();
    }
  
    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  
    getStoredTheme() {
      return localStorage.getItem('theme');
    }
  
    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.currentTheme = theme;
      this.updateToggleUI();
    }
  
    initializeToggle() {
      const toggles = document.querySelectorAll('.theme-toggle-option');
      toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          const btn = e.currentTarget;
          const newTheme = btn.dataset.theme;
          this.applyTheme(newTheme);
        });
      });
    }
  
    updateToggleUI() {
      const options = document.querySelectorAll('.theme-toggle-option');
      options.forEach(option => {
        if (option.dataset.theme === this.currentTheme) {
          option.classList.add('active');
          option.setAttribute('aria-checked', 'true');
        } else {
          option.classList.remove('active');
          option.setAttribute('aria-checked', 'false');
        }
      });
    }
  }
  
  // Initialize theme management
  document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
  });
