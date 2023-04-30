import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function CustomHmr() {
  return {
    name: 'custom-hmr',
    enforce: 'post',
    // HMR
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.adoc')) {
        server.ws.send({
          type: 'custom',
          event: 'asciidoc-update',
          path: '*'
        })
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), CustomHmr()],
})
