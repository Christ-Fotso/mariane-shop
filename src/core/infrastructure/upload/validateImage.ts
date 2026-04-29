/**
 * Validates an uploaded image file.
 * Checks:
 *  - File size (max 5MB)
 *  - MIME type via file magic bytes (not just the Content-Type header, which can be spoofed)
 */

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// Magic byte signatures for common image types
const MAGIC_BYTES: { mime: string; bytes: number[] }[] = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header (webp uses RIFF)
];

export function getMimeFromBuffer(buffer: Buffer): string | null {
  for (const { mime, bytes } of MAGIC_BYTES) {
    if (bytes.every((byte, i) => buffer[i] === byte)) {
      return mime;
    }
  }
  return null;
}

export function validateImageFile(file: File, buffer: Buffer): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: `L'image "${file.name}" dépasse la taille maximale de 5 Mo.` };
  }

  const detectedMime = getMimeFromBuffer(buffer);

  if (!detectedMime || !ALLOWED_MIME_TYPES.includes(detectedMime)) {
    return {
      valid: false,
      error: `Le fichier "${file.name}" n'est pas une image valide (JPEG, PNG, WebP ou GIF requis).`,
    };
  }

  return { valid: true };
}
