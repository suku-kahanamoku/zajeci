export type UploadStatus =
  | "pending"
  | "uploading"
  | "ready"
  | "uploaded"
  | "error";

export interface UploadedFileRecord {
  id: number;
  name: string;
  path: string;
  mime_type?: string;
  size?: number;
}

export interface FileUploadItem {
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  tempPath?: string;
  record?: UploadedFileRecord;
}

export interface UseFileUploadOptions {
  entityType?: string;
  entityId?: number | null;
  visibility?: "public" | "private";
}

interface UploadResponseShape {
  success?: boolean;
  data?: {
    path?: string;
  };
}

interface CommitResponseShape {
  data?: UploadedFileRecord;
  id?: number;
  name?: string;
  path?: string;
  mime_type?: string;
  size?: number;
}

function normalizeCommitRecord(
  payload: CommitResponseShape,
): UploadedFileRecord {
  const src =
    payload.data && typeof payload.data === "object" ? payload.data : payload;

  return {
    id: Number(src.id || 0),
    name: String(src.name || ""),
    path: String(src.path || ""),
    mime_type: src.mime_type,
    size: src.size,
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
      const progress = Math.max(
        1,
        Math.round((event.loaded / event.total) * 95),
      );
      onProgress?.(progress);
    });

    // For small files the progress event never fires – mark upload done on loadend
    xhr.upload.addEventListener("loadend", () => {
      onProgress?.(95);
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const path = parseUploadResponse(xhr.responseText || "{}");
          resolve(path);
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

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const files = reactive<File[]>([]);
  const items = ref<FileUploadItem[]>([]);

  const uploadedFiles = computed<UploadedFileRecord[]>(() => {
    return items.value
      .filter((item) => item.status === "uploaded" && item.record)
      .map((item) => item.record as UploadedFileRecord);
  });

  // Get temp paths that haven't been committed yet
  const tempPaths = computed<Array<{ path: string; name: string }>>(() => {
    return items.value
      .filter((item) => item.tempPath && !item.record)
      .map((item) => ({ path: item.tempPath!, name: item.file.name }));
  });

  async function uploadOnly(file: File): Promise<void> {
    items.value.push({
      file,
      progress: 0,
      status: "pending",
    });

    // Always reference through the reactive array so Vue tracks mutations
    const item = items.value[items.value.length - 1];
    if (!item) return;

    try {
      item.status = "uploading";
      item.progress = 1;

      const tempPath = await uploadToTemp(file, (progress) => {
        item.progress = progress;
      });

      item.tempPath = tempPath;
      item.progress = 100;
      item.status = "ready"; // Uploaded to temp, waiting for commit
    } catch (error: any) {
      item.status = "error";
      item.error = error?.message || "Upload selhal";
      item.progress = 0;
    }
  }

  async function commitTempFiles(entityId?: number): Promise<void> {
    const pendingItems = items.value.filter(
      (item) => item.tempPath && !item.record && item.status !== "uploaded",
    );

    for (const item of pendingItems) {
      try {
        item.status = "uploading";

        const body: Record<string, any> = {
          path: item.tempPath,
          name: item.file.name,
          visibility: options.visibility || "private",
        };

        if (options.entityType) {
          body.entity_type = options.entityType;
        }
        if (typeof entityId === "number") {
          body.entity_id = entityId;
        }

        const commitResponse = (await useApi("/api/files/commit", {
          method: "POST",
          body,
        })) as CommitResponseShape;

        const record = normalizeCommitRecord(commitResponse);
        if (!record.id) {
          throw new Error("Commit nevratil ID souboru");
        }

        item.record = record;
        item.progress = 100;
        item.status = "uploaded";
      } catch (error: any) {
        item.status = "error";
        item.error = error?.message || "Commit selhal";
        item.progress = 0;
      }
    }
  }

  async function addFiles(inputFiles: File[]): Promise<void> {
    for (const file of inputFiles) {
      const alreadyExists = files.some(
        (stored) =>
          stored.name === file.name &&
          stored.size === file.size &&
          stored.lastModified === file.lastModified,
      );

      if (!alreadyExists) {
        files.push(file);
      }
    }
  }

  function removeItem(index: number): void {
    const removed = items.value[index];
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

    items.value.splice(index, 1);
  }

  function clear(): void {
    files.splice(0, files.length);
    items.value = [];
  }

  watch(
    files,
    async (newFiles) => {
      const alreadyTracked = new Set(
        items.value.map(
          (item) =>
            `${item.file.name}|${item.file.size}|${item.file.lastModified}`,
        ),
      );

      const pending = newFiles.filter((file) => {
        const key = `${file.name}|${file.size}|${file.lastModified}`;
        return !alreadyTracked.has(key);
      });

      for (const file of pending) {
        await uploadOnly(file);
      }
    },
    { deep: true },
  );

  return {
    files,
    items,
    uploadedFiles,
    tempPaths,
    addFiles,
    removeItem,
    clear,
    commitTempFiles,
  };
}
