import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_VIDEO_SIZE = 35 * 1024 * 1024; // 35 MB

export async function validateAndExtractUpload(file, expectedType = "image") {
  if (!file || typeof file !== "object" || !file.name) {
    throw new Error("No valid file provided for upload.");
  }

  const mimeType = (file.type || "").toLowerCase();
  const rawExt = path.extname(file.name || "").toLowerCase();

  // Explicit blocked extensions to strictly eliminate Stored XSS / Execution
  const BLOCKED_EXTENSIONS = [".svg", ".html", ".htm", ".xhtml", ".xml", ".js", ".mjs", ".php", ".py", ".sh", ".exe"];
  if (BLOCKED_EXTENSIONS.includes(rawExt)) {
    throw new Error(`File format ${rawExt} is strictly prohibited for security reasons.`);
  }

  const safeExtension = ALLOWED_MIME_TO_EXT[mimeType];
  if (!safeExtension) {
    throw new Error(`Unsupported MIME type: ${mimeType || "unknown"}. Only JPEG, PNG, WEBP, and MP4/WEBM/MOV are allowed.`);
  }

  const isVideo = safeExtension === ".mp4" || safeExtension === ".webm" || safeExtension === ".mov";
  const sizeLimit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > sizeLimit) {
    throw new Error(`File exceeds size limit of ${Math.round(sizeLimit / (1024 * 1024))}MB.`);
  }

  // Generate an unguessable cryptographic filename
  const randomIdentifier = crypto.randomBytes(12).toString("hex");
  const safeFilename = `${expectedType}-${Date.now()}-${randomIdentifier}${safeExtension}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return { safeFilename, buffer, extension: safeExtension };
}
