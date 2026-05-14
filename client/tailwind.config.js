/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    light: '#F4C430',
                    DEFAULT: '#D4AF37',
                    dark: '#AA8C2C',
                },
                dark: {
                    DEFAULT: '#0a0a0a',
                    surface: '#121212',
                    border: '#2a2a2a',
                }
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
