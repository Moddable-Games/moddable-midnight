// Pins the token artwork and metadata documents to public IPFS through Pinata, under exactly
// the CIDs the crew treasury contract already vouches for.
//
//   node scripts/pin-metadata.mjs            upload (skips files Pinata already has)
//   node scripts/pin-metadata.mjs --check    no upload: fetch each CID from public gateways
//
// The JWT is read from $PINATA_JWT or ~/.config/pinata/jwt, and is never printed. A key
// scoped to file uploads is enough.
//
// Our CIDs are single raw blocks (CIDv1, raw codec, sha2-256), fixed in the metadata documents
// and, through their digests, in the contract. Pinata's default import profile (cid_version
// "v1": raw leaves, 256 KiB chunks, the same as `ipfs add --cid-version=1`) stores a file
// smaller than one chunk as exactly that raw block, so a plain upload keeps our CID; the
// script stops if Pinata reports any other. (A one-block CAR upload would pin the CID
// regardless of profile, but Pinata allows CAR uploads only on paid plans.)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { pathToFileURL } from "node:url";
import { cid } from "../wallet-daemon/metadata.mjs";

const METADATA = new URL("../metadata/", import.meta.url).pathname;
const PINS_FILE = METADATA + "pins.json";
const UPLOAD_URL = "https://uploads.pinata.cloud/v3/files";
const GATEWAYS = ["https://ipfs.io/ipfs/", "https://dweb.link/ipfs/", "https://gateway.pinata.cloud/ipfs/"];

/** Every content-addressed file: the artwork, each token document, the collection manifest. */
function files() {
  return [
    ...readdirSync(METADATA + "images").map((f) => `images/${f}`),
    ...readdirSync(METADATA + "tokens").map((f) => `tokens/${f}`),
    "agent-smart-contracts.json",
  ].map((path) => {
    const bytes = readFileSync(METADATA + path);
    return { path, bytes, cid: cid(bytes) };
  });
}

// ---------------------------------------------------------------------------------------
// Upload and check
// ---------------------------------------------------------------------------------------

function jwt() {
  if (process.env.PINATA_JWT) return process.env.PINATA_JWT.trim();
  const file = `${homedir()}/.config/pinata/jwt`;
  if (!existsSync(file)) throw new Error(`no Pinata JWT: set PINATA_JWT or save it to ${file}`);
  return readFileSync(file, "utf8").trim();
}

async function upload(file, token) {
  const form = new FormData();
  if (file.bytes.length > 256 * 1024) throw new Error(`${file.path} is larger than one 256 KiB chunk`);
  const type = file.path.endsWith(".svg") ? "image/svg+xml" : "application/json";
  form.append("file", new Blob([file.bytes], { type }), file.path.split("/").pop());
  form.append("network", "public");
  form.append("cid_version", "v1");
  form.append("name", `moddable-midnight/${file.path}`);
  form.append("keyvalues", JSON.stringify({ project: "moddable-midnight", path: file.path }));
  const response = await fetch(UPLOAD_URL, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${response.status} ${JSON.stringify(body).slice(0, 300)}`);
  return body.data ?? body;
}

/** Fetch a CID from a gateway and confirm the bytes hash back to it. */
async function served(gateway, file) {
  try {
    const response = await fetch(gateway + file.cid, { signal: AbortSignal.timeout(30_000) });
    if (!response.ok) return `HTTP ${response.status}`;
    const bytes = Buffer.from(await response.arrayBuffer());
    return cid(bytes) === file.cid ? "ok" : "bytes do not match the CID";
  } catch (error) {
    return error.name === "TimeoutError" ? "timeout" : String(error.message ?? error);
  }
}

async function main() {
  const pins = existsSync(PINS_FILE) ? JSON.parse(readFileSync(PINS_FILE, "utf8")) : {};
  const checkOnly = process.argv.includes("--check");
  const token = checkOnly ? null : jwt();

  for (const file of files()) {
    if (!checkOnly && !pins[file.cid]) {
      const out = await upload(file, token);
      if (out.cid !== file.cid) throw new Error(`${file.path}: Pinata pinned ${out.cid}, expected ${file.cid}`);
      pins[file.cid] = { path: file.path, pinataId: out.id, pinnedAt: new Date().toISOString() };
      writeFileSync(PINS_FILE, JSON.stringify(pins, null, 2) + "\n");
      console.log(`pinned  ${file.cid}  ${file.path}`);
    }
    const results = [];
    for (const gateway of GATEWAYS) results.push(`${new URL(gateway).host}: ${await served(gateway, file)}`);
    console.log(`check   ${file.cid}  ${file.path}\n        ${results.join(" | ")}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
