import type { Config } from 'tailwindcss';
import preset from '@nakshatra/config/tailwind-preset';
import nativewind from 'nativewind/preset';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [preset, nativewind],
  theme: {
    extend: {},
  },
};

export default config;
