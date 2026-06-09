export function normalizeCmsImagePath(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  const normalizeUploadPath = (pathValue: string) => {
    const path = pathValue.replace(/\\/g, "/").replace(/^\/+/, "");
    const publicUpload = path.match(/^(?:admin\/)?public\/uploads\/(.+)$/i);

    if (publicUpload?.[1]) {
      return `/uploads/${publicUpload[1]}`;
    }

    const upload = path.match(/^uploads\/(.+)$/i);

    if (upload?.[1]) {
      return `/uploads/${upload[1]}`;
    }

    return "";
  };

  const normalizedRelativePath = normalizeUploadPath(trimmed);

  if (normalizedRelativePath) {
    return normalizedRelativePath;
  }

  if (/^https?:/i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const normalizedUrlPath = normalizeUploadPath(url.pathname);

      if (normalizedUrlPath) {
        return normalizedUrlPath;
      }
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}
