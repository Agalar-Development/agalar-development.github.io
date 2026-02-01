/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#137fec",
                "background-light": "#f6f7f8",
                "background-dark": "#0f1115", // Deep charcoal/black per request
                "surface-dark": "#161b22",
                "border-dark": "#30363d",
                "code-keyword": "#ff7b72", // Red/Pinkish for keywords
                "code-class": "#d2a8ff", // Purple for classes
                "code-method": "#79c0ff", // Blue for methods
                "code-string": "#a5d6ff", // Light blue for strings/constants
                "code-comment": "#8b949e", // Gray for comments
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"],
                "mono": ["JetBrains Mono", "monospace"],
            },
            backgroundImage: {
                'glow-gradient': 'radial-gradient(circle at center, rgba(19, 127, 236, 0.15) 0%, rgba(10, 10, 11, 0) 60%)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
