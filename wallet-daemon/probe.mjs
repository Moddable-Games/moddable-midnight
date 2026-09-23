// Proves the daemon's wallet can sync in our own process and restart quickly.
//   node wallet-daemon/probe.mjs agent-tzilo
import { openWallet, isUsable, saveState } from "./wallet.mjs";

const name = process.argv[2] ?? "agent-tzilo";
const started = Date.now();
const secs = () => ((Date.now() - started) / 1000).toFixed(1) + "s";

const wallet = await openWallet(name);
console.log(`${name}: opened (${wallet.restored ? "restored from " + wallet.restoredFrom : "fresh"}) at ${secs()}`);

let last = "";
// Save progress every minute while syncing, so an interrupted sync resumes where it stopped.
const saver = setInterval(() => saveState(wallet).then(() => console.log(`${secs()}  progress saved`)).catch((e) => console.log(`save failed: ${e.message}`)), 60000);
const sub = wallet.facade.state().subscribe(async (state) => {
  const ready = isUsable(state);
  const sp = state.shielded?.state?.progress;
  const line = `unshielded=${ready.unshielded} shielded=${ready.shielded} (${sp?.appliedIndex}/${sp?.highestRelevantWalletIndex}, highest ${sp?.highestIndex}) dust=${ready.dust}`;
  if (line !== last) { console.log(`${secs()}  ${line}`); last = line; }
  if (!ready.all) return;
  sub.unsubscribe();
  clearInterval(saver);
  const night = state.unshielded.balances[("0").repeat(64)] ?? 0n;
  let dust = 0n;
  try { dust = state.dust.balance(new Date()); } catch { /* not yet */ }
  console.log(`${secs()}  USABLE — NIGHT ${Number(night) / 1e6}, DUST ${Number(dust) / 1e15}`);
  await saveState(wallet);
  console.log(`${secs()}  state saved`);
  await wallet.facade.stop();
  process.exit(0);
});

setTimeout(() => { console.log(`gave up at ${secs()} (${last})`); process.exit(1); }, 15 * 60 * 1000);
