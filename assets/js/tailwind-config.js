/* Shared Tailwind config — loaded right after the Tailwind CDN script on every page.
   Change brand colours here once and every page updates. */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: '#0B2E6B',     // logo, headings
        medical: '#1E88E5',  // primary buttons, links
        cyan: '#29B6F6',     // highlights, icons
        ice: '#EAF6FD',      // soft section backgrounds
        slate: { DEFAULT: '#475569' }, // body text
        whatsapp: '#25D366', // WhatsApp buttons only
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,46,107,.04), 0 8px 24px -12px rgba(11,46,107,.10)',
        lift: '0 2px 4px rgba(11,46,107,.05), 0 20px 40px -16px rgba(11,46,107,.18)',
      },
    },
  },
};
