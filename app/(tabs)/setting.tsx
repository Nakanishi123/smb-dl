import { Settings, useSettings } from "@/hooks/useSettings";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, TextInput, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SettingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { settings: savedSettings, isLoading, saveSettings } = useSettings();
  const [formState, setFormState] = useState<Settings>({ url: "" });

  useEffect(() => {
    if (!isLoading) {
      setFormState(savedSettings);
    }
  }, [isLoading, savedSettings]);

  const handleInputChange = (field: keyof Settings, value: string) => {
    setFormState((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await saveSettings(formState);
      Alert.alert("Save Successful", "Settings have been saved.");
    } catch (e) {
      Alert.alert("Error", "Failed to save settings: " + e);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Image source={require("@/assets/images/Thanksgiving Party 2013.jpg")} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <View style={styles.formContainer}>
        <ThemedText style={styles.label}>URL</ThemedText>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          value={formState.url}
          onChangeText={(value) => handleInputChange("url", value)}
          placeholder="https://example.com"
          placeholderTextColor="#888"
          autoCapitalize="none"
        />

        <Button title="Save Settings" onPress={handleSave} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  formContainer: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
});
