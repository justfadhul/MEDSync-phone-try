/** @type {import('tailwindcss').Config} */
// Gate 0.1: minimal config so NativeWind compiles. Gate 0.2 replaces this with
// the SAME preset generated from @medsync/tokens that web consumes (single
// source of truth), so web and mobile resolve identical semantic tokens.
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
