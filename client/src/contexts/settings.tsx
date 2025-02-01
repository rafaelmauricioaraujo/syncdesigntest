import React, { createContext, useState } from 'react';
import type { Settings } from '@/types/settings';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { setSettings as setPersistedSettings } from '@/lib/settings/set-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';

export interface SettingsContextValue {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const defaultSettings: Settings = applyDefaultSettings(getPersistedSettings());

export const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  setSettings: () => {
    // noop
  },
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    setPersistedSettings(newSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings: updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}