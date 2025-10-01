import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';

  return {
    plugins: [
      react({
        // Enable React Fast Refresh in development
        fastRefresh: !isProduction,
        // Use SWC for faster builds in production
        jsxRuntime: 'automatic'
      })
    ],
    
    build: {
      // Generate source maps for debugging
      sourcemap: false,
      
      // Optimize chunk splitting
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor libraries
            vendor: ['react', 'react-dom', 'react-router-dom'],
            markdown: ['react-markdown', 'react-syntax-highlighter', 'remark-gfm', 'rehype-raw', 'rehype-highlight'],
            gemini: ['@google/generative-ai']
          },
          // Optimize chunk names
          chunkFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          entryFileNames: isProduction ? 'assets/js/[name]-[hash].js' : 'assets/js/[name].js',
          assetFileNames: isProduction ? 'assets/[ext]/[name]-[hash].[ext]' : 'assets/[ext]/[name].[ext]'
        }
      },
      
      // Optimize for modern browsers
      target: 'es2020',
      
      // Enable minification in production
      minify: isProduction ? 'esbuild' : false,
      
      // Reduce bundle size
      reportCompressedSize: false,
      
      // CSS code splitting
      cssCodeSplit: true,
      
      // Optimize asset handling
      assetsInlineLimit: 4096, // 4kb - inline smaller assets
      
      // Set chunk size warnings
      chunkSizeWarningLimit: 500
    },
    
    // Performance optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-markdown',
        'react-syntax-highlighter',
        '@google/generative-ai'
      ],
      // Pre-bundle these dependencies
      force: false
    },
    
    // Server configuration
    server: {
      // Enable HTTP/2 in development
      http2: false,
      
      // Proxy configuration
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    // Preview server configuration
    preview: {
      port: 4173,
      strictPort: true,
      open: true
    },
    
    // Enable experimental features
    experimental: {
      // Enable build optimizations
      renderBuiltUrl: false
    },
    
    // CSS configuration
    css: {
      // Enable CSS modules
      modules: false,
      
      // PostCSS configuration is handled by postcss.config.js
      postcss: undefined,
      
      // CSS preprocessing options
      preprocessorOptions: {}
    },
    
    // Enable esbuild optimizations
    esbuild: {
      // Remove console.log in production
      drop: isProduction ? ['console', 'debugger'] : [],
      // JSX optimization - don't inject React import since we're using automatic runtime
      jsxInject: undefined
    }
  };
});
