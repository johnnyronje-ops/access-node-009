// ACCESS-NODE-009 — clean stable main.js
// Boot sequence + standing verification + ID card + music unlock
// FX layer: seams / geometry / stamps
// Jurisdiction events every 10 or 15 verifications
// Lore ticker removed — it got possessed.

const KEY = "an009_standing_v1";
const THEME_KEY = "an009_theme";
const COUNT_KEY = "an009_verified_count";

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

// ---------- Music placeholders ----------
const TRACK_EMBEDS = {
  intake: {
    html: `
      <div class="tiny muted">
        EVIDENCE FILE 001<br>
        CLASSIFICATION: PUBLIC RECORD
      </div>

      <div class="row">
        <a class="btn ghost archive-link" href="https://open.spotify.com/album/6CQaRExhsAzmot5Yan0pW1?si=jGtVe14BTiCzt4ONnyf7wA" target="_blank" data-class="PUBLIC STREAM">
          PUBLIC STREAM
        </a>

        <a class="btn ghost archive-link" href="https://youtube.com/playlist?list=OLAK5uy_mBSPJukIxq-czcqlPOPQd4lWs3w1l-cL0&si=yG5Gm0fv3JMYWV0g" target="_blank" data-class="SURVEILLANCE COPY">
          SURVEILLANCE COPY
        </a>
      </div>

      <div class="tiny muted" style="margin-top:12px">
        RECOVERY STATUS: COMPLETE
      </div>
    `
  },

  containment: {
    html: `
      <div class="tiny muted">
        EVIDENCE FILE 002<br>
        CLASSIFICATION: PARTIAL DISCLOSURE
      </div>

      <div class="row">
        <a class="btn ghost archive-link" href="https://open.spotify.com/album/2VrDvnjeDuRrWjQgGFf7Ws?si=vcStbuOfRP66WfHv67m6EA" target="_blank" data-class="PUBLIC STREAM">
          PUBLIC STREAM
        </a>

        <a class="btn ghost archive-link" href="https://youtube.com/playlist?list=OLAK5uy_lVe6W7_m3ssCz2A48vg7UrjsmPi44RrmI&si=fH8T2EZrwwKDNrAw" target="_blank" data-class="SURVEILLANCE COPY">
          SURVEILLANCE COPY
        </a>
      </div>

      <div class="tiny muted" style="margin-top:12px">
        RECOVERY STATUS: DEGRADED
      </div>
    `
  },

  signature: {
    html: `
      <div class="tiny muted">
        EVIDENCE FILE 003<br>
        CLASSIFICATION: SANCTIONED LEAK
      </div>

      <div class="row">
        <a class="btn ghost archive-link" href="https://open.spotify.com/album/3WrA3DnAOOecHZS200YWzx?si=objXR6xnSOyi0dbdLhyObw" target="_blank" data-class="PUBLIC STREAM">
          PUBLIC STREAM
        </a>
      </div>

      <div class="tiny muted" style="margin-top:12px">
        RECOVERY STATUS: RESTRICTED
      </div>
    `
  }
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

function getCounter() {
  return Number(localStorage.getItem(COUNT_KEY) || "0");
}

function setCounter() {
  if (counterEl) counterEl.textContent = String(getCounter());
}

function bumpCounter() {
  const next = getCounter() + 1;
  localStorage.setItem(COUNT_KEY, String(next));
  setCounter();
  return next;
}

// ---------- Terminal helpers ----------
function setTerminal(text) {
  if (!terminalOut) return;
  terminalOut.textContent = text;
}

function appendTerminal(line) {
  if (!terminalOut) return;
  terminalOut.textContent += terminalOut.textContent.endsWith("\n") || terminalOut.textContent.length === 0
    ? `${line}\n`
    : `\n${line}\n`;
}

function nowLocalStamp() {
  return new Date().toLocaleString();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------- Status ----------
function setStatus(verified) {
  if (!statusPill) return;
  statusPill.textContent = verified ? "STANDING: VERIFIED" : "STANDING: UNVERIFIED";
  statusPill.style.borderColor = verified ? "var(--ok)" : "var(--stroke)";
}

// ---------- FX layer ----------
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

function fxStamp(top, big, sub) {
  const layer = document.getElementById("fxLayer");
  if (!layer) return;

  const el = document.createElement("div");
  el.className = "fx-stamp";
  el.innerHTML = `
    <div class="kicker">${(top || "REG-U / NOTICE").toUpperCase()}</div>
    <div class="big">${(big || "STANDING").toUpperCase()}</div>
    <div class="sub">${(sub || "VERIFIED").toUpperCase()}</div>
  `;

  layer.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ---------- Boot sequences ----------
function maybeBloomhouseWhisper(lines) {
  if (Math.random() >= 0.05) return lines;

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

function darkerBootLines() {
  const roll = Math.random();

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

// ---------- Verification scan ----------
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

// ---------- Case fragments ----------
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

// ---------- ID card ----------
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

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let y = 0; y < canvas.height; y += 6) {
    ctx.fillRect(0, y, canvas.width, 1);
  }

  ctx.strokeStyle = accent;
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

  ctx.fillStyle = fg;
  ctx.font = "800 44px system-ui";
  ctx.fillText("REG-U / STANDING", 60, 110);

  ctx.fillStyle = muted;
  ctx.font = "20px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";
  ctx.fillText("ACCESS-NODE-009 / ID ISSUANCE", 60, 145);

  ctx.fillStyle = fg;
  ctx.font = "700 34px system-ui";
  ctx.fillText(`SUBJECT: ${(standing.name || "UNKNOWN").toUpperCase()}`, 60, 220);

  ctx.fillStyle = muted;
  ctx.font = "22px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";
  ctx.fillText(`CASE: ${(standing.caseTag || "REG-U / INTAKE / SUBJECT").toUpperCase()}`, 60, 265);

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

// ---------- Music ----------
function isUnlocked(unlockISO) {
  if (!unlockISO) return true;
  return new Date() >= new Date(unlockISO);
}

function lockMessage() {
  return "ERROR: JURISDICTION NOT YET ESTABLISHED.\nCOMPLIANCE REQUIRED.";
}

function unlockButtons() {
  const standing = getStanding();
  const verified = !!standing?.verified;

  document.querySelectorAll(".btn.play").forEach((btn) => {
    const unlockISO = btn.getAttribute("data-unlock") || "";
    const track = btn.getAttribute("data-track") || "TRACK";

    if (!verified) {
      btn.textContent = "LOCKED — JURISDICTION NOT YET ESTABLISHED";
      return;
    }

    if (!isUnlocked(unlockISO)) {
      btn.textContent = "LOCKED — COMPLIANCE REQUIRED (DATE LOCK)";
      return;
    }

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
    localStorage.setItem(
      THEME_KEY,
      document.body.classList.contains("euonia") ? "euonia" : "registry"
    );

    const standing = getStanding();
    if (standing?.verified) drawId(standing);
  });
}

// ---------- Jurisdiction events ----------
function maybeJurisdictionEvent(triggerCount) {
  const count = Number(triggerCount || getCounter());
  const hit = (count % 10 === 0) || (count % 15 === 0);

  if (!hit || count === 0) return;

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
      fx: () => {
        fxSeam();
        fxStamp("THREAD AUTHORITY", "SEAM", "STITCHED");
      },
    },
    {
      who: "ELOWEN",
      t: "GROUND TRUTH LOCK",
      b: "Containment geometry deployed. The lie loses traction. The floor stops shifting.",
      s: "GEOMETRY SET",
      fx: () => {
        fxGeometry();
        fxStamp("GROUND TRUTH", "LOCK", "SET");
      },
    },
    {
      who: "KATELYN",
      t: "COUNSEL OF TRUTH",
      b: "Ownership claims challenged. Standing requires clean consent. Burden of proof rejected.",
      s: "CLAIM VOID",
      fx: () => fxStamp("COUNSEL", "CLAIM", "VOID"),
    },
    {
      who: "SERAPHINE",
      t: "THORN SHIELD",
      b: "Protective lattice engaged. Mercy with boundaries. No entry without permission.",
      s: "CONSENT VERIFIED",
      fx: () => fxStamp("SANCTUM", "CONSENT", "VERIFIED"),
    },
    {
      who: "SAYA",
      t: "LIMINAL WARNING",
      b: "You are near the threshold. If the room feels kind, check the fine print.",
      s: "OWNERSHIP DENIED",
      fx: () => {
        fxSeam();
        fxStamp("LIMINAL", "OWNERSHIP", "DENIED");
      },
    },
    {
      who: "ASTRAEA",
      t: "VERDICT DROP",
      b: "Appeal denied. Coercion collapses standing. The system remembers what it tried to do.",
      s: "FINAL",
      fx: () => fxStamp("COURT", "APPEAL", "DENIED"),
    },
    {
      who: "CLAUDIA",
      t: "FIELD PATCH",
      b: "Emergency consent bandage applied. Ugly. Temporary. Functional. Keeps the floor from falling out.",
      s: "PATCHED",
      fx: () => {
        fxGeometry();
        fxStamp("LOOMWRIGHT", "PATCH", "APPLIED");
      },
    },
  ];

  const pick = events[Math.floor(Math.random() * events.length)];

  title.textContent = `${pick.who} / ${pick.t}`;
  body.textContent = pick.b;
  stamp.textContent = pick.s;

  el.hidden = false;

  appendTerminal("");
  appendTerminal(`JURISDICTION EVENT / ${pick.who}`);
  appendTerminal(`ACTION: ${pick.t}`);
  appendTerminal(`STAMP: ${pick.s}`);
  appendTerminal("");

  try {
    pick.fx();
  } catch {}

  setTimeout(() => {
    el.hidden = true;
  }, 4200);
}

// ---------- Events ----------
function bindEvents() {
  if (verifyBtn) {
    verifyBtn.addEventListener("click", async () => {
      const name = (subjectName?.value || "").trim() || "UNKNOWN";
      await runScan(name);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", async () => {
      clearStanding();

      if (formError) formError.textContent = "";
      setStatus(false);
      if (downloadBtn) downloadBtn.disabled = true;

      unlockButtons();
      await runBootSequence();
    });
  }

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

      fxSeam();
      fxGeometry();
      fxStamp("REG-U / FILE", "STANDING", "VERIFIED");

      appendTerminal(`RECORD: ISSUED ${nowLocalStamp()}`);

      const frag = maybeCaseFragment({ name, caseTag: tag });
      if (frag) appendTerminal(frag);

      maybeJurisdictionEvent(newCount);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const standing = getStanding();
      if (!standing?.verified) return;
      downloadId(standing.name);
    });
  }

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
    fxStamp("AUDIO", "LOG", "OPENED");
  });
// Archive links
document.addEventListener("click", (e) => {
  const link = e.target.closest(".archive-link");
  if (!link) return;

  e.preventDefault();

  const url = link.href;
  const mediaClass = link.dataset.class || "EXTERNAL ARCHIVE";

  setTerminal(
`REQUEST RECEIVED...

MEDIA CLASSIFICATION:
${mediaClass}

AUTHORITY:
REG-U

COPY STATUS:
AUTHORIZED

VERIFYING JURISDICTION...

OPENING ARCHIVE...`
  );

  fxStamp("MEDIA", "ACCESS", "AUTHORIZED");

  setTimeout(() => {
    window.open(url, "_blank");
  }, 900);
});
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
    fxStamp("REG-U", "SESSION", "RESUMED");
  } else {
    await runBootSequence();
    unlockButtons();
  }
})();



<a href="dossiers/elizabeth-kuroda/index.html"
   class="dossier-folder elizabeth-kuroda-file">

  <div class="dossier-folder-tab">
    ACTIVE CASE
  </div>

  <div class="dossier-folder-body">
    <div class="dossier-file-number">
      PS-014
    </div>

    <img
      src="dossiers/elizabeth-kuroda/ps014-bell-clerk.jpeg"
      alt="PS-014 The Bell Clerk"
      class="dossier-cover"
    >

    <div class="dossier-folder-info">
      <h3>THE BELL CLERK</h3>
      <p>RECONCILIATION PENDING</p>

      <div class="dossier-entry">
        <span>CLAIMANT</span>
        <strong>ELIZABETH KURODA</strong>
      </div>

      <div class="dossier-entry">
        <span>MISSING CONTACT</span>
        <strong>REINA KURODA</strong>
      </div>

      <div class="dossier-entry">
        <span>RECORD TYPE</span>
        <strong>25-CHAPTER CASE FILE</strong>
      </div>
    </div>

    <div class="dossier-open">
      OPEN DOSSIER →
    </div>
  </div>
</a>


.dossier-folder {
  position: relative;
  display: block;
  width: min(100%, 430px);
  margin: 40px auto;
  padding-top: 42px;
  color: #171711;
  text-decoration: none;
  font-family: "Courier New", monospace;
  filter: drop-shadow(0 24px 26px rgba(0, 0, 0, 0.65));
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}

.dossier-folder:hover {
  transform: translateY(-8px) rotate(-0.4deg);
  filter: drop-shadow(0 34px 38px rgba(0, 0, 0, 0.8));
}

.dossier-folder-tab {
  position: absolute;
  top: 0;
  left: 22px;
  width: 190px;
  height: 58px;
  padding: 15px 18px;
  background:
    linear-gradient(
      180deg,
      #c4b895,
      #958a69
    );
  border: 1px solid #3b372c;
  border-bottom: 0;
  border-radius: 7px 7px 0 0;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.dossier-folder-body {
  position: relative;
  z-index: 2;
  padding: 25px;
  overflow: hidden;
  border: 1px solid #3b372c;
  background:
    repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.025) 0,
      rgba(0, 0, 0, 0.025) 1px,
      transparent 1px,
      transparent 5px
    ),
    linear-gradient(
      145deg,
      #c5b994,
      #8e8364
    );
  box-shadow:
    inset 0 0 75px rgba(42, 28, 10, 0.25);
}

.dossier-folder-body::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      circle at 80% 15%,
      rgba(62, 38, 13, 0.13),
      transparent 22%
    );
}

.dossier-file-number {
  display: inline-block;
  margin-bottom: 18px;
  padding: 5px 9px;
  border: 2px solid #27251e;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.dossier-cover {
  display: block;
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: center 26%;
  border: 7px solid #1d1d18;
  filter:
    grayscale(35%)
    contrast(1.14)
    brightness(0.72);
  transition:
    filter 0.3s ease,
    transform 0.4s ease;
}

.dossier-folder:hover .dossier-cover {
  filter:
    grayscale(10%)
    contrast(1.18)
    brightness(0.9);
  transform: scale(1.015);
}

.dossier-folder-info {
  position: relative;
  z-index: 2;
  padding-top: 20px;
}

.dossier-folder-info h3 {
  margin: 0;
  font-size: 29px;
  letter-spacing: 0.03em;
}

.dossier-folder-info > p {
  margin: 4px 0 18px;
  color: #711919;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.dossier-entry {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 10px;
  padding: 8px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.24);
}

.dossier-entry span {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.dossier-entry strong {
  font-size: 10px;
}

.dossier-open {
  position: relative;
  z-index: 2;
  margin-top: 17px;
  padding-top: 14px;
  border-top: 2px solid #29271f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

@media (max-width: 600px) {
  .dossier-folder {
    width: 100%;
  }

  .dossier-cover {
    height: 240px;
  }

  .dossier-entry {
    grid-template-columns: 110px 1fr;
  }
}
