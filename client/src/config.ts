import type { ColorScheme, PrimaryColor } from '@/styles/theme/types';

export interface Config {
  site: {
    name: string;
    description: string;
    colorScheme: ColorScheme;
    primaryColor: PrimaryColor;
    themeColor: string;
    url: string;
    version: string;
  };
}

export const config = {
  site: {
    name: 'Sync Design Technologies: Technical Test',
    description: '',
    colorScheme: 'light',
    themeColor: '#090a0b',
    primaryColor: 'neonBlue',
    url: '',
    version: '0.0.0',
  },
} satisfies Config;
