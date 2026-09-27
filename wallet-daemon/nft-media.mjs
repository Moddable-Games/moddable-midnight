// NFT images: pinned to public IPFS when an NFT is minted, and published as its MIP-0018 `image`.
//
// The page sends a small image (it downscales before upload). We compute its CID ourselves
// (CIDv1, raw, sha2-256, as metadata.mjs does for the treasury's artwork) and pin it through
// Pinata; the upload counts only if Pinata returns the same CID. A copy is kept in
// metadata/nft/<cid>.<ext>, public and committed, so the app and the site show it without a
// gateway. The Pinata JWT is read from $PINATA_JWT or ~/.config/pinata/jwt and never printed.
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { cid } from "./metadata.mjs";

const DIR = new URL("../metadata/nft/", import.meta.url).pathname;
const UPLOAD_URL = "https://uploads.pinata.cloud/v3/files";
const TYPES = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/svg+xml": "svg", "image/gif": "gif" };
export const MAX_IMAGE_BYTES = 256 * 1024; // one IPFS block, so our CID and the network's agree

function jwt() {
  if (process.env.PINATA_JWT) return process.env.PINATA_JWT.trim();
  const file = `${homedir()}/.config/pinata/jwt`;
  if (!existsSync(file)) throw new Error("IPFS pinning is not set up: save a Pinata JWT to ~/.config/pinata/jwt");
  return readFileSync(file, "utf8").trim();
}

/** Pins `dataUrl` (data:image/...;base64,...) and returns { cid, uri, type, bytes }. */
export async function pinImage(dataUrl, name) {
  const match = /^data:(image\/[a-z+]+);base64,(.+)$/.exec(String(dataUrl ?? ""));
  if (!match) throw new Error("the image must be a PNG, JPEG, WebP, GIF or SVG data URL");
  const [, type, base64] = match;
  const ext = TYPES[type];
  if (!ext) throw new Error(`unsupported image type ${type}`);
  const bytes = Buffer.from(base64, "base64");
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error("the image is over 256 KB");
  const expected = cid(bytes);

  mkdirSync(DIR, { recursive: true });
  writeFileSync(DIR + `${expected}.${ext}`, bytes);

  const form = new FormData();
  form.append("file", new Blob([bytes], { type }), `${expected}.${ext}`);
  form.append("network", "public");
  form.append("cid_version", "v1");
  form.append("name", `moddable-midnight/nft/${String(name ?? expected).slice(0, 60)}`);
  form.append("keyvalues", JSON.stringify({ project: "moddable-midnight", kind: "nft-image" }));
  const response = await fetch(UPLOAD_URL, { method: "POST", headers: { Authorization: `Bearer ${jwt()}` }, body: form });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`IPFS pinning failed: ${response.status}`);
  const pinned = (body.data ?? body).cid;
  if (pinned !== expected) throw new Error(`IPFS returned ${pinned}, expected ${expected}; not using it`);
  return { cid: expected, uri: `ipfs://${expected}`, type, bytes: bytes.length };
}

/** A locally kept image by CID, for /api/media/<cid>. */
export function localImage(wanted) {
  if (!/^b[a-z2-7]{20,}$/.test(wanted) || !existsSync(DIR)) return null;
  const file = readdirSync(DIR).find((f) => f.startsWith(wanted + "."));
  if (!file) return null;
  const ext = file.split(".").pop();
  const type = Object.entries(TYPES).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
  return { bytes: readFileSync(DIR + file), type };
}
