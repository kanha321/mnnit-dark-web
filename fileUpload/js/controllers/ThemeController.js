/**
 * Controller for theme management (light/dark mode)
 */
export default class ThemeController {
  constructor() {
    this.themeToggleBtn = document.getElementById('theme-toggle');
    this.themeIcon = this.themeToggleBtn.querySelector('.material-symbols-outlined');
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Bind methods
    this.toggleTheme = this.toggleTheme.bind(this);
    
    // Add event listeners
    this.themeToggleBtn.addEventListener('click', this.toggleTheme);
  }
  
  /**
   * Initialize theme based on saved preference or system preference
   */
  initTheme() {
    // Check if theme is saved in localStorage
    if (this.currentTheme) {
      document.body.className = this.currentTheme;
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.className = 'dark';
        this.currentTheme = 'dark';
      } else {
        document.body.className = 'light';
        this.currentTheme = 'light';
      }
    }
    
    // Update icon based on current theme
    this.updateThemeIcon();
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    if (document.body.className === 'dark') {
      document.body.className = 'light';
      this.currentTheme = 'light';
    } else {
      document.body.className = 'dark';
      this.currentTheme = 'dark';
    }
    
    // Save theme preference
    localStorage.setItem('theme', this.currentTheme);
    
    // Update icon
    this.updateThemeIcon();
  }
  
  /**
   * Update the theme toggle icon based on current theme
   */
  updateThemeIcon() {
    if (this.currentTheme === 'dark') {
      this.themeIcon.textContent = 'light_mode';
    } else {
      this.themeIcon.textContent = 'dark_mode';
    }
  }
}
