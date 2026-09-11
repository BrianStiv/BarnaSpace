interface CloudinaryUploadWidget {
  open(): void;
  close(): void;
}

interface CloudinaryUploadWidgetResult {
  event?: string;
  info?: { secure_url: string };
}

interface CloudinaryGlobal {
  createUploadWidget(
    options: Record<string, unknown>,
    callback: (error: unknown, result: CloudinaryUploadWidgetResult) => void,
  ): CloudinaryUploadWidget;
}

declare global {
  interface Window {
    cloudinary: CloudinaryGlobal;
  }
}

export {};