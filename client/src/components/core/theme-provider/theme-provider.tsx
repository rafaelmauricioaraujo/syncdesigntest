import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';
import { SettingsContext } from '@/contexts/settings';
import { createTheme } from '@/styles/theme/create-theme';
import { Rtl } from './rtl';

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings } = React.useContext(SettingsContext);
  const [theme, setTheme] = React.useState(createTheme({
    primaryColor: settings.primaryColor,
    colorScheme: settings.colorScheme,
    direction: settings.direction,
  }));

  React.useEffect(() => {
    const updatedTheme = createTheme({
      primaryColor: settings.primaryColor,
      colorScheme: settings.colorScheme,
      direction: settings.direction,
    });
  
    setTheme(updatedTheme);
  }, [settings.primaryColor, settings.colorScheme, settings.direction]);

  return (
    <CssVarsProvider defaultColorScheme={settings.colorScheme} defaultMode={settings.colorScheme} theme={theme}>
      <Helmet>
        <meta content={settings.colorScheme} name="color-scheme" />
      </Helmet>
      <CssBaseline />
      <Rtl direction={settings.direction}>{children}</Rtl>
    </CssVarsProvider>
  );
};