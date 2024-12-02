import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // include: ['./__test__/**/*.test.[tj]s'],
    // exclude: [
    //   '**/node_modules/**',
    //   '**/dist/**',
    //   './playground/**/*.*',
    // ],
    // testTimeout: 20000,
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
    },
  },
  esbuild: {
    target: 'node20',
  },
  resolve: {
    alias: {
       "@":"/src"
    }
  }
})