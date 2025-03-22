/**
 * Font preloader to ensure fonts display correctly
 */

function preloadFonts() {
    // Create a hidden element to preload the fonts
    const preloader = document.createElement('div');
    preloader.style.opacity = '0';
    preloader.style.position = 'absolute';
    preloader.style.pointerEvents = 'none';
    
    // Create spans for each font
    const nerdFontPreloader = document.createElement('span');
    nerdFontPreloader.style.fontFamily = 'Symbols Nerd Font, monospace';
    nerdFontPreloader.textContent = '\uf15b\uf15c\uf121\uf019\uf0c5'; // Various icons
    
    const cookieRunPreloader = document.createElement('span');
    cookieRunPreloader.style.fontFamily = 'CookieRun, sans-serif';
    cookieRunPreloader.textContent = 'CookieRun Font Preload';
    
    const cookieRunBoldPreloader = document.createElement('span');
    cookieRunBoldPreloader.style.fontFamily = 'CookieRun, sans-serif';
    cookieRunBoldPreloader.style.fontWeight = 'bold';
    cookieRunBoldPreloader.textContent = 'CookieRun Bold Font Preload';
    
    const cookieRunBlackPreloader = document.createElement('span');
    cookieRunBlackPreloader.style.fontFamily = 'CookieRun, sans-serif';
    cookieRunBlackPreloader.style.fontWeight = '900';
    cookieRunBlackPreloader.textContent = 'CookieRun Black Font Preload';
    
    // Add JetBrains Mono preloaders
    const jetbrainsMonoPreloader = document.createElement('span');
    jetbrainsMonoPreloader.style.fontFamily = 'JetBrains Mono, monospace';
    jetbrainsMonoPreloader.textContent = 'JetBrains Mono Font Preload';
    
    const jetbrainsMonoBoldPreloader = document.createElement('span');
    jetbrainsMonoBoldPreloader.style.fontFamily = 'JetBrains Mono, monospace';
    jetbrainsMonoBoldPreloader.style.fontWeight = 'bold';
    jetbrainsMonoBoldPreloader.textContent = 'JetBrains Mono Bold Font Preload';
    
    // Append spans to preloader
    preloader.appendChild(nerdFontPreloader);
    preloader.appendChild(cookieRunPreloader);
    preloader.appendChild(cookieRunBoldPreloader);
    preloader.appendChild(cookieRunBlackPreloader);
    preloader.appendChild(jetbrainsMonoPreloader);
    preloader.appendChild(jetbrainsMonoBoldPreloader);
    document.body.appendChild(preloader);
    
    // Wait for fonts to load
    document.fonts.ready.then(() => {
        console.log('All fonts loaded successfully');
        document.body.classList.add('fonts-loaded');
        
        // Force font application with a slight delay
        setTimeout(() => {
            document.body.style.fontFamily = 'CookieRun, Arial, sans-serif';
            document.body.classList.add('fonts-applied');
        }, 200);
        
        // Remove preloader after a delay
        setTimeout(() => {
            document.body.removeChild(preloader);
        }, 1000);
    }).catch(err => {
        console.error('Error loading fonts:', err);
    });
}

export default {
    preloadFonts
};
