import licenses from "@/app/licenses.json";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

export default function LicensesScreen() {
  // 画像は2つしかないので手動で追加
  const imageLicenses = [
    {
      title: "Party",
      author: "Zepfanman.com",
      url: "https://www.flickr.com/photos/zepfanman/2900506465",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/deed.en",
    },
    {
      title: "Thanksgiving Party 2013",
      author: "reggaefiesta1",
      url: "https://www.flickr.com/photos/8495340@N02/9197217136",
      license: "CC BY-SA 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/deed.en",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          title: "Licenses",
          presentation: "modal",
        }}
      />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          {/* 画像ライセンスの表示 */}
          {imageLicenses.map((item, index) => (
            <ThemedView key={index} style={styles.licenseItem}>
              <ThemedText type="subtitle">{item.title}</ThemedText>
              <ThemedText style={styles.copyrightText}>{`by ${item.author}`}</ThemedText>
              <ThemedText style={styles.copyrightText}>{item.url}</ThemedText>
              <ThemedText style={styles.licenseBody}>{item.license}</ThemedText>
              <ThemedText style={styles.licenseBody}>{item.licenseUrl}</ThemedText>
            </ThemedView>
          ))}

          {/* その他のライセンスの表示 */}
          {Object.keys(licenses).map((key) => {
            const item = licenses[key as keyof typeof licenses];
            const license = "licenses" in item ? item.licenses : "";
            const licenseText = "licenseText" in item ? item.licenseText : "No License Text Available";
            const copyright = "copyright" in item ? item.copyright : "";

            return (
              <ThemedView key={key} style={styles.licenseItem}>
                <ThemedText type="subtitle">{key}</ThemedText>
                {license ? <ThemedText style={styles.copyrightText}>{license}</ThemedText> : null}
                {copyright ? <ThemedText style={styles.copyrightText}>{copyright}</ThemedText> : null}
                <ThemedText style={styles.licenseBody}>{licenseText}</ThemedText>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  licenseItem: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  copyrightText: {
    fontSize: 12,
    color: "#888",
  },
  licenseBody: {
    fontSize: 13,
    lineHeight: 18,
  },
});
