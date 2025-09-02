import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

/**
 * Interface for application settings.
 */
export interface Settings {
  url: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({ url: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const url = (await SecureStore.getItemAsync("url")) || "";
        setSettings({ url });
      } catch (e) {
        console.error("Failed to load settings.", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = useCallback(async (newSettings: Settings) => {
    try {
      await SecureStore.setItemAsync("url", newSettings.url);
      setSettings(newSettings);
    } catch (e) {
      console.error("Failed to save settings.", e);
      throw e;
    }
  }, []);

  return { settings, isLoading, saveSettings };
};
