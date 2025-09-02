import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSettings } from "@/hooks/useSettings";
import { downloadAllFiles, fetchFileList, NginxAutoIndexEntry } from "@/lib/nginxService";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import * as Progress from "react-native-progress";

export default function HomeScreen() {
  const { settings } = useSettings();
  const [isDownloading, setIsDownloading] = useState(false);

  const [downloadedCount, setDownloadedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const checkAndRequestPermissions = async () => {
    if (!permissionResponse?.granted) {
      const { status } = await requestPermission();
      if (status !== "granted") {
        Alert.alert("Permission required", "Media library permission is required to save files.");
        return false;
      }
    }
    return true;
  };

  const handleDownload = async () => {
    if (!settings.url) {
      Alert.alert("Error", "Please set a valid URL in settings.");
      return;
    }

    const hasPermission = await checkAndRequestPermissions();
    if (!hasPermission) return;

    try {
      const files = await fetchFileList(settings.url);
      if (files.length === 0) {
        Alert.alert("No files", "No files found to download.");
        return;
      }

      Alert.alert(`${files.length} files found. `, "Do you want to download them?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Download",
          onPress: () => startDownloadProcess(files),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch file list: " + error);
      return;
    }
  };

  const startDownloadProcess = async (files: NginxAutoIndexEntry[]) => {
    setIsDownloading(true);
    setTotalCount(files.length);

    try {
      await downloadAllFiles(files, settings.url, (prog) => setDownloadedCount(Math.round(prog * files.length)));
      Alert.alert("Success", `${files.length} files downloaded successfully.`);
    } catch (error) {
      Alert.alert("Error", "Failed to download files." + error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={<Image source={require("@/assets/images/party.jpg")} style={styles.reactLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Just Do It!!</ThemedText>
      </ThemedView>

      <View style={styles.contentContainer}>
        <Button
          title={isDownloading ? "Downloading..." : "Download"}
          onPress={handleDownload}
          disabled={isDownloading}
        />

        {isDownloading && (
          <View style={styles.progressContainer}>
            <ThemedText>
              Progress: {downloadedCount} / {totalCount}
            </ThemedText>
            <Progress.Bar progress={downloadedCount / totalCount} width={null} />
          </View>
        )}
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
  contentContainer: { padding: 16, gap: 16 },
  progressContainer: { marginTop: 20, gap: 8 },
  reactLogo: {
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    position: "absolute",
  },
});
