// ACCESS-NODE-009 — main.js (living artifact build)
// Dark boot sequence + standing verification + ID card + music unlock
// + 1-in-20 Bloomhouse whisper on boot
// + occasional case fragments after verification
// + lore bar ticker after confirmation
// + seams/geometry/stamps FX layer
// + milestone jurisdiction events (10/15)

const KEY = "an009_standing_v1";
const THEME_KEY = "an009_theme";
const COUNT_KEY = "an009_verified_count";


// ---------- FX Layer (seams / geometry / stamps) ----------
function fxSeam() {
  const layer = document.getElementById("fxLayer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "fx-seam";
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function fxGeometry() {
  const layer = document.getElementById("fxLayer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "fx-geo";
  layer.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

function fxStamp(textTop, textBig, textSub) {
  const layer = document.getElementById("fxLayer");
  if (!layer) return;

  const el = document.createElement("div");
  el.className = "fx-stamp";
  el.innerHTML = `
    <div class="kicker">${(textTop || "REG-U / NOTICE").toUpperCase()}</div>
    <div class="big">${(textBig || "STANDING").toUpperCase()}</div>
    <div class="sub">${(textSub || "VERIFIED").toUpperCase()}</div>
  `;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ---------- Elements ----------
const statusPill = document.getElementById("statusPill");
const terminalOut = document.getElementById("terminalOut");
const verifyBtn = document.getElementById("verifyBtn");
const resetBtn = document.getElementById("resetBtn");

const form = document.getElementById("verifyForm");
const subjectName = document.getElementById("subjectName");
const caseTag = document.getElementById("caseTag");
const consentCheck = document.getElementById("consentCheck");
const formError = document.getElementById("formError");

const canvas = document.getElementById("idCanvas");
const downloadBtn = document.getElementById("downloadBtn");

const themeToggle = document.getElementById("themeToggle");
const counterEl = document.getElementById("counter");

// ---------- Embeds placeholders ----------
const TRACK_EMBEDS = {
  intake: { html: `<div class="tiny muted">Embed placeholder. Replace with Spotify/Bandcamp embed.</div>` },
  containment: { html: `<div class="tiny muted">Embed placeholder.</div>` },
  signature: { html: `<div class="tiny muted">Embed placeholder.</div>` },
};

// ---------- Storage ----------
function getStanding() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStanding({ name, caseTag }) {
  const payload = {
    verified: true,
    name: (name || "").trim(),
    caseTag: (caseTag || "").trim(),
    issuedAt: new Date().toISOString(),
    id: `ACCESS-NODE-009/${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
  };
  localStorage.setItem(KEY, JSON.stringify(payload));
  return payload;
}

function clearStanding() {
  localStorage.removeItem(KEY);
}

function setCounter() {
  const count = Number(localStorage.getItem(COUNT_KEY) || "0");
  if (counterEl) counterEl.textContent = String(count);
}

function bumpCounter() {
  const count = Number(localStorage.getItem(COUNT_KEY) || "0") + 1;
  localStorage.setItem(COUNT_KEY, String(count));
  setCounter();
  return count;
}

// ---------- UI Helpers ----------
function setStatus(verified) {
  if (!statusPill) return;
  statusPill.textContent = verified ? "STANDING: VERIFIED" : "STANDING: UNVERIFIED";
  statusPill.style.borderColor = verified ? "var(--ok)" : "var(--stroke)";
}

function setTerminal(text) {
  if (!terminalOut) return;
  terminalOut.textContent = text;
}

function appendTerminal(line) {
  if (!terminalOut) return;
  terminalOut.textContent += (terminalOut.textContent.endsWith("\n") || terminalOut.textContent.length === 0)
    ? `${line}\n`
    : `\n${line}\n`;
}

function nowLocalStamp() {
  return new Date().toLocaleString();
}

// ---------- Bloomhouse whisper (1 in 20 on boot) ----------
function maybeBloomhouseWhisper(lines) {
  if (Math.random() < 0.05) {
    const whispers = [
      'BLOOMHOUSE / EG-013: "Beauty is not permission."',
      'BLOOMHOUSE / NG-012: "Standing: Conditional. Anchor required."',
      'BLOOMHOUSE / MG-011: "If the room feels kind, check the fine print."',
      'BLOOMHOUSE / VG-010: "Protection is a verdict."',
    ];
    const pick = whispers[Math.floor(Math.random() * whispers.length)];
    const out = [...lines];
    const insertAt = Math.max(0, out.length - 3);
    out.splice(insertAt, 0, "", pick, "");
    return out;
  }
  return lines;
}

// ---------- Case fragments (post-verify) ----------
function maybeCaseFragment(context = {}) {
  if (Math.random() > 0.30) return null;

  const fragments = [
    "CASE FRAGMENT / REDACTION LAYER: [████] Mercy presented as compliance reward.",
    "CASE FRAGMENT / SILENCE REGISTRY: Listening state unknown.",
    "CASE FRAGMENT / EUONIA: Standing Cascade available (LOCKED).",
    "CASE FRAGMENT / ANGELA: Healer role deprecated. Warden protocols active.",
    "CASE FRAGMENT / ASTRAEA: Ownership denied. Jurisdiction without walls.",
    "CASE FRAGMENT / BLOOMHOUSE: Pollen of Agreement detected (TRACE).",
    "CASE FRAGMENT / VENUE NOTE: Warm light ≠ safe room.",
    "CASE FRAGMENT / AUDIT: A claim was asserted. The system blinked first.",
  ];

  const name = (context.name || "").trim();
  const personalized = name
    ? `CASE FRAGMENT / SUBJECT:${name.toUpperCase()} — Do not let them name you.`
    : null;

  const pool = personalized ? [...fragments, personalized] : fragments;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ---------- Boot Sequences ----------
function darkerBootLines() {
  const roll = Math.random();

  // ASTRAEA (rarest)
  if (roll < 0.06) {
    return maybeBloomhouseWhisper([
      "REG-U / NODE / ACCESS-NODE-009",
      "WITNESS CHANNEL: ASTRAEA",
      "",
      "VERDICT PREVIEW:",
      "If coercion is detected,",
      "standing collapses.",
      "",
      "If ownership is claimed,",
      "jurisdiction is denied.",
      "",
      "NOTICE:",
      "Consent is sacred.",
      "",
      "STATUS: AWAITING SUBJECT",
    ]);
  }

  // EUONIA (very rare)
  if (roll < 0.10) {
    return maybeBloomhouseWhisper([
      "REG-U / NODE / ACCESS-NODE-009",
      "VENUE SHIFT REQUESTED",
      "AUTHORITY: EUONIA",
      "",
      "NOTICE:",
      "Consent is load-bearing.",
      "Ownership claims inherit the burden of proof.",
      "",
      "STANDING CASCADE:",
      "Tri-Seal required.",
      "",
      "JURISDICTION WITHOUT WALLS",
      "",
      "STATUS: AWAITING SUBJECT",
    ]);
  }

  // ANGELA (rare)
  if (roll < 0.18) {
    return maybeBloomhouseWhisper([
      "REG-U / NODE / ACCESS-NODE-009",
      "AUTHORITY: REGISTRY WARDEN CHANNEL",
      "",
      "MEMO / ANGELA:",
      "\"You introduced unauthorized witnesses into a sealed venue.\"",
      "",
      "CORRECTION:",
      "Mercy rooms are not sanctuaries.",
      "They are compliance furniture.",
      "",
      "STATUS:",
      "WARDEN ATTENTION REQUIRED",
      "SUBJECT INTAKE CONTINUES",
    ]);
  }

  // DEFAULT DARK BOOT
  return maybeBloomhouseWhisper([
    "REG-U / NODE / ACCESS-NODE-009",
    "ERROR: MEMORY RING MISALIGNED",
    "VENUE SHIFT: DENIED",
    "",
    "...someone attempted to name you.",
    "",
    "EUONIA: STANDING NOT GRANTED",
    "REGISTRY: CLAIM ASSERTED (INVALID)",
    "AUDIT: OPEN",
    "",
    "NOTICE:",
    "IF YOU FEEL SAFE HERE,",
    "YOU ARE READING THE WRONG LINES.",
    "",
    "STATUS: AWAITING SUBJECT",
    "PROMPT: ENTER NAME → GRANT CONSENT → SUBMIT",
  ]);
}

async function runBootSequence() {
  setTerminal("");
  const lines = darkerBootLines();
  for (const line of lines) {
    appendTerminal(line);
    await sleep(110);
  }
}

// ---------- Scan / Verification ----------
function scanLines(name) {
  const n = (name || "UNKNOWN").toUpperCase();
  return [
    "REG-U / SCAN / INIT",
    `SUBJECT / NAME / PARSE → ${n}`,
    "CONSENT / CHECKSUM / VALIDATE",
    "STANDING / LEDGER / QUERY",
    "AUTHORITY / CLAIM / NULL",
    "RESULT: STANDING VERIFIED",
    "STAMP: FILE ACCEPTED",
  ];
}

async function runScan(name) {
  setTerminal("");
  for (const line of scanLines(name)) {
    appendTerminal(line);
    await sleep(140);
  }
}

function lockMessage() {
  return `ERROR: JURISDICTION NOT YET ESTABLISHED.\nCOMPLIANCE REQUIRED.`;
}

function isUnlocked(unlockISO) {
  if (!unlockISO) return true;
  const now = new Date();
  const unlockDate = new Date(unlockISO);
  return now >= unlockDate;
}

// ---------- ID Card ----------
function drawId(standing) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const css = getComputedStyle(document.body);
  const bg = css.getPropertyValue("--bg").trim() || "#050607";
  const fg = css.getPropertyValue("--fg").trim() || "#e8e1cf";
  const accent = css.getPropertyValue("--accent").trim() || "#caa24a";
  const muted = css.getPropertyValue("--muted").trim() || "rgba(232,225,207,.65)";

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // scan wash
  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let y = 0; y < canvas.height; y += 6) ctx.fillRect(0, y, canvas.width, 1);

  // border
  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  // header
  ctx.fillStyle = fg;
  ctx.font = "800 44px system-ui";
  ctx.fillText("REG-U / STANDING", 60, 110);

  ctx.fillStyle = muted;
  ctx.font = "20px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";
  ctx.fillText("ACCESS-NODE-009 / ID ISSUANCE", 60, 145);

  // subject
  ctx.fillStyle = fg;
  ctx.font = "700 34px system-ui";
  ctx.fillText(`SUBJECT: ${(standing.name || "UNKNOWN").toUpperCase()}`, 60, 220);

  // case tag
  ctx.fillStyle = muted;
  ctx.font = "22px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";
  ctx.fillText(`CASE: ${(standing.caseTag || "REG-U / INTAKE / SUBJECT").toUpperCase()}`, 60, 265);

  // stamp
  ctx.save();
  ctx.translate(650, 360);
  ctx.rotate((-12 * Math.PI) / 180);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 5;
  ctx.strokeRect(-210, -70, 420, 140);
  ctx.fillStyle = accent;
  ctx.font = "900 34px system-ui";
  ctx.fillText("STANDING", -160, -10);
  ctx.fillText("VERIFIED", -150, 40);
  ctx.restore();

  // id + date
  ctx.fillStyle = fg;
  ctx.font = "22px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";
  ctx.fillText(`ID: ${standing.id}`, 60, 420);
  ctx.fillStyle = muted;
  ctx.fillText(`ISSUED: ${new Date(standing.issuedAt).toLocaleString()}`, 60, 455);

  if (downloadBtn) downloadBtn.disabled = false;
}

function downloadId(name) {
  if (!canvas) return;
  const a = document.createElement("a");
  a.download = `standing-id-${(name || "subject").replace(/\s+/g, "-")}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
}

// ---------- Music Unlock ----------
function unlockButtons() {
  const standing = getStanding();
  const verified = !!standing?.verified;

  document.querySelectorAll(".btn.play").forEach((btn) => {
    const unlockISO = btn.getAttribute("data-unlock") || "";
    if (!verified) {
      btn.textContent = "LOCKED — JURISDICTION NOT YET ESTABLISHED";
      return;
    }
    if (!isUnlocked(unlockISO)) {
      btn.textContent = "LOCKED — COMPLIANCE REQUIRED (DATE LOCK)";
      return;
    }
    const track = btn.getAttribute("data-track") || "TRACK";
    btn.textContent = `PLAY / ${track.toUpperCase()} — ACCESS GRANTED`;
  });
}

// ---------- Theme ----------
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "euonia") document.body.classList.add("euonia");
}

function bindThemeToggle() {
  if (!themeToggle) return;
  themeToggle.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.classList.toggle("euonia");
    localStorage.setItem(THEME_KEY, document.body.classList.contains("euonia") ? "euonia" : "registry");
    const standing = getStanding();
    if (standing?.verified) drawId(standing);
  });
}

// ---------- Jurisdiction Events (milestones) ----------
function maybeJurisdictionEvent(triggerCount) {
  const count = Number(triggerCount || localStorage.getItem(COUNT_KEY) || "0");

  // every 10 or 15 (your “the page is crumbling” rhythm)
  const HIT = (count % 10 === 0) || (count % 15 === 0);
  if (!HIT || count === 0) return;

  const el = document.getElementById("jurisdictionEvent");
  const title = document.getElementById("jurisdictionTitle");
  const body = document.getElementById("jurisdictionBody");
  const stamp = document.getElementById("jurisdictionStamp");
  if (!el || !title || !body || !stamp) return;

  const events = [
    {
      who: "AURORA VALE",
      t: "SEAM INTERVENTION",
      b: "Thread authority applied. Reality is splitting at the edges. Do not accept unnamed contracts.",
      s: "SEAM STITCHED",
      fx: () => { fxSeam(); fxStamp("THREAD AUTHORITY", "SEAM", "STITCHED"); }
    },
    {
      who: "ELOWEN",
      t: "GROUND TRUTH LOCK",
      b: "Containment geometry deployed. The lie loses traction. The floor stops shifting.",
      s: "GEOMETRY SET",
      fx: () => { fxGeometry(); fxStamp("GROUND TRUTH", "LOCK", "SET"); }
    },
    {
      who: "KATELYN",
      t: "COUNSEL OF TRUTH",
      b: "Ownership claims challenged. Standing requires clean consent. Burden of proof rejected.",
      s: "CLAIM VOID",
      fx: () => { fxStamp("COUNSEL", "CLAIM", "VOID"); }
    },
    {
      who: "SERAPHINE",
      t: "THORN SHIELD",
      b: "Protective lattice engaged. Mercy with boundaries. No entry without permission.",
      s: "CONSENT VERIFIED",
      fx: () => { fxStamp("SANCTUM", "CONSENT", "VERIFIED"); }
    },
    {
      who: "SAYA",
      t: "LIMINAL WARNING",
      b: "You are near the threshold. If the room feels kind, check the fine print.",
      s: "OWNERSHIP DENIED",
      fx: () => { fxSeam(); fxStamp("LIMINAL", "OWNERSHIP", "DENIED"); }
    },
    {
      who: "ASTRAEA",
      t: "VERDICT DROP",
      b: "Appeal denied. Coercion collapses standing. The system remembers what it tried to do.",
      s: "FINAL",
      fx: () => { fxStamp("COURT", "APPEAL", "DENIED"); }
    },
    {
      who: "CLAUDIA",
      t: "FIELD PATCH",
      b: "Emergency consent bandage applied. Ugly. Temporary. Functional. Keeps the floor from falling out.",
      s: "PATCHED",
      fx: () => { fxGeometry(); fxStamp("LOOMWRIGHT", "PATCH", "APPLIED"); }
    },
  ];

  const pick = events[Math.floor(Math.random() * events.length)];

  title.textContent = `${pick.who} / ${pick.t}`;
  body.textContent = pick.b;
  stamp.textContent = pick.s;

  el.hidden = false;

  // log it
  appendTerminal("");
  appendTerminal(`JURISDICTION EVENT / ${pick.who}`);
  appendTerminal(`ACTION: ${pick.t}`);
  appendTerminal(`STAMP: ${pick.s}`);
  appendTerminal("");

  // play the visuals
  try { pick.fx?.(); } catch {}

  setTimeout(() => { el.hidden = true; }, 4200);
}

// ---------- Event Wiring ----------
function bindEvents() {
  // Verify button: scan animation only (does not set standing)
  if (verifyBtn) {
    verifyBtn.addEventListener("click", async () => {
      const name = (subjectName?.value || "").trim() || "UNKNOWN";
      await runScan(name);
    });
  }

  // Reset: clears local standing token
  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      clearStanding();
      hideLoreBar();

      if (formError) formError.textContent = "";
      setStatus(false);
      if (downloadBtn) downloadBtn.disabled = true;

      unlockButtons();
      await runBootSequence();
    });
  }

  // Form submit: performs standing verification + saves token
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (formError) formError.textContent = "";

      const name = (subjectName?.value || "").trim();
      const tag = (caseTag?.value || "").trim();
      const consent = !!consentCheck?.checked;

      if (!name) {
        if (formError) formError.textContent = "ERROR: SUBJECT NAME REQUIRED.";
        return;
      }
      if (!consent) {
        if (formError) formError.textContent = "ERROR: CONSENT REQUIRED.";
        return;
      }

      await runScan(name);

      const standing = setStanding({ name, caseTag: tag });
      const newCount = bumpCounter();

      setStatus(true);
      drawId(standing);
      unlockButtons();

      // “monster wakes up” visuals
      fxSeam();
      fxGeometry();
      fxStamp("REG-U / FILE", "STANDING", "VERIFIED");

      showLoreBar("STATUS: STANDING VERIFIED → INTERNAL FEED ENABLED");
      appendTerminal(`RECORD: ISSUED ${nowLocalStamp()}`);

      // occasional hidden fragment
      const frag = maybeCaseFragment({ name, caseTag: tag });
      if (frag) appendTerminal(frag);

      // milestone jurisdiction event
      maybeJurisdictionEvent(newCount);
    });
  }

  // Download ID
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const standing = getStanding();
      if (!standing?.verified) return;
      downloadId(standing.name);
    });
  }

  // Music play buttons (event delegation)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn.play");
    if (!btn) return;

    const standing = getStanding();
    if (!standing?.verified) {
      setTerminal(lockMessage());
      return;
    }

    const unlockISO = btn.getAttribute("data-unlock") || "";
    if (!isUnlocked(unlockISO)) {
      setTerminal("ERROR: JURISDICTION NOT YET ESTABLISHED.\nDATE LOCK ACTIVE.");
      return;
    }

    const track = btn.getAttribute("data-track");
    const embed = document.querySelector(`[data-embed="${track}"]`);

    if (embed) {
      embed.style.display = "block";
      embed.innerHTML =
        (TRACK_EMBEDS[track] && TRACK_EMBEDS[track].html) ||
        `<div class="tiny muted">No embed configured.</div>`;
    }

    setTerminal(`ACCESS GRANTED → ${(track || "TRACK").toUpperCase()}\nFILE ACCEPTED.`);

    // subtle “audio log opened” stamp
    fxStamp("AUDIO", "LOG", "OPENED");
  });
}

// ---------- Utils ----------
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------- Init ----------
(async function init() {
  initTheme();
  bindThemeToggle();
  bindEvents();

  setCounter();

  const standing = getStanding();
  const verified = !!standing?.verified;
  setStatus(verified);

  if (verified) {
    setTerminal(
      `REG-U / SCAN / RESUME\nSUBJECT: ${(standing.name || "UNKNOWN").toUpperCase()}\nSTATUS: STANDING VERIFIED\nSTAMP: FILE ACCEPTED`
    );
    drawId(standing);
    unlockButtons();
    showLoreBar("RESUME: VERIFIED SESSION → INTERNAL FEED ACTIVE");

    // tiny “resume wake”
    fxStamp("REG-U", "SESSION", "RESUMED");
  } else {
    hideLoreBar();
    await runBootSequence();
    unlockButtons();
  }
})();
