import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: 'localhost',
    port: 7777,
    cors: {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 200
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // notepad: resolve(__dirname, 'src', 'notepad', 'index.html'), 
        // fractiles: resolve(__dirname, 'src', 'fractiles', 'index.html'),  //todo
        // credits: resolve(__dirname, 'src', 'credits', 'index.html'),
      }
    }
  }


})




/*





import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: '../public',
  root: resolve(__dirname, 'src'),  //necessary for true Vite Multi-Page to work
  assetsInclude: ['./assets/*'],
  plugins: [react()],
    server: {
    host: 'localhost',
    port: 7777,
    cors: {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    },
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src', 'index.html'),
        notepad: resolve(__dirname, 'src', 'notepad', 'index.html'),
        about: resolve(__dirname, 'src', 'about', 'index.html'),
        fractiles: resolve(__dirname, 'src', 'fractiles', 'index.html'),
        credits: resolve(__dirname, 'src', 'credits', 'index.html'),
      }
    }
  }
})

*/

