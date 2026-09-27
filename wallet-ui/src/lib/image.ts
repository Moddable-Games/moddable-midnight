/**
 * Shrinks an image for pinning: at most 1024 px on its longer side, as WebP, stepping quality
 * down until it fits one IPFS block (256 KB), so the CID we compute matches the network's.
 * SVGs are kept as they are when small enough.
 */
export const MAX_BYTES = 250 * 1024;

const bytesOf = (dataUrl: string) => Math.floor((dataUrl.length - dataUrl.indexOf(",") - 1) * 0.75);

export async function toPinnable(file: File): Promise<string> {
  const read = (f: Blob) => new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("could not read the file"));
    r.readAsDataURL(f);
  });
  if (file.type === "image/svg+xml") {
    const svg = await read(file);
    if (bytesOf(svg) > MAX_BYTES) throw new Error("the SVG is over 250 KB");
    return svg;
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("that file is not an image this browser can read"));
      i.src = url;
    });
    for (const side of [1024, 800, 600]) {
      const scale = Math.min(1, side / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      for (const quality of [0.9, 0.8, 0.7, 0.6]) {
        const out = canvas.toDataURL("image/webp", quality);
        if (bytesOf(out) <= MAX_BYTES) return out;
      }
    }
    throw new Error("the image could not be made small enough; try a simpler one");
  } finally {
    URL.revokeObjectURL(url);
  }
}
