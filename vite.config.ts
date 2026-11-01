/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// A relative base ('./') lets the same build run from a GitHub Pages project
// sub-path (https://<user>.github.io/<repo>/), from the domain root, and later
// from inside a Capacitor iOS shell. Routing uses hash URLs, so no server
// rewrites are needed. Override with BASE_PATH if you ever need an absolute base.
export default defineConfig({
  base: process.env.BASE_PATH ?? './',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
