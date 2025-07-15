import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'cffcdcb2-ad59-4cc8-a231-e420538824a3-00-11fxx6dmcd4sc.janeway.replit.dev'
    ]
  }
});