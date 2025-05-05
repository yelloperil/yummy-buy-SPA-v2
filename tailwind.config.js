tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#5D5CDE',
                secondary: '#A5A4FF',
            },
            fontFamily: {
                roboto: ['Roboto', 'sans-serif'],
                lora: ['Lora', 'serif'],
                dmMono: ['DM Mono', 'monospace'],
                zenMaru: ['"Zen Maru Gothic"', 'sans-serif'],
                zenMincho: ['Zen Old Mincho', 'serif'],
                'ibm-plex-sans-jp': ['IBM Plex Sans JP', 'sans-serif'],
                iansui: ['Iansui', 'sans-serif'],
                'klee-one': ['Klee One', 'cursive'],
                'dela-gothic-one': ['Dela Gothic One', 'sans-serif'],
                'yusei-magic': ['Yusei Magic', 'sans-serif'],
                'noto-sans-sc': ['Noto Sans SC', 'sans-serif'],
                'zen-kaku-gothic-antique': ['Zen Kaku Gothic Antique', 'sans-serif'],
                'noto-sans-jp': ['Noto Sans JP', 'sans-serif'],
                dotgothic16: ['DotGothic16', 'sans-serif'],
                'noto-sans-tc': ['Noto Sans TC', 'sans-serif'],
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { filter: 'drop-shadow(0 0 10px rgba(173, 216, 230, 0.7))' },
                    '50%': { filter: 'drop-shadow(0 0 15px rgba(173, 216, 230, 0.9))' },
                }
            },
            animation: {
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
            },
            display: ['responsive'],
            flexDirection: ['responsive'],
            screens: {
                'narrow': '380px',
                'mobile': '450px',
                'tablet': '960px',
                'desktop': '1080px',
                'desktop-lg': '1440px',
            },
            boxSizing: {
                'content': 'content-box',
                'border': 'border-box', // This is the default, you can keep it for clarity
            },  
        },
    },
    variants: {
        extend: {
            display: ['responsive'],
            flexDirection: ['responsive']
        }
    }
};

// Check for dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    document.documentElement.classList.toggle('dark', event.matches);
});