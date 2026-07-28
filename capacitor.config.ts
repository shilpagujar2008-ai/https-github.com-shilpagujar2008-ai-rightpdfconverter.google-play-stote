import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iims.rightpdfconverter',
  appName: 'RightPDF Converter',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Filesystem: {
      androidIsLegacyWithExternalStorage: false,
    },
  }
};

export default config;
