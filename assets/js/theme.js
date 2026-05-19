(function () {
    const KEY = 'theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    function getStoredTheme() {
        const value = localStorage.getItem(KEY);
        if (value === DARK || value === LIGHT) return value;
        localStorage.setItem(KEY, DARK);
        return DARK;
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        root.dataset.theme = theme;
        root.classList.toggle(DARK, theme === DARK);
        root.style.colorScheme = theme;

        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === DARK ? '#0b0f13' : '#1a2332');

        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.setAttribute('data-theme', theme);
            btn.setAttribute('aria-pressed', (theme === DARK).toString());
            ;
        }
    }

    function toggleTheme() {
        const next = getStoredTheme() === DARK ? LIGHT : DARK;
        localStorage.setItem(KEY, next);
        applyTheme(next);
    }

    function createToggle() {
        if (document.getElementById('theme-toggle')) return;
        const btn = document.createElement('button');
        btn.id = 'theme-toggle';
        btn.type = 'button';
        btn.title = 'Toggle dark and light mode';
        btn.setAttribute('aria-label', 'Toggle theme');
        btn.innerHTML = '<span class="theme-toggle-icon theme-toggle-icon-sun" aria-hidden="true">☀</span><span class="theme-toggle-track" aria-hidden="true"><span class="theme-toggle-thumb"></span></span><span class="theme-toggle-icon theme-toggle-icon-moon" aria-hidden="true">☾</span>';
        btn.addEventListener('click', toggleTheme);
        document.body.appendChild(btn);
    }

    function init() {
        const theme = getStoredTheme();
        applyTheme(theme);
        createToggle();
        applyTheme(theme);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
