import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    mkcert({
      savePath: './certs', // save the generated certificate into certs directory
      force: true // force generation of certs even without setting https property in the vite config
    })
  ],
  server: {
    https: {
      cert: './certs/cert.pem',
      key: './certs/dev.pem'
    },
		proxy: {}
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}']
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
})
