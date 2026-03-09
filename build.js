import { build } from 'vite';

async function buildApp() {
  try {
    await build({
      root: process.cwd(),
      base: '/',
      build: {
        outDir: 'dist',
        emptyOutDir: true
      }
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();
