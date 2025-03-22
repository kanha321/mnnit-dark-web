/**
 * Font debugging utilities
 * Can be temporarily added to verify font loading
 */

function checkFontLoading() {
    // Wait for document to be fully loaded
    window.addEventListener('load', () => {
        // Check if fonts are loaded
        document.fonts.ready.then(() => {
            const isCookieRunLoaded = document.fonts.check('1em "CookieRun"');
            const isCookieRunBoldLoaded = document.fonts.check('bold 1em "CookieRun"');
            const isCookieRunBlackLoaded = document.fonts.check('900 1em "CookieRun"');
            const isJetBrainsMonoLoaded = document.fonts.check('1em "JetBrains Mono"');
            const isJetBrainsBoldLoaded = document.fonts.check('bold 1em "JetBrains Mono"');
            
            console.log('CookieRun font loaded:', isCookieRunLoaded);
            console.log('CookieRun Bold font loaded:', isCookieRunBoldLoaded);
            console.log('CookieRun Black font loaded:', isCookieRunBlackLoaded);
            console.log('JetBrains Mono font loaded:', isJetBrainsMonoLoaded);
            console.log('JetBrains Mono Bold font loaded:', isJetBrainsBoldLoaded);
            
            // Display font info on page for debugging
            const debugInfo = document.createElement('div');
            debugInfo.style.position = 'fixed';
            debugInfo.style.bottom = '10px';
            debugInfo.style.right = '10px';
            debugInfo.style.background = 'rgba(0,0,0,0.7)';
            debugInfo.style.color = 'white';
            debugInfo.style.padding = '10px';
            debugInfo.style.borderRadius = '5px';
            debugInfo.style.fontSize = '12px';
            debugInfo.style.zIndex = '9999';
            debugInfo.style.fontFamily = 'Arial, sans-serif'; // Use default font for debugging
            
            debugInfo.innerHTML = `
                <p>CookieRun: ${isCookieRunLoaded ? '✅' : '❌'}</p>
                <p>CookieRun Bold: ${isCookieRunBoldLoaded ? '✅' : '❌'}</p>
                <p>CookieRun Black: ${isCookieRunBlackLoaded ? '✅' : '❌'}</p>
                <p>JetBrains Mono: ${isJetBrainsMonoLoaded ? '✅' : '❌'}</p>
                <p>JetBrains Mono Bold: ${isJetBrainsBoldLoaded ? '✅' : '❌'}</p>
                <p>Current body font: ${getComputedStyle(document.body).fontFamily}</p>
                <button id="force-font">Force Apply Font</button>
            `;
            
            document.body.appendChild(debugInfo);
            
            // Add button to force apply font
            document.getElementById('force-font').addEventListener('click', () => {
                document.body.style.fontFamily = 'CookieRun, Arial, sans-serif';
                alert('Font forced to CookieRun');
            });
            
            // Remove after 30 seconds
            setTimeout(() => {
                try {
                    document.body.removeChild(debugInfo);
                } catch (e) {
                    // Element might have been removed already
                }
            }, 30000);
        });
    });
}

export default {
    checkFontLoading
};
