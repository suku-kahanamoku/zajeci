export type UploadStatus = "pending" | "uploading" | "uploaded" | "error";

export interface UploadedFileItem {
  file: File;
  path: string;
  progress: number;
  status: UploadStatus;
  error?: string;
}

interface UploadResponseShape {
  success?: boolean;
  data?: {
    path?: string;
  };
}

function parseUploadResponse(raw: string): string {
  let parsed: UploadResponseShape;

  try {
    parsed = JSON.parse(raw) as UploadResponseShape;
  } catch {
    throw new Error("Neplatna odpoved upload endpointu");
  }

  const path = parsed?.data?.path;
  if (!path) {
    throw new Error("Upload nevratil temp path");
  }

  return path;
}

async function uploadToTemp(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  return await new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.max(1, Math.round((event.loaded / event.total) * 95)));
    });

    xhr.upload.addEventListener("loadend", () => {
      onProgress?.(95);
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(parseUploadResponse(xhr.responseText || "{}"));
        } catch (error: any) {
          reject(error);
        }
      } else {
        reject(new Error(`Upload selhal (${xhr.status})`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload selhal")));
    xhr.addEventListener("abort", () =>
      reject(new Error("Upload byl prerusen")),
    );

    xhr.open("POST", "/api/files/upload");
    xhr.send(formData);
  });
}

export function useFileUpload() {
  const uploadedFiles = ref<UploadedFileItem[]>([]);
  const files = reactive<File[]>([]);

  const tempPaths = computed<string[]>(() => {
    return uploadedFiles.value
      .filter((file) => file.status === "uploaded" && !!file.path)
      .map((file) => file.path);
  });

  const addFiles = async (inputFiles: File[]) => {
    for (const file of inputFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    const uploadedFile: UploadedFileItem = {
      file,
      path: "",
      progress: 0,
      status: "pending",
      error: undefined,
    };

    uploadedFiles.value.push(uploadedFile);
    const fileIndex = uploadedFiles.value.length - 1;

    try {
      await uploadProcess(fileIndex, file);
    } catch (error: any) {
      uploadedFile.status = "error";
      uploadedFile.error = error?.message || "Upload selhal";
      uploadedFile.progress = 0;
    }
  };

  const uploadProcess = async (fileIndex: number, file: File) => {
    const uploadedFile = uploadedFiles.value[fileIndex];
    if (!uploadedFile) return;

    try {
      uploadedFile.status = "uploading";
      uploadedFile.progress = 1;

      const path = await uploadToTemp(file, (progress) => {
        uploadedFile.progress = progress;
      });

      uploadedFile.path = path;
      uploadedFile.progress = 100;
      uploadedFile.status = "uploaded";
    } catch (error: any) {
      uploadedFile.status = "error";
      uploadedFile.error = error?.message || "Upload selhal";
      uploadedFile.progress = 0;
      throw error;
    }
  };

  const removeUploadedFile = (index: number) => {
    const removed = uploadedFiles.value[index];
    if (!removed) return;

    const rawFileIndex = files.findIndex(
      (file) =>
        file.name === removed.file.name &&
        file.size === removed.file.size &&
        file.lastModified === removed.file.lastModified,
    );

    if (rawFileIndex !== -1) {
      files.splice(rawFileIndex, 1);
    }

    uploadedFiles.value.splice(index, 1);
  };

  const clearUploadedFiles = () => {
    uploadedFiles.value = [];
    files.splice(0, files.length);
  };

  watch(
    files,
    async (newFiles) => {
      const uploadedNames = new Set(
        uploadedFiles.value.map(
          (file) =>
            `${file.file.name}|${file.file.size}|${file.file.lastModified}`,
        ),
      );

      const toUpload = newFiles.filter((file) => {
        const key = `${file.name}|${file.size}|${file.lastModified}`;
        return !uploadedNames.has(key);
      });

      if (toUpload.length) {
        await addFiles(toUpload as File[]);
      }
    },
    { deep: true },
  );

  return {
    uploadedFiles,
    files,
    tempPaths,
    addFiles,
    removeUploadedFile,
    clearUploadedFiles,
  };
}
