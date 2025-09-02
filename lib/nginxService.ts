import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export interface NginxAutoIndexEntry {
  name: string;
  type: "file" | "directory";
  mtime: string; // ISO 8601
  size?: number; // If type is "file" then size is present
}

type NginxAutoIndex = NginxAutoIndexEntry[];

/**
 * Get file list from Nginx autoindex page.
 * @param baseUrl The URL of the target Nginx server.
 * @returns A promise that resolves to the file list.
 */
export const fetchFileList = async (baseUrl: string): Promise<NginxAutoIndex> => {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const data: NginxAutoIndex = await response.json();
    // Filter out directories, only return files
    return data.filter((entry) => entry.type === "file");
  } catch (error) {
    console.error("Failed to fetch file list:", error);
    throw error;
  }
};

export const downloadAllFiles = async (
  files: NginxAutoIndex,
  baseUrl: string,
  onProgress: (progress: number) => void,
  concurrency: number = 10
): Promise<void> => {
  const totalFiles = files.length;
  let downloadedCount = 0;

  const downloadAndSave = async (file: NginxAutoIndexEntry) => {
    const fileUrl = `${baseUrl.endsWith("/") ? baseUrl : baseUrl + "/"}${file.name}`;
    const tempUri = FileSystem.documentDirectory + encodeURIComponent(file.name);

    const downloadResult = await FileSystem.downloadAsync(fileUrl, tempUri);
    await MediaLibrary.createAssetAsync(downloadResult.uri);

    // Delete temp file
    await FileSystem.deleteAsync(downloadResult.uri, { idempotent: true });
    downloadedCount++;
    onProgress(downloadedCount / totalFiles);
  };

  const queue = [...files]; // Queue of files to download
  const executing: Promise<void>[] = []; // Array of executing promises

  while (queue.length > 0 || executing.length > 0) {
    // Start new tasks if we have capacity
    while (executing.length < concurrency && queue.length > 0) {
      const fileToDownload = queue.shift()!;
      const promise = downloadAndSave(fileToDownload).then(() => {
        const index = executing.indexOf(promise);
        if (index > -1) {
          executing.splice(index, 1);
        }
      });
      executing.push(promise);
    }
    if (executing.length > 0) {
      await Promise.race(executing);
    }
  }

  console.log("All files have been downloaded.");
};
