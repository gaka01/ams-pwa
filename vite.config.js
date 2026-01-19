import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'prompt',
    injectRegister: false,

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Времето Велико Търново',
      short_name: 'Времето ВТ',
      description: 'vt-weather',
      theme_color: '#111111',
      icons: [
        {
          src: "logo.png",
          sizes: "512x512",
          type: "image/png"
        },
        {
          src: "logo-256.png",
          sizes: "256x256",
          type: "image/png"
        },
        {
          src: "logo-128.png",
          sizes: "128x128",
          type: "image/png"
        },
        {
          src: "logo-64.png",
          sizes: "64x64",
          type: "image/png"
        },
      ],
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})