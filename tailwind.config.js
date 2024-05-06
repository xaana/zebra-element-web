/** @type {import('tailwindcss').Config} */
module.exports = {
    // corePlugins: {
    //     preflight: false,
    // },
    // prefix: "zexa-",
    // darkMode: ["class", '[class="cpd-theme-dark"]'],
    darkMode: ["selector", ".cpd-theme-dark"],
    // darkMode: ["selector", '[class="cpd-theme-dark"]'],
    content: ["./src/**/*.{html,ts,tsx}", "./node_modules/matrix-react-sdk/src/**/*.{html,ts,tsx}"],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                // background: "var(--cpd-color-bg-canvas-default)",
                foreground: "hsl(var(--foreground))",
                // foreground: "var(--cpd-color-text-primary)",
                primary: {
                    // DEFAULT: "var(--cpd-color-zebra-900)",
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    1400: "var(--cpd-color-zebra-1400)",
                    1300: "var(--cpd-color-zebra-1300)",
                    1200: "var(--cpd-color-zebra-1200)",
                    1100: "var(--cpd-color-zebra-1100)",
                    1000: "var(--cpd-color-zebra-1000)",
                    900: "var(--cpd-color-zebra-900)",
                    800: "var(--cpd-color-zebra-800)",
                    700: "var(--cpd-color-zebra-700)",
                    600: "var(--cpd-color-zebra-600)",
                    500: "var(--cpd-color-zebra-500)",
                    400: "var(--cpd-color-zebra-400)",
                    300: "var(--cpd-color-zebra-300)",
                    200: "var(--cpd-color-zebra-200)",
                    100: "var(--cpd-color-zebra-100)",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    // foreground: "var(--cpd-color-text-secondary)",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    // DEFAULT: "var(--cpd-color-zebra-700)",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: 0 },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: 0 },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
