import type { Config } from 'tailwindcss';
import preset from '@nakshatra/config/tailwind-preset';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [preset],
  darkMode: 'class',
};

export default config;
