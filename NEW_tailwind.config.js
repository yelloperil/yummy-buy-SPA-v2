// /** @type {import('tailwindcss').Config} */
tailwind.config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'], // Added content to ensure JIT processes files
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
        },
        'toast-show': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'toast-show': 'toast-show 0.3s ease',
      },
      screens: {
        mobile: '380px',
        desktop: '450px',
        tablet: '960px',
        'desktop-lg': '1080px',
        'desktop-xl': '1440px', // Fixed typo
      },
      width: {
        'clamp-nav': 'clamp(25vw, 30vw, 35vw)',
        'clamp-header-desktop': 'clamp(300px, 100vw, 1200px)',
        'clamp-header-mobile': 'clamp(300px, 100vw, 1200px)',
        'clamp-brand-text': 'clamp(240px, 50vw, 75vw)',
      },
      height: {
        'clamp-header-desktop': 'clamp(400px, 25vh, 600px)', // Fixed invalid clamp
        'clamp-header-mobile': 'clamp(250px, 20vh, 25vh)',
        'clamp-footer': 'clamp(80px, 5vh, 10vh)',
        'clamp-logo-desktop': 'clamp(250px, 15vh, 325px)',
        'clamp-logo-mobile': 'clamp(150px, 17vh, 22vh)',
        'clamp-brand-text': 'clamp(80px, 10vh, 15vh)',
      },
      textDecoration: {
        none: 'none',
      },
    },
  },
  variants: {
    extend: {
      display: ['responsive'],
      flexDirection: ['responsive'],
    },
  },
  plugins: [
    function ({ addBase, addComponents }) {
      // Base styles for pseudo-elements
      addBase({
        '::-webkit-scrollbar': {
          width: '8px',
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#888',
          borderRadius: '4px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#555',
        },
        '.scrollbar-hide-scrollbar::-webkit-scrollbar-thumb': {
          background: 'transparent',
        },
        '.scrollbar-hide-scrollbar:hover::-webkit-scrollbar-thumb': {
          background: '#888',
        },
      });

      // Component styles
      addComponents({
        // Order card hover
        '.order-card': {
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          },
        },
        // Tab active
        '.tab-active': {
          borderBottom: '3px solid #5D5CDE',
          fontWeight: '600',
        },
        // Toast
        '.toast': {
          transition: 'all 0.3s ease',
          opacity: 0,
          transform: 'translateY(20px)',
          '&.show': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        // Product carousel
        '.product-carousel': {
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .swiper, & .swiper-wrapper, & .swiper-slide': {
            width: '100%',
            height: '100%',
          },
          '& img': {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          },
          '& .swiper-button-next, & .swiper-button-prev': {
            color: 'white',
            background: 'rgba(0, 0, 0, 0.3)',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            '--swiper-navigation-size': '18px',
            '&:hover': {
              background: 'rgba(0, 0, 0, 0.5)',
            },
          },
          '& .swiper-pagination': {
            bottom: '5px',
          },
        },
        // Gallery modal
        '.gallery-modal': {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 50,
          display: 'none',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'opacity 0.3s ease',
          '&.active': {
            display: 'flex',
          },
        },
        // Swiper customization
        '.swiper-pagination-bullet': {
          background: '#5D5CDE',
          opacity: 0.7,
        },
        '.swiper-pagination-bullet-active': {
          background: '#A5A4FF',
          opacity: 1,
        },
        // Image count
        '.image-count': {
          zIndex: 10,
        },
        // Modal image container
        '.modal-img-container': {
          maxWidth: '90vw',
          maxHeight: '90vh',
          '& img': {
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
          },
        },
        // Verification code input
        '.verification-code-input': {
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          caretColor: '#5D5CDE',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:focus': {
            borderColor: '#5D5CDE',
            boxShadow: '0 0 0 3px rgba(93, 92, 222, 0.2)',
          },
          '@media (max-width: 640px)': {
            width: '2.5rem',
            height: '2.5rem',
            fontSize: '1.25rem',
          },
        },
      });
    },
  ],
};

// Check for dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  document.documentElement.classList.toggle('dark', event.matches);
});