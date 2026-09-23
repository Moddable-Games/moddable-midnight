import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import wasm from "vite-plugin-wasm";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  // GitHub Pages serves the site from /moddable-midnight/; local dev uses /.
  base: process.env.VITE_BASE ?? "/",
  plugins: [
    react(),
    tailwindcss(),
    wasm(),
    nodePolyfills({
      include: ["buffer", "process", "util", "crypto", "stream"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@contract": path.resolve(
        __dirname,
        "../src/managed/tournament_pass/contract/index.js",
      ),
      "@crew": path.resolve(
        __dirname,
        "../src/managed/crew_treasury/contract/index.js",
      ),
    },
  },
  build: {
    rollupOptions: {
      // Two pages: the tournament pass (index) and the crew treasury check (treasury).
      input: {
        index: path.resolve(__dirname, "index.html"),
        treasury: path.resolve(__dirname, "treasury.html"),
      },
    },
    target: "esnext",
    minify: false,
  },
});
