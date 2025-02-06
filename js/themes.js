// Theme management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
        updateThemeIcon(savedTheme === 'dark');
    } else {
        const systemPrefersDark = prefersDarkScheme.matches;
        if (systemPrefersDark) {
            document.body.dataset.theme = 'dark';
            updateThemeIcon(true);
        }
    }

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.dataset.theme === 'dark';
        document.body.dataset.theme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        updateThemeIcon(!isDark);

        // Animate the toggle button
        themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 200);
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.body.dataset.theme = e.matches ? 'dark' : 'light';
            updateThemeIcon(e.matches);
        }
    });
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    if (isDark) {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// Initialize theme after header loads
function waitForHeader() {
    const headerObserver = new MutationObserver((mutations, observer) => {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            observer.disconnect();
            initializeTheme();
        }
    });

    headerObserver.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Add transition class and start header observer after page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('theme-transition');
    }, 100);
    waitForHeader();
});

// Apply saved theme immediately to prevent flash
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.dataset.theme = savedTheme;
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.dataset.theme = 'dark';
}
