import { Image } from "expo-image";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function SettingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // To keep the form input values
  const [smbUrl, setSmbUrl] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    console.log("Saved data:", { smbUrl, name, password });
    Alert.alert("Saved", `URL: ${smbUrl}`);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Image source={require("@/assets/images/Thanksgiving Party 2013.jpg")} style={styles.reactLogo} />}
    >
      <View style={styles.formContainer}>
        <ThemedText style={styles.label}>SMB URL</ThemedText>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          value={smbUrl}
          onChangeText={setSmbUrl}
          placeholder="smb://server/share"
          placeholderTextColor="#888"
          autoCapitalize="none"
        />

        <ThemedText style={styles.label}>ユーザー名</ThemedText>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          value={name}
          onChangeText={setName}
          placeholder="username"
          placeholderTextColor="#888"
          autoCapitalize="none"
        />

        <ThemedText style={styles.label}>パスワード</ThemedText>
        <TextInput
          style={[styles.input, { color: colors.text, borderColor: colors.icon }]}
          value={password}
          onChangeText={setPassword}
          placeholder="password"
          placeholderTextColor="#888"
          secureTextEntry
          autoCapitalize="none"
        />

        <Button title="保存" onPress={handleSave} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
});
