// src/vite.config.ts
export default defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('src/Admin')) {
              return 'admin';
            }
            if (id.includes('src/Users')) {
              return 'users';
            }
            if (id.includes('src/Store')) {
              return 'store';
            }
          }
        }
      }
    }
  });

function defineConfig(arg0: { build: { rollupOptions: { output: { manualChunks(id: any): "vendor" | "admin" | "users" | "store" | undefined; }; }; }; }) {
    throw new Error("Function not implemented.");
}
