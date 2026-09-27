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
      // The token contracts, read live on the Tokens page.
      "@native-unshielded": path.resolve(__dirname, "../src/managed/native_unshielded/contract/index.js"),
      "@native-shielded": path.resolve(__dirname, "../src/managed/native_shielded/contract/index.js"),
      "@contract-token": path.resolve(__dirname, "../src/managed/contract_token/contract/index.js"),
      "@private-ledger": path.resolve(__dirname, "../src/managed/private_ledger/contract/index.js"),
      "@crew-v3": path.resolve(__dirname, "../src/managed/crew_treasury_v3/contract/index.js"),
    },
  },
  build: {
    rollupOptions: {
      // The React pages: home, the crew treasury check, the token types, the history, and
      // chapter one's tournament pass. The crew page (city.html) is static, in public/.
      input: {
        index: path.resolve(__dirname, "index.html"),
        treasury: path.resolve(__dirname, "treasury.html"),
        wallet: path.resolve(__dirname, "wallet.html"),
        history: path.resolve(__dirname, "history.html"),
        tournament: path.resolve(__dirname, "tournament.html"),
        tokens: path.resolve(__dirname, "tokens.html"),
        // A standalone concept page, linked from nowhere (noindex).
        armada: path.resolve(__dirname, "armada.html"),
      },
    },
    target: "esnext",
    minify: false,
  },
});
