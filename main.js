"use strict";

/* =========================================================
   ACCESS-NODE-009
   COMPLETE INTERFACE CONTROLLER

   Systems:
   - Boot sequence
   - Standing verification
   - ID card generation
   - Music archive access
   - Six jurisdiction themes
   - Hidden theme selector
   - Terminal command system
   - Persistent lore/theme unlocks
   - Case fragments
   - Jurisdiction milestone events
   - FX seams, geometry, stamps, glitches
   ========================================================= */


/* =========================================================
   1. STORAGE KEYS
   ========================================================= */

const STORAGE = {
  standing: "an009_standing_v1",
  theme: "an009_theme",
  count: "an009_verified_count",
  unlockedThemes: "an009_unlocked_themes",
  unlockedCommands: "an009_unlocked_commands",
  jurisdictionEvents: "an009_jurisdiction_events",
};


/* =========================================================
   2. APPLICATION STATE
   ========================================================= */

const STATE = {
  standing: null,
  theme: "registry",

  unlockedThemes: new Set([
    "registry",
    "silver",
  ]),

  unlockedCommands: new Set(),
  seenJurisdictionEvents: new Set(),

  terminalHistory: [],
  terminalHistoryIndex: -1,

  themeHoldTimer: null,
  jurisdictionCloseTimer: null,
};


/* =========================================================
   3. DOM ELEMENTS
   ========================================================= */

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

const loreBar = document.getElementById("loreBar");
const loreText = document.getElementById("loreText");

const fxLayer = document.getElementById("fxLayer");

const jurisdictionEvent =
  document.getElementById("jurisdictionEvent");

const jurisdictionTitle =
  document.getElementById("jurisdictionTitle");

const jurisdictionBody =
  document.getElementById("jurisdictionBody");

const jurisdictionStamp =
  document.getElementById("jurisdictionStamp");

const brandSub =
  document.querySelector(".brand .sub");

const intakeTitle =
  document.querySelector(".panel h1");

const intakeSubtitle =
  document.querySelector(".panel h1 + .muted");

const subjectHeading =
  document.querySelector("#verify h2");

const musicHeading =
  document.querySelector("#music > h2");

const briefsLink =
  document.querySelector('a[href="./briefs/"]');


/* =========================================================
   4. THEME DEFINITIONS
   ========================================================= */

const THEMES = {
  registry: {
    label: "REGISTRY",
    toggleLabel: "WE STAYED",

    title: "Registry Standing Intake",
    subtitle:
      "Everything Becomes Procedure Eventually.",

    subjectHeading: "SUBJECT INTAKE",
    musicHeading: "MUSIC ACCESS",

    briefsLabel: "BRIEFS",
    briefsHover: "INTELLIGENCE FEED",

    pendingStatus: "STANDING: UNVERIFIED",
    verifiedStatus: "STANDING: VERIFIED",

    terminalAuthority: "REG-U",
  },

  silver: {
    label: "WE STAYED",
    toggleLabel: "REGISTRY",

    title: "Survivor Record Resumption",
    subtitle:
      "The procedure ended. The record did not.",

    subjectHeading: "WITNESS RECORD",
    musicHeading: "RECOVERED AUDIO",

    briefsLabel: "REMAINS",
    briefsHover: "SURVIVOR TESTIMONY",

    pendingStatus: "WITNESS: UNCONFIRMED",
    verifiedStatus: "WITNESS: RECOGNIZED",

    terminalAuthority: "REMAINS",
  },

  blackwater: {
    label: "BLACKWATER",
    toggleLabel: "BLACKWATER",

    title: "Route Recognition Intake",
    subtitle:
      "The route continues after the passenger does not.",

    subjectHeading: "PASSENGER INTAKE",
    musicHeading: "BROADCAST ACCESS",

    briefsLabel: "ROUTE LOGS",
    briefsHover: "HOUSE LIGHTS STILL ON",

    pendingStatus: "PASSENGER: UNCOUNTED",
    verifiedStatus: "ALL PRESENT",

    terminalAuthority: "BLACKWATER",
  },

  bloomhouse: {
    label: "BLOOMHOUSE",
    toggleLabel: "BLOOMHOUSE",

    title: "Standing and Intervention Review",
    subtitle:
      "Protection is not softness. Protection is a verdict.",

    subjectHeading: "CARE INTAKE",
    musicHeading: "RESONANCE ARCHIVE",

    briefsLabel: "CARE RECORDS",
    briefsHover: "INTERVENTION DOCTRINE",

    pendingStatus: "STANDING: CONDITIONAL",
    verifiedStatus: "CARE PATH: RECOGNIZED",

    terminalAuthority: "BLOOMHOUSE",
  },

  taa: {
    label: "T.A.A.",
    toggleLabel: "T.A.A.",

    title: "Jurisdictional Standing",
    subtitle:
      "Consent is load-bearing. All authority follows.",

    subjectHeading: "CLAIMANT DECLARATION",
    musicHeading: "RESONANCE CHAMBER",

    briefsLabel: "DOCTRINE",
    briefsHover: "JURISDICTIONAL RECORD",

    pendingStatus: "CONSENT: UNVERIFIED",
    verifiedStatus: "CONSENT: VERIFIED",

    terminalAuthority: "TAA",
  },

  propagation: {
    label: "CULTURAL PROPAGATION",
    toggleLabel: "PROPAGATION",

    title: "Public Alignment Intake",
    subtitle:
      "Participation has already been interpreted.",

    subjectHeading: "PARTICIPANT PROFILE",
    musicHeading: "AUTHORIZED MEDIA",

    briefsLabel: "INTELLIGENCE FEED",
    briefsHover: "NARRATIVE ALIGNMENT",

    pendingStatus: "ALIGNMENT: PENDING",
    verifiedStatus: "ALIGNMENT: ACCEPTED",

    terminalAuthority: "CPD",
  },
};


/* =========================================================
   5. THEME LORE
   ========================================================= */

const THEME_LORE = {
  registry: [
    "Standing is not ownership.",
    "A completed form may outlive the person who signed it.",
    "The Registry does not pursue. It continues processing.",
    "All claims inherit the burden of proof.",
    "Unauthorized mercy will be documented.",
    "FILE ACCEPTED. OUTCOME PENDING.",
  ],

  silver: [
    "We stayed because someone had to remember.",
    "Survival was entered as an administrative discrepancy.",
    "The archive still uses their voices.",
    "The procedure ended. Its permissions did not.",
    "Some records remain open because closure would be dishonest.",
    "You were not missing. You were filed elsewhere.",
  ],

  blackwater: [
    "HOUSE LIGHTS STILL ON.",
    "The route remembers every passenger.",
    "Applause has become infrastructure.",
    "Do not follow the bulbs beneath the waterline.",
    "ALL PRESENT does not mean everyone survived.",
    "The smile remains. The route continues.",
  ],

  bloomhouse: [
    "Beauty is not permission.",
    "Standing: Conditional. Anchor required.",
    "Consent is sacred. Everything else is decoration.",
    "Protection is not softness. Protection is a verdict.",
    "Preventive care is not ownership.",
    "If coercion is present, the room will lie for you.",
  ],

  taa: [
    "CONSENT VERIFIED.",
    "UNANIMOUS OR NULL.",
    "Ownership denied. Jurisdiction without walls.",
    "Mercy without consent is still occupation.",
    "Standing may not be inherited through coercion.",
    "Reality is complying because the seam was acknowledged.",
  ],

  propagation: [
    "Public sentiment is not an accident.",
    "Post again. The first attempt was received.",
    "Engagement has been interpreted as consent.",
    "Visibility is a controlled resource.",
    "The feed remembers which version of you performed best.",
    "Narrative alignment is below recommended thresholds.",
  ],
};


/* =========================================================
   6. MUSIC ARCHIVES
   ========================================================= */

const TRACK_EMBEDS = {
  intake: {
    html: `
      <div class="tiny muted">
        EVIDENCE FILE 001<br>
        CLASSIFICATION: PUBLIC RECORD
      </div>

      <div class="row">
        <a
          class="btn ghost archive-link"
          href="https://open.spotify.com/album/6CQaRExhsAzmot5Yan0pW1?si=jGtVe14BTiCzt4ONnyf7wA"
          target="_blank"
          rel="noopener noreferrer"
          data-class="PUBLIC STREAM"
        >
          PUBLIC STREAM
        </a>

        <a
          class="btn ghost archive-link"
          href="https://youtube.com/playlist?list=OLAK5uy_mBSPJukIxq-czcqlPOPQd4lWs3w1l-cL0&si=yG5Gm0fv3JMYWV0g"
          target="_blank"
          rel="noopener noreferrer"
          data-class="SURVEILLANCE COPY"
        >
          SURVEILLANCE COPY
        </a>
      </div>

      <div class="tiny muted" style="margin-top:12px">
        RECOVERY STATUS: COMPLETE
      </div>
    `,
  },

  containment: {
    html: `
      <div class="tiny muted">
        EVIDENCE FILE 002<br>
        CLASSIFICATION: PARTIAL DISCLOSURE
      </div>

      <div class="row">
        <a
          class="btn ghost archive-link"
          href="https://open.spotify.com/album/2VrDvnjeDuRrWjQgGFf7Ws?si=vcStbuOfRP66WfHv67m6EA"
          target="_blank"
          rel="noopener noreferrer"
          data-class="PUBLIC STREAM"
        >
          PUBLIC STREAM
        </a>

        <a
          class="btn ghost archive-link"
          href="https://youtube.com/playlist?list=OLAK5uy_lVe6W7_m3ssCz2A48vg7UrjsmPi44RrmI&si=fH8T2EZrwwKDNrAw"
          target="_blank"
          rel="noopener noreferrer"
          data-class="SURVEILLANCE COPY"
        >
          SURVEILLANCE COPY
        </a>
      </div>

      <div class="tiny muted" style="margin-top:12px">
        RECOVERY STATUS: DEGRADED
      </div>
    `,
  },

  signature: {
    html: `
      <div class="tiny muted">
        EVIDENCE FILE 003<br>
        CLASSIFICATION: SANCTIONED LEAK
      </div>

      <div class="row">
        <a
          class="btn ghost archive-link"
          href="https://open.spotify.com/album/3WrA3DnAOOecHZS200YWzx?si=objXR6xnSOyi0dbdLhyObw"
          target="_blank"
          rel="noopener noreferrer"
          data-class="PUBLIC STREAM"
        >
          PUBLIC STREAM
        </a>
      </div>

      <div class="tiny muted" style="margin-top:12px">
        RECOVERY STATUS: RESTRICTED
      </div>
    `,
  },
};


/* =========================================================
   7. GENERAL UTILITIES
   ========================================================= */

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function normalizeCommand(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function nowLocalStamp() {
  return new Date().toLocaleString();
}

function readStoredArray(key) {
  try {
    const parsed =
      JSON.parse(localStorage.getItem(key) || "[]");

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function saveSet(key, setValue) {
  localStorage.setItem(
    key,
    JSON.stringify([...setValue])
  );
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   8. STANDING STORAGE
   ========================================================= */

function getStanding() {
  try {
    const raw =
      localStorage.getItem(STORAGE.standing);

    return raw
      ? JSON.parse(raw)
      : null;
  } catch {
    return null;
  }
}

function setStanding({
  name,
  caseTag: reference,
}) {
  const payload = {
    verified: true,

    name:
      String(name || "").trim(),

    caseTag:
      String(reference || "").trim(),

    issuedAt:
      new Date().toISOString(),

    id:
      `ACCESS-NODE-009/${Math.random()
        .toString(16)
        .slice(2, 10)
        .toUpperCase()}`,
  };

  localStorage.setItem(
    STORAGE.standing,
    JSON.stringify(payload)
  );

  STATE.standing = payload;

  return payload;
}

function clearStanding() {
  localStorage.removeItem(STORAGE.standing);
  STATE.standing = null;
}


/* =========================================================
   9. LOCAL VERIFICATION COUNTER
   ========================================================= */

function getCounter() {
  return Number(
    localStorage.getItem(STORAGE.count) || "0"
  );
}

function updateCounterDisplay() {
  if (!counterEl) return;

  counterEl.textContent =
    String(getCounter());
}

function bumpCounter() {
  const next =
    getCounter() + 1;

  localStorage.setItem(
    STORAGE.count,
    String(next)
  );

  updateCounterDisplay();

  return next;
}


/* =========================================================
   10. TERMINAL OUTPUT
   ========================================================= */

function setTerminal(text) {
  if (!terminalOut) return;

  terminalOut.textContent =
    String(text || "");
}

function appendTerminal(line = "") {
  if (!terminalOut) return;

  const current =
    terminalOut.textContent;

  if (!current) {
    terminalOut.textContent =
      `${line}\n`;

    return;
  }

  if (current.endsWith("\n")) {
    terminalOut.textContent +=
      `${line}\n`;

    return;
  }

  terminalOut.textContent +=
    `\n${line}\n`;
}

function appendTerminalBlock(text, type = "system") {
  if (!terminalOut) return;

  const current =
    terminalOut.textContent.trim();

  terminalOut.textContent =
    current
      ? `${current}\n\n${text}`
      : text;

  terminalOut.dataset.lastType = type;

  const terminal =
    terminalOut.closest(".terminal");

  if (terminal) {
    terminal.scrollTop =
      terminal.scrollHeight;
  }
}

function clearTerminal() {
  setTerminal("");
}


/* =========================================================
   11. STATUS DISPLAY
   ========================================================= */

function setStatus(verified) {
  if (!statusPill) return;

  const theme =
    THEMES[STATE.theme] ||
    THEMES.registry;

  statusPill.textContent =
    verified
      ? theme.verifiedStatus
      : theme.pendingStatus;

  statusPill.classList.toggle(
    "verified",
    Boolean(verified)
  );

  if (brandSub) {
    brandSub.textContent =
      `${theme.terminalAuthority} / INTAKE / SUBJECT STATUS: ` +
      `${verified ? "VERIFIED" : "PENDING"}`;
  }
}


/* =========================================================
   12. LORE BAR
   ========================================================= */

function showLoreMessage(message) {
  if (!loreBar || !loreText) return;

  loreText.textContent =
    String(message || "…");

  loreBar.hidden = false;
}

function hideLoreBar() {
  if (!loreBar) return;

  loreBar.hidden = true;
}

function showRandomThemeLore() {
  const pool =
    THEME_LORE[STATE.theme] ||
    THEME_LORE.registry;

  const message =
    pool[
      Math.floor(
        Math.random() * pool.length
      )
    ];

  showLoreMessage(message);
}


/* =========================================================
   13. FX SYSTEM
   ========================================================= */

function fxSeamSweep() {
  if (!fxLayer) return;

  const el =
    document.createElement("div");

  el.className =
    "fx-seam fx-seam--sweep";

  el.style.left = "50%";
  el.style.top = "-10%";
  el.style.height = "120%";
  el.style.transform =
    "rotate(-18deg)";

  fxLayer.appendChild(el);

  window.setTimeout(() => {
    el.remove();
  }, 1200);
}

function fxAmbientSeams() {
  if (!fxLayer) return;

  const existing =
    fxLayer.querySelectorAll(
      ".fx-seam--ambient"
    );

  existing.forEach((item) => {
    item.remove();
  });

  for (
    let index = 0;
    index < 4;
    index += 1
  ) {
    const seam =
      document.createElement("div");

    seam.className =
      "fx-seam fx-seam--ambient";

    seam.style.left =
      `${15 + Math.random() * 70}%`;

    seam.style.top =
      `${8 + Math.random() * 70}%`;

    seam.style.height =
      `${90 + Math.random() * 180}px`;

    seam.style.animationDelay =
      `${Math.random() * 5}s`;

    seam.style.transform =
      `rotate(${Math.random() * 24 - 12}deg)`;

    fxLayer.appendChild(seam);
  }
}

function fxGeometry() {
  if (!fxLayer) return;

  const el =
    document.createElement("div");

  el.className = "fx-geo";

  fxLayer.appendChild(el);

  window.setTimeout(() => {
    el.remove();
  }, 950);
}

function fxStamp(
  top,
  big,
  sub
) {
  if (!fxLayer) return;

  const el =
    document.createElement("div");

  el.className = "fx-stamp";

  el.innerHTML = `
    <div class="kicker">
      ${escapeHtml(
        String(top || "REG-U / NOTICE")
          .toUpperCase()
      )}
    </div>

    <div class="big">
      ${escapeHtml(
        String(big || "STANDING")
          .toUpperCase()
      )}
    </div>

    <div class="sub">
      ${escapeHtml(
        String(sub || "VERIFIED")
          .toUpperCase()
      )}
    </div>
  `;

  el.style.left =
    `${22 + Math.random() * 56}%`;

  el.style.top =
    `${22 + Math.random() * 45}%`;

  fxLayer.appendChild(el);

  window.setTimeout(() => {
    el.remove();
  }, 2400);
}

function fxGlitch() {
  if (!fxLayer) return;

  const el =
    document.createElement("div");

  el.className = "fx-glitch";

  fxLayer.appendChild(el);

  window.setTimeout(() => {
    el.remove();
  }, 450);
}

function fxThemeTransition(themeName) {
  if (!fxLayer) return;

  const theme =
    THEMES[themeName];

  if (!theme) return;

  const el =
    document.createElement("div");

  el.className =
    `theme-transition ` +
    `theme-transition--${themeName}`;

  el.textContent =
    theme.label;

  fxLayer.appendChild(el);

  window.setTimeout(() => {
    el.remove();
  }, 1600);
}


/* =========================================================
   14. BOOT SEQUENCES
   ========================================================= */

function maybeBloomhouseWhisper(lines) {
  if (Math.random() >= 0.05) {
    return lines;
  }

  const whispers = [
    'BLOOMHOUSE / EG-013: "Beauty is not permission."',
    'BLOOMHOUSE / NG-012: "Standing: Conditional. Anchor required."',
    'BLOOMHOUSE / MG-011: "If the room feels kind, check the fine print."',
    'BLOOMHOUSE / VG-010: "Protection is a verdict."',
  ];

  const pick =
    whispers[
      Math.floor(
        Math.random() * whispers.length
      )
    ];

  const output =
    [...lines];

  const insertAt =
    Math.max(
      0,
      output.length - 3
    );

  output.splice(
    insertAt,
    0,
    "",
    pick,
    ""
  );

  return output;
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
  clearTerminal();

  const lines =
    darkerBootLines();

  for (const line of lines) {
    appendTerminal(line);
    await sleep(110);
  }
}


/* =========================================================
   15. VERIFICATION SCAN
   ========================================================= */

function scanLines(name) {
  const normalizedName =
    String(name || "UNKNOWN")
      .toUpperCase();

  return [
    "REG-U / SCAN / INIT",
    `SUBJECT / NAME / PARSE → ${normalizedName}`,
    "CONSENT / CHECKSUM / VALIDATE",
    "STANDING / LEDGER / QUERY",
    "AUTHORITY / CLAIM / NULL",
    "RESULT: STANDING VERIFIED",
    "STAMP: FILE ACCEPTED",
  ];
}

async function runScan(name) {
  clearTerminal();

  for (
    const line of scanLines(name)
  ) {
    appendTerminal(line);
    await sleep(140);
  }
}


/* =========================================================
   16. CASE FRAGMENTS
   ========================================================= */

function maybeCaseFragment(
  context = {}
) {
  if (Math.random() > 0.30) {
    return null;
  }

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

  const name =
    String(context.name || "")
      .trim();

  const personalized =
    name
      ? `CASE FRAGMENT / SUBJECT:${name.toUpperCase()} — Do not let them name you.`
      : null;

  const pool =
    personalized
      ? [...fragments, personalized]
      : fragments;

  return pool[
    Math.floor(
      Math.random() * pool.length
    )
  ];
}


/* =========================================================
   17. ID CARD
   ========================================================= */

function drawId(standing) {
  if (!canvas || !standing) return;

  const context =
    canvas.getContext("2d");

  if (!context) return;

  const css =
    getComputedStyle(document.body);

  const background =
    css.getPropertyValue("--bg").trim() ||
    "#050607";

  const foreground =
    css.getPropertyValue("--fg").trim() ||
    "#e8e1cf";

  const accent =
    css.getPropertyValue("--accent").trim() ||
    "#caa24a";

  const muted =
    css.getPropertyValue("--muted").trim() ||
    "rgba(232,225,207,.65)";

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.fillStyle =
    background;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.fillStyle =
    "rgba(255,255,255,0.03)";

  for (
    let y = 0;
    y < canvas.height;
    y += 6
  ) {
    context.fillRect(
      0,
      y,
      canvas.width,
      1
    );
  }

  context.strokeStyle =
    accent;

  context.lineWidth = 6;

  context.strokeRect(
    24,
    24,
    canvas.width - 48,
    canvas.height - 48
  );

  context.fillStyle =
    foreground;

  context.font =
    "800 44px system-ui";

  context.fillText(
    `${THEMES[STATE.theme].terminalAuthority} / STANDING`,
    60,
    110
  );

  context.fillStyle =
    muted;

  context.font =
    "20px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";

  context.fillText(
    "ACCESS-NODE-009 / ID ISSUANCE",
    60,
    145
  );

  context.fillStyle =
    foreground;

  context.font =
    "700 34px system-ui";

  context.fillText(
    `SUBJECT: ${String(
      standing.name || "UNKNOWN"
    )
      .toUpperCase()
      .slice(0, 28)}`,
    60,
    220
  );

  context.fillStyle =
    muted;

  context.font =
    "22px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";

  context.fillText(
    `CASE: ${String(
      standing.caseTag ||
      "REG-U / INTAKE / SUBJECT"
    )
      .toUpperCase()
      .slice(0, 48)}`,
    60,
    265
  );

  context.save();

  context.translate(
    650,
    360
  );

  context.rotate(
    (-12 * Math.PI) / 180
  );

  context.strokeStyle =
    accent;

  context.lineWidth = 5;

  context.strokeRect(
    -210,
    -70,
    420,
    140
  );

  context.fillStyle =
    accent;

  context.font =
    "900 34px system-ui";

  context.fillText(
    "STANDING",
    -160,
    -10
  );

  context.fillText(
    "VERIFIED",
    -150,
    40
  );

  context.restore();

  context.fillStyle =
    foreground;

  context.font =
    "22px ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace";

  context.fillText(
    `ID: ${standing.id}`,
    60,
    420
  );

  context.fillStyle =
    muted;

  context.fillText(
    `ISSUED: ${new Date(
      standing.issuedAt
    ).toLocaleString()}`,
    60,
    455
  );

  if (downloadBtn) {
    downloadBtn.disabled = false;
  }
}

function drawIdPlaceholder() {
  if (!canvas) return;

  const context =
    canvas.getContext("2d");

  if (!context) return;

  const css =
    getComputedStyle(document.body);

  const background =
    css.getPropertyValue("--bg").trim() ||
    "#050607";

  const foreground =
    css.getPropertyValue("--fg").trim() ||
    "#e8e1cf";

  const muted =
    css.getPropertyValue("--muted").trim() ||
    "rgba(232,225,207,.65)";

  const stroke =
    css.getPropertyValue("--stroke").trim() ||
    "rgba(202,162,74,.25)";

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.fillStyle =
    background;

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.strokeStyle =
    stroke;

  context.lineWidth = 3;

  context.strokeRect(
    35,
    35,
    canvas.width - 70,
    canvas.height - 70
  );

  context.fillStyle =
    foreground;

  context.font =
    "700 30px system-ui";

  context.fillText(
    "IDENTIFICATION RECORD UNAVAILABLE",
    75,
    245
  );

  context.fillStyle =
    muted;

  context.font =
    "18px ui-monospace, Menlo, Monaco, Consolas, monospace";

  context.fillText(
    "VERIFY STANDING TO GENERATE LOCAL CREDENTIAL",
    75,
    286
  );
}

function downloadId(name) {
  if (!canvas) return;

  const safeName =
    String(name || "subject")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const link =
    document.createElement("a");

  link.download =
    `standing-id-${safeName || "subject"}.png`;

  link.href =
    canvas.toDataURL("image/png");

  link.click();
}


/* =========================================================
   18. MUSIC ACCESS
   ========================================================= */

function isUnlocked(unlockISO) {
  if (!unlockISO) return true;

  const unlockDate =
    new Date(unlockISO);

  if (
    Number.isNaN(
      unlockDate.getTime()
    )
  ) {
    return false;
  }

  return new Date() >= unlockDate;
}

function lockMessage() {
  return (
    "ERROR: JURISDICTION NOT YET ESTABLISHED.\n" +
    "COMPLIANCE REQUIRED."
  );
}

function unlockButtons() {
  const standing =
    getStanding();

  const verified =
    Boolean(standing?.verified);

  document
    .querySelectorAll(".btn.play")
    .forEach((button) => {
      const unlockISO =
        button.getAttribute(
          "data-unlock"
        ) || "";

      const track =
        button.getAttribute(
          "data-track"
        ) || "TRACK";

      const dateUnlocked =
        isUnlocked(unlockISO);

      button.disabled =
        !verified ||
        !dateUnlocked;

      button.classList.toggle(
        "unlocked",
        verified && dateUnlocked
      );

      if (!verified) {
        button.textContent =
          "LOCKED — JURISDICTION NOT YET ESTABLISHED";

        return;
      }

      if (!dateUnlocked) {
        button.textContent =
          "LOCKED — COMPLIANCE REQUIRED (DATE LOCK)";

        return;
      }

      button.textContent =
        `PLAY / ${track.toUpperCase()} — ACCESS GRANTED`;
    });
}

function openTrack(button) {
  const standing =
    getStanding();

  if (!standing?.verified) {
    setTerminal(lockMessage());
    fxGlitch();
    return;
  }

  const unlockISO =
    button.getAttribute(
      "data-unlock"
    ) || "";

  if (!isUnlocked(unlockISO)) {
    setTerminal(
      "ERROR: JURISDICTION NOT YET ESTABLISHED.\n" +
      "DATE LOCK ACTIVE."
    );

    fxGlitch();
    return;
  }

  const track =
    button.getAttribute(
      "data-track"
    );

  const embed =
    document.querySelector(
      `[data-embed="${CSS.escape(track)}"]`
    );

  if (embed) {
    embed.innerHTML =
      TRACK_EMBEDS[track]?.html ||
      `<div class="tiny muted">
        No embed configured.
      </div>`;

    embed.classList.add(
      "embed-active"
    );
  }

  setTerminal(
    `ACCESS GRANTED → ${String(
      track || "TRACK"
    ).toUpperCase()}\n` +
    "FILE ACCEPTED."
  );

  fxStamp(
    "AUDIO",
    "LOG",
    "OPENED"
  );
}


/* =========================================================
   19. THEME STORAGE + MIGRATION
   ========================================================= */

function loadThemeState() {
  let saved =
    localStorage.getItem(
      STORAGE.theme
    );

  if (saved === "euonia") {
    saved = "silver";

    localStorage.setItem(
      STORAGE.theme,
      "silver"
    );
  }

  STATE.theme =
    THEMES[saved]
      ? saved
      : "registry";

  STATE.unlockedThemes =
    new Set([
      "registry",
      "silver",
      ...readStoredArray(
        STORAGE.unlockedThemes
      ).filter((name) => THEMES[name]),
    ]);

  STATE.unlockedCommands =
    new Set(
      readStoredArray(
        STORAGE.unlockedCommands
      )
    );

  STATE.seenJurisdictionEvents =
    new Set(
      readStoredArray(
        STORAGE.jurisdictionEvents
      )
    );
}

function saveUnlockState() {
  saveSet(
    STORAGE.unlockedThemes,
    STATE.unlockedThemes
  );

  saveSet(
    STORAGE.unlockedCommands,
    STATE.unlockedCommands
  );

  saveSet(
    STORAGE.jurisdictionEvents,
    STATE.seenJurisdictionEvents
  );
}

function unlockTheme(themeName) {
  if (!THEMES[themeName]) return;

  const wasLocked =
    !STATE.unlockedThemes.has(
      themeName
    );

  STATE.unlockedThemes.add(
    themeName
  );

  saveUnlockState();
  updateThemeSelector();

  if (wasLocked) {
    fxStamp(
      THEMES[themeName].label,
      "ACCESS",
      "GRANTED"
    );
  }
}

function applyTheme(
  themeName,
  {
    animate = true,
    save = true,
  } = {}
) {
  if (!THEMES[themeName]) {
    themeName = "registry";
  }

  if (
    !STATE.unlockedThemes.has(
      themeName
    )
  ) {
    themeName = "registry";
  }

  STATE.theme =
    themeName;

  document.body.dataset.theme =
    themeName;

  document.body.classList.remove(
    "euonia"
  );

  const theme =
    THEMES[themeName];

  if (themeToggle) {
    themeToggle.textContent =
      theme.toggleLabel;

    themeToggle.dataset.activeTheme =
      themeName;

    themeToggle.title =
      `Current presentation: ${theme.label}. ` +
      "Tap to return. Hold for jurisdiction themes.";

    themeToggle.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  if (intakeTitle) {
    intakeTitle.textContent =
      theme.title;
  }

  if (intakeSubtitle) {
    intakeSubtitle.textContent =
      theme.subtitle;
  }

  if (subjectHeading) {
    subjectHeading.textContent =
      theme.subjectHeading;
  }

  if (musicHeading) {
    musicHeading.textContent =
      theme.musicHeading;
  }

  if (briefsLink) {
    briefsLink.textContent =
      theme.briefsLabel;

    briefsLink.dataset.hover =
      theme.briefsHover;
  }

  setStatus(
    Boolean(
      STATE.standing?.verified
    )
  );

  updateThemeSelector();
  updateThemeReveals();

  if (STATE.standing?.verified) {
    drawId(STATE.standing);
  } else {
    drawIdPlaceholder();
  }

  if (loreBar && !loreBar.hidden) {
    showRandomThemeLore();
  }

  if (animate) {
    fxThemeTransition(themeName);
  }

  if (save) {
    localStorage.setItem(
      STORAGE.theme,
      themeName
    );
  }
}


/* =========================================================
   20. THEME SELECTOR
   ========================================================= */

function buildThemeSelector() {
  const existing =
    document.getElementById(
      "themeSelector"
    );

  if (existing) {
    bindThemeOptionButtons(existing);
    return existing;
  }

  const selector =
    document.createElement("div");

  selector.id =
    "themeSelector";

  selector.className =
    "theme-selector";

  selector.hidden = true;

  selector.setAttribute(
    "aria-label",
    "Jurisdiction themes"
  );

  Object.entries(THEMES)
    .forEach(([name, theme]) => {
      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "theme-option";

      button.dataset.theme =
        name;

      button.textContent =
        theme.label;

      selector.appendChild(button);
    });

  const topbar =
    document.querySelector(
      ".topbar"
    );

  topbar?.insertAdjacentElement(
    "afterend",
    selector
  );

  bindThemeOptionButtons(selector);

  return selector;
}

function bindThemeOptionButtons(selector) {
  selector
    .querySelectorAll(
      ".theme-option"
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const themeName =
            button.dataset.theme;

          if (
            !STATE.unlockedThemes.has(
              themeName
            )
          ) {
            appendTerminalBlock(
              `${THEMES[themeName].label} REMAINS SEALED.\n` +
              "A RECOGNIZED PHRASE OR IDENTIFIER IS REQUIRED.",
              "denied"
            );

            fxGlitch();
            return;
          }

          applyTheme(themeName);
          closeThemeSelector();
        }
      );
    });
}

function updateThemeSelector() {
  const selector =
    document.getElementById(
      "themeSelector"
    );

  if (!selector) return;

  selector
    .querySelectorAll(
      ".theme-option"
    )
    .forEach((button) => {
      const themeName =
        button.dataset.theme;

      const unlocked =
        STATE.unlockedThemes.has(
          themeName
        );

      button.disabled =
        !unlocked;

      button.dataset.locked =
        String(!unlocked);

      button.dataset.active =
        String(
          STATE.theme === themeName
        );

      button.textContent =
        unlocked
          ? THEMES[themeName].label
          : `${THEMES[themeName].label} / SEALED`;
    });
}

function toggleThemeSelector(
  forceOpen = false
) {
  const selector =
    document.getElementById(
      "themeSelector"
    );

  if (!selector) return;

  selector.hidden =
    forceOpen
      ? false
      : !selector.hidden;

  themeToggle?.setAttribute(
    "aria-expanded",
    String(!selector.hidden)
  );
}

function closeThemeSelector() {
  const selector =
    document.getElementById(
      "themeSelector"
    );

  if (!selector) return;

  selector.hidden = true;

  themeToggle?.setAttribute(
    "aria-expanded",
    "false"
  );
}

function bindThemeToggle() {
  if (!themeToggle) return;

  themeToggle.addEventListener(
    "click",
    (event) => {
      event.preventDefault();

      const nextTheme =
        STATE.theme === "registry"
          ? "silver"
          : "registry";

      applyTheme(nextTheme);
    }
  );

  themeToggle.addEventListener(
    "pointerdown",
    () => {
      window.clearTimeout(
        STATE.themeHoldTimer
      );

      STATE.themeHoldTimer =
        window.setTimeout(() => {
          toggleThemeSelector(true);
        }, 700);
    }
  );

  [
    "pointerup",
    "pointercancel",
    "pointerleave",
  ].forEach((eventName) => {
    themeToggle.addEventListener(
      eventName,
      () => {
        window.clearTimeout(
          STATE.themeHoldTimer
        );
      }
    );
  });
}


/* =========================================================
   21. HIDDEN THEME CONTENT
   ========================================================= */

function updateThemeReveals() {
  document
    .querySelectorAll(
      "[data-visible-themes]"
    )
    .forEach((element) => {
      const themes =
        String(
          element.dataset.visibleThemes || ""
        )
          .split(/\s+/)
          .filter(Boolean);

      element.hidden =
        !themes.includes(
          STATE.theme
        );
    });

  document
    .querySelectorAll(
      "[data-requires-theme]"
    )
    .forEach((element) => {
      const required =
        element.dataset.requiresTheme;

      element.hidden =
        required !== STATE.theme;
    });

  document
    .querySelectorAll(
      "[data-requires-command]"
    )
    .forEach((element) => {
      const required =
        normalizeCommand(
          element.dataset.requiresCommand
        );

      element.hidden =
        !STATE.unlockedCommands.has(
          required
        );
    });
}


/* =========================================================
   22. TERMINAL INPUT
   ========================================================= */

function buildTerminalInput() {
  const terminal =
    terminalOut?.closest(
      ".terminal"
    );

  if (!terminal) return;

  let terminalForm =
    document.getElementById(
      "terminalForm"
    );

  if (!terminalForm) {
    terminalForm =
      document.createElement("form");

    terminalForm.id =
      "terminalForm";

    terminalForm.className =
      "terminal-command-form";

    terminalForm.innerHTML = `
      <label
        class="sr-only"
        for="terminalInput"
      >
        Enter Registry command
      </label>

      <span
        class="terminal-prompt"
        aria-hidden="true"
      >
        &gt;
      </span>

      <input
        id="terminalInput"
        class="terminal-input"
        type="text"
        autocomplete="off"
        autocapitalize="characters"
        spellcheck="false"
        maxlength="100"
        placeholder="ENTER COMMAND"
      />

      <button
        class="terminal-submit"
        type="submit"
      >
        EXECUTE
      </button>
    `;

    terminal.appendChild(
      terminalForm
    );
  }

  const terminalInput =
    document.getElementById(
      "terminalInput"
    );

  terminalForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const raw =
        terminalInput?.value || "";

      processTerminalCommand(raw);

      if (terminalInput) {
        terminalInput.value = "";
      }
    }
  );

  terminalInput?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveTerminalHistory(-1);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveTerminalHistory(1);
      }
    }
  );
}

function moveTerminalHistory(direction) {
  const input =
    document.getElementById(
      "terminalInput"
    );

  if (
    !input ||
    !STATE.terminalHistory.length
  ) {
    return;
  }

  STATE.terminalHistoryIndex +=
    direction;

  if (
    STATE.terminalHistoryIndex < 0
  ) {
    STATE.terminalHistoryIndex = 0;
  }

  if (
    STATE.terminalHistoryIndex >=
    STATE.terminalHistory.length
  ) {
    STATE.terminalHistoryIndex =
      STATE.terminalHistory.length;

    input.value = "";
    return;
  }

  input.value =
    STATE.terminalHistory[
      STATE.terminalHistoryIndex
    ];
}


/* =========================================================
   23. TERMINAL COMMAND RESULTS
   ========================================================= */

function recordCommand(command) {
  STATE.unlockedCommands.add(
    normalizeCommand(command)
  );

  saveUnlockState();
  updateThemeReveals();
}

function commandResult({
  text,
  unlockCommand = null,
  unlockTheme: themeUnlock = null,
  theme = null,
  jurisdiction = null,
}) {
  if (unlockCommand) {
    recordCommand(
      unlockCommand
    );
  }

  if (themeUnlock) {
    unlockTheme(
      themeUnlock
    );
  }

  if (
    theme &&
    STATE.unlockedThemes.has(theme)
  ) {
    applyTheme(theme);
  }

  if (text) {
    appendTerminalBlock(
      text,
      "success"
    );
  }

  if (jurisdiction) {
    showJurisdictionEvent(
      jurisdiction
    );
  }
}


/* =========================================================
   24. TERMINAL COMMAND DEFINITIONS
   ========================================================= */

const COMMANDS = {
  HELP() {
    return {
      text:
        "AVAILABLE COMMAND FAMILIES:\n" +
        "STATUS\n" +
        "VERIFY STANDING\n" +
        "LIST THEMES\n" +
        "SET THEME [NAME]\n" +
        "OPEN CASE [IDENTIFIER]\n" +
        "REQUEST LORE\n" +
        "CLEAR TERMINAL",
    };
  },

  STATUS() {
    return {
      text:
        `NODE: ACCESS-NODE-009\n` +
        `STANDING: ${
          STATE.standing?.verified
            ? "VERIFIED"
            : "UNVERIFIED"
        }\n` +
        `SUBJECT: ${
          STATE.standing?.name ||
          "UNFILED"
        }\n` +
        `THEME: ${
          THEMES[STATE.theme].label
        }\n` +
        `COMMAND DISCOVERIES: ${
          STATE.unlockedCommands.size
        }`,
    };
  },

  "VERIFY STANDING"() {
    document
      .getElementById("verify")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    window.setTimeout(() => {
      subjectName?.focus();
    }, 500);

    return {
      text:
        "INTAKE FORM LOCATED.\n" +
        "VOLUNTARY DECLARATION REQUIRED.\n" +
        "COERCED SIGNATURES WILL BE REJECTED.",
    };
  },

  "REQUEST LORE"() {
    const pool =
      THEME_LORE[STATE.theme] ||
      THEME_LORE.registry;

    const message =
      pool[
        Math.floor(
          Math.random() * pool.length
        )
      ];

    showLoreMessage(message);

    return {
      text:
        `INTERNAL RECORD:\n${message}`,
    };
  },

  "LIST THEMES"() {
    const lines =
      Object.keys(THEMES)
        .map((themeName) => {
          const unlocked =
            STATE.unlockedThemes.has(
              themeName
            );

          return (
            `${unlocked ? "[OPEN]" : "[SEALED]"} ` +
            THEMES[themeName].label
          );
        });

    return {
      text:
        "JURISDICTION PRESENTATIONS:\n" +
        lines.join("\n"),
    };
  },

  "CLEAR TERMINAL"() {
    clearTerminal();

    return {
      text: null,
    };
  },

  "STANDING VERIFIED"() {
    return {
      text:
        "PHRASE RECOGNIZED.\n" +
        "LIMITED CLAIMANT ACCESS CONFIRMED.",

      unlockCommand:
        "STANDING VERIFIED",
    };
  },

  "WE STAYED"() {
    return {
      text:
        "SURVIVOR PRESENTATION RECOGNIZED.\n" +
        "SILVER RECORD LAYER AVAILABLE.",

      unlockCommand:
        "WE STAYED",

      theme:
        "silver",
    };
  },

  "ALL PRESENT"() {
    return {
      text:
        "BLACKWATER RECOGNITION EVENT ACTIVE.\n" +
        "PASSENGER COUNT ACCEPTED.\n" +
        "HOUSE LIGHTS STILL ON.",

      unlockCommand:
        "ALL PRESENT",

      unlockTheme:
        "blackwater",

      theme:
        "blackwater",

      jurisdiction: {
        key:
          "blackwater-terminal-open",

        title:
          "BLACKWATER DIVISION",

        body:
          "THE ROUTE HAS RECOGNIZED YOUR PRESENCE.\n" +
          "DO NOT FOLLOW THE APPLAUSE.",

        stamp:
          "ALL PRESENT",
      },
    };
  },

  "THE ROUTE CONTINUES"() {
    return {
      text:
        "ROUTE MEMORY ACTIVE.\n" +
        "DESTINATION OMITTED.\n" +
        "PASSENGER STATUS RETAINED.",

      unlockCommand:
        "THE ROUTE CONTINUES",

      unlockTheme:
        "blackwater",
    };
  },

  "HOUSE LIGHTS STILL ON"() {
    return {
      text:
        "VENUE POWER DETECTED BELOW WATERLINE.\n" +
        "NO AUTHORIZED PERFORMANCE IS SCHEDULED.",

      unlockCommand:
        "HOUSE LIGHTS STILL ON",

      unlockTheme:
        "blackwater",
    };
  },

  "BEAUTY IS NOT PERMISSION"() {
    return {
      text:
        "BLOOMHOUSE SCRAP EG-013 RECOGNIZED.\n" +
        "INTERVENTION DOCTRINE AVAILABLE.",

      unlockCommand:
        "BEAUTY IS NOT PERMISSION",

      unlockTheme:
        "bloomhouse",

      theme:
        "bloomhouse",

      jurisdiction: {
        key:
          "bloomhouse-terminal-open",

        title:
          "BLOOMHOUSE",

        body:
          "CARE AUTHORITY RECOGNIZED.\n" +
          "OWNERSHIP AUTHORITY DENIED.",

        stamp:
          "INTERVENTION WITHOUT POSSESSION",
      },
    };
  },

  "PREVENTIVE BLOOM"() {
    return {
      text:
        "VE-001 DOCTRINE INDEXED.\n" +
        "RESPONSE MAY BEGIN BEFORE CATASTROPHE.",

      unlockCommand:
        "PREVENTIVE BLOOM",

      unlockTheme:
        "bloomhouse",

      theme:
        "bloomhouse",
    };
  },

  "CONSENT VERIFIED"() {
    return {
      text:
        "T.A.A. AXIOM ACCEPTED.\n" +
        "JURISDICTION MAY PROCEED.",

      unlockCommand:
        "CONSENT VERIFIED",

      unlockTheme:
        "taa",

      theme:
        "taa",

      jurisdiction: {
        key:
          "taa-terminal-open",

        title:
          "T.A.A. JURISDICTION",

        body:
          "CONSENT HAS BEEN ENTERED AS STRUCTURAL LAW.\n" +
          "ALL CONFLICTING CLAIMS ARE SUSPENDED.",

        stamp:
          "OWNERSHIP DENIED",
      },
    };
  },

  "UNANIMOUS OR NULL"() {
    return {
      text:
        "TRI-SEAL CONDITION RECOGNIZED.\n" +
        "PARTIAL AUTHORITY REJECTED.",

      unlockCommand:
        "UNANIMOUS OR NULL",

      unlockTheme:
        "taa",
    };
  },

  "POST AGAIN"() {
    return {
      text:
        "CULTURAL PROPAGATION SIGNAL ACQUIRED.\n" +
        "THE FIRST POST WAS RECEIVED.\n" +
        "IT WAS SIMPLY NOT DISTRIBUTED.",

      unlockCommand:
        "POST AGAIN",

      unlockTheme:
        "propagation",

      theme:
        "propagation",

      jurisdiction: {
        key:
          "propagation-terminal-open",

        title:
          "CULTURAL PROPAGATION DIVISION",

        body:
          "PUBLIC VISIBILITY HAS BEEN RECLASSIFIED\n" +
          "AS A MANAGED OUTCOME.",

        stamp:
          "NARRATIVE ALIGNED",
      },
    };
  },

  "CULTURAL PROPAGATION"() {
    return {
      text:
        "DIVISION IDENTIFIER RECOGNIZED.\n" +
        "AUTHORIZED MEDIA PRESENTATION AVAILABLE.",

      unlockCommand:
        "CULTURAL PROPAGATION",

      unlockTheme:
        "propagation",

      theme:
        "propagation",
    };
  },

  "BVF-10114"() {
    return {
      text:
        "IDENTIFIER RECOGNIZED.\n" +
        "ARCHIVE: BLACK VEIL FREQUENCY\n" +
        "CLASSIFICATION: POSTHUMOUS TRANSMISSION\n\n" +
        "The broadcast did not begin when the television was powered on.\n" +
        "It merely became visible.",

      unlockCommand:
        "BVF-10114",
    };
  },

  "TR-011"() {
    return {
      text:
        "TERMINAL RELAY 011 LOCATED.\n" +
        "STATUS: STILL RECEIVING\n\n" +
        "Personnel were instructed not to acknowledge\n" +
        "faces appearing between frames.",

      unlockCommand:
        "TR-011",
    };
  },

  "BLACK VEIL FREQUENCY"() {
    return {
      text:
        "PROJECT INDEX UNSEALED.\n\n" +
        "A signal dressed itself in mourning fabric\n" +
        "so the dead would recognize it as formal correspondence.",

      unlockCommand:
        "BLACK VEIL FREQUENCY",
    };
  },

  "THE VEIL IS LISTENING"() {
    return {
      text:
        "PHRASE ACCEPTED.\n\n" +
        "Microphone permission was never requested.\n" +
        "Audio collection began before your arrival.",

      unlockCommand:
        "THE VEIL IS LISTENING",
    };
  },

  "PS-014"() {
    return {
      text:
        "CASE PS-014 LOCATED.\n" +
        "DESIGNATION: THE BELL CLERK\n" +
        "CLAIMANT: ELIZABETH KURODA\n" +
        "RECONCILIATION: PENDING.",

      unlockCommand:
        "PS-014",
    };
  },

  "OPEN PS-014"() {
    revealElizabethDossier();

    return {
      text:
        "DOSSIER PS-014 RELEASED TO CURRENT VIEW.\n" +
        "RECONCILIATION REMAINS PENDING.",

      unlockCommand:
        "OPEN PS-014",
    };
  },
};


/* =========================================================
   25. TERMINAL COMMAND PROCESSOR
   ========================================================= */

const DENIED_RESPONSES = [
  "INPUT NOT RECOGNIZED.",
  "CLEARANCE INSUFFICIENT.",
  "THE ARCHIVE DECLINES TO ANSWER.",
  "NO FILE FOUND. SOMETHING FOUND YOU.",
  "COMMAND REJECTED BY ACTIVE JURISDICTION.",
  "THE REQUEST WAS RECEIVED FROM THE WRONG SIDE.",
  "SUBJECT IS TYPING FROM AN UNRECOGNIZED OUTCOME.",
  "THE FILE EXISTS. ACCESS DOES NOT.",
];

function processTerminalCommand(
  rawInput
) {
  const command =
    normalizeCommand(rawInput);

  if (!command) return;

  STATE.terminalHistory.push(
    command
  );

  STATE.terminalHistoryIndex =
    STATE.terminalHistory.length;

  appendTerminalBlock(
    `> ${command}`,
    "command"
  );

  const setThemeMatch =
    command.match(
      /^SET THEME\s+(.+)$/
    );

  if (setThemeMatch) {
    handleSetThemeCommand(
      setThemeMatch[1]
    );

    return;
  }

  const openCaseMatch =
    command.match(
      /^OPEN CASE\s+(.+)$/
    );

  if (openCaseMatch) {
    handleOpenCaseCommand(
      openCaseMatch[1]
    );

    return;
  }

  const handler =
    COMMANDS[command];

  if (!handler) {
    const denied =
      DENIED_RESPONSES[
        Math.floor(
          Math.random() *
          DENIED_RESPONSES.length
        )
      ];

    appendTerminalBlock(
      denied,
      "denied"
    );

    fxGlitch();
    return;
  }

  commandResult(
    handler()
  );
}

function handleSetThemeCommand(
  rawTheme
) {
  const requested =
    String(rawTheme || "")
      .trim()
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/\s+/g, " ");

  const aliases = {
    registry: "registry",
    default: "registry",

    silver: "silver",
    survivor: "silver",
    "we stayed": "silver",

    blackwater: "blackwater",
    midway: "blackwater",

    bloomhouse: "bloomhouse",
    bloom: "bloomhouse",

    taa: "taa",
    "the authority above": "taa",

    propagation: "propagation",
    "cultural propagation": "propagation",
    cpd: "propagation",
  };

  const themeName =
    aliases[requested];

  if (
    !themeName ||
    !THEMES[themeName]
  ) {
    appendTerminalBlock(
      "THEME IDENTIFIER NOT RECOGNIZED.",
      "denied"
    );

    fxGlitch();
    return;
  }

  if (
    !STATE.unlockedThemes.has(
      themeName
    )
  ) {
    appendTerminalBlock(
      `${THEMES[themeName].label} REMAINS SEALED.`,
      "denied"
    );

    fxGlitch();
    return;
  }

  applyTheme(themeName);

  appendTerminalBlock(
    `PRESENTATION CHANGED:\n${THEMES[themeName].label}`,
    "success"
  );
}

function handleOpenCaseCommand(
  rawCase
) {
  const requested =
    normalizeCommand(rawCase);

  const aliases = {
    "PS-014": "OPEN PS-014",
    "THE BELL CLERK": "OPEN PS-014",
    "ELIZABETH KURODA": "OPEN PS-014",
  };

  const command =
    aliases[requested];

  if (!command) {
    appendTerminalBlock(
      `CASE NOT LOCATED: ${requested}`,
      "denied"
    );

    fxGlitch();
    return;
  }

  commandResult(
    COMMANDS[command]()
  );
}


/* =========================================================
   26. DOSSIER ACCESS
   ========================================================= */

function revealElizabethDossier() {
  const dossier =
    document.querySelector(
      ".elizabeth-kuroda-file"
    );

  if (!dossier) return;

  dossier.hidden = false;

  window.setTimeout(() => {
    dossier.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    dossier.classList.add(
      "is-highlighted"
    );

    window.setTimeout(() => {
      dossier.classList.remove(
        "is-highlighted"
      );
    }, 2500);
  }, 300);
}


/* =========================================================
   27. JURISDICTION OVERLAY
   ========================================================= */

function showJurisdictionEvent({
  key = null,
  title,
  body,
  stamp,
  force = false,
}) {
  if (
    !jurisdictionEvent ||
    !jurisdictionTitle ||
    !jurisdictionBody ||
    !jurisdictionStamp
  ) {
    return;
  }

  if (
    key &&
    STATE.seenJurisdictionEvents.has(key) &&
    !force
  ) {
    return;
  }

  if (key) {
    STATE.seenJurisdictionEvents.add(
      key
    );

    saveUnlockState();
  }

  window.clearTimeout(
    STATE.jurisdictionCloseTimer
  );

  jurisdictionTitle.textContent =
    title || "JURISDICTION EVENT";

  jurisdictionBody.textContent =
    body || "";

  jurisdictionStamp.textContent =
    stamp || "FILED";

  jurisdictionEvent.hidden = false;

  jurisdictionEvent.setAttribute(
    "aria-hidden",
    "false"
  );

  window.requestAnimationFrame(() => {
    jurisdictionEvent.classList.add(
      "is-visible"
    );
  });

  STATE.jurisdictionCloseTimer =
    window.setTimeout(() => {
      closeJurisdictionEvent();
    }, 5200);
}

function closeJurisdictionEvent() {
  if (
    !jurisdictionEvent ||
    jurisdictionEvent.hidden
  ) {
    return;
  }

  window.clearTimeout(
    STATE.jurisdictionCloseTimer
  );

  jurisdictionEvent.classList.remove(
    "is-visible"
  );

  window.setTimeout(() => {
    jurisdictionEvent.hidden = true;

    jurisdictionEvent.setAttribute(
      "aria-hidden",
      "true"
    );
  }, 340);
}


/* =========================================================
   28. MILESTONE JURISDICTION EVENTS
   ========================================================= */

function maybeJurisdictionEvent(
  triggerCount
) {
  const count =
    Number(
      triggerCount ||
      getCounter()
    );

  const hit =
    count !== 0 &&
    (
      count % 10 === 0 ||
      count % 15 === 0
    );

  if (!hit) return;

  const events = [
    {
      who: "AURORA VALE",
      title: "SEAM INTERVENTION",

      body:
        "Thread authority applied. " +
        "Reality is splitting at the edges. " +
        "Do not accept unnamed contracts.",

      stamp: "SEAM STITCHED",

      fx() {
        fxSeamSweep();

        fxStamp(
          "THREAD AUTHORITY",
          "SEAM",
          "STITCHED"
        );
      },
    },

    {
      who: "ELOWEN",
      title: "GROUND TRUTH LOCK",

      body:
        "Containment geometry deployed. " +
        "The lie loses traction. " +
        "The floor stops shifting.",

      stamp: "GEOMETRY SET",

      fx() {
        fxGeometry();

        fxStamp(
          "GROUND TRUTH",
          "LOCK",
          "SET"
        );
      },
    },

    {
      who: "KATELYN",
      title: "COUNSEL OF TRUTH",

      body:
        "Ownership claims challenged. " +
        "Standing requires clean consent. " +
        "Burden of proof rejected.",

      stamp: "CLAIM VOID",

      fx() {
        fxStamp(
          "COUNSEL",
          "CLAIM",
          "VOID"
        );
      },
    },

    {
      who: "SERAPHINE",
      title: "THORN SHIELD",

      body:
        "Protective lattice engaged. " +
        "Mercy with boundaries. " +
        "No entry without permission.",

      stamp: "CONSENT VERIFIED",

      fx() {
        fxStamp(
          "SANCTUM",
          "CONSENT",
          "VERIFIED"
        );
      },
    },

    {
      who: "SAYA",
      title: "LIMINAL WARNING",

      body:
        "You are near the threshold. " +
        "If the room feels kind, " +
        "check the fine print.",

      stamp: "OWNERSHIP DENIED",

      fx() {
        fxSeamSweep();

        fxStamp(
          "LIMINAL",
          "OWNERSHIP",
          "DENIED"
        );
      },
    },

    {
      who: "ASTRAEA",
      title: "VERDICT DROP",

      body:
        "Appeal denied. " +
        "Coercion collapses standing. " +
        "The system remembers what it tried to do.",

      stamp: "FINAL",

      fx() {
        fxStamp(
          "COURT",
          "APPEAL",
          "DENIED"
        );
      },
    },

    {
      who: "CLAUDIA",
      title: "FIELD PATCH",

      body:
        "Emergency consent bandage applied. " +
        "Ugly. Temporary. Functional. " +
        "Keeps the floor from falling out.",

      stamp: "PATCHED",

      fx() {
        fxGeometry();

        fxStamp(
          "LOOMWRIGHT",
          "PATCH",
          "APPLIED"
        );
      },
    },
  ];

  const pick =
    events[
      Math.floor(
        Math.random() * events.length
      )
    ];

  appendTerminalBlock(
    `JURISDICTION EVENT / ${pick.who}\n` +
    `ACTION: ${pick.title}\n` +
    `STAMP: ${pick.stamp}`,
    "success"
  );

  try {
    pick.fx();
  } catch {
    /* FX failure does not stop the filing. */
  }

  showJurisdictionEvent({
    key:
      `milestone-${count}-${pick.who}`,

    title:
      `${pick.who} / ${pick.title}`,

    body:
      pick.body,

    stamp:
      pick.stamp,
  });
}


/* =========================================================
   29. FORM VERIFICATION
   ========================================================= */

async function submitVerification() {
  if (formError) {
    formError.textContent = "";
  }

  const name =
    String(
      subjectName?.value || ""
    ).trim();

  const reference =
    String(
      caseTag?.value || ""
    ).trim();

  const consent =
    Boolean(
      consentCheck?.checked
    );

  if (!name) {
    if (formError) {
      formError.textContent =
        "ERROR: SUBJECT NAME REQUIRED.";
    }

    subjectName?.focus();
    fxGlitch();
    return;
  }

  if (!consent) {
    if (formError) {
      formError.textContent =
        "ERROR: VOLUNTARY CONSENT REQUIRED.";
    }

    consentCheck?.focus();
    fxGlitch();
    return;
  }

  await runScan(name);

  const previouslyVerified =
    Boolean(
      getStanding()?.verified
    );

  const standing =
    setStanding({
      name,
      caseTag:
        reference ||
        "REG-U / INTAKE / 0009",
    });

  const newCount =
    previouslyVerified
      ? getCounter()
      : bumpCounter();

  setStatus(true);
  drawId(standing);
  unlockButtons();

  recordCommand(
    "STANDING VERIFIED"
  );

  fxSeamSweep();
  fxGeometry();

  fxStamp(
    "REG-U / FILE",
    "STANDING",
    "VERIFIED"
  );

  appendTerminal(
    `RECORD: ISSUED ${nowLocalStamp()}`
  );

  const fragment =
    maybeCaseFragment({
      name,
      caseTag: reference,
    });

  if (fragment) {
    appendTerminal(fragment);
  }

  showRandomThemeLore();

  maybeJurisdictionEvent(
    newCount
  );
}


/* =========================================================
   30. RESET
   ========================================================= */

async function resetStanding() {
  const approved =
    window.confirm(
      "RESET LOCAL STANDING TOKEN?\n\n" +
      "Theme and terminal discoveries will remain filed."
    );

  if (!approved) return;

  clearStanding();

  form?.reset();

  if (formError) {
    formError.textContent = "";
  }

  if (downloadBtn) {
    downloadBtn.disabled = true;
  }

  setStatus(false);
  drawIdPlaceholder();
  unlockButtons();
  hideLoreBar();

  await runBootSequence();
}


/* =========================================================
   31. MAIN EVENT BINDING
   ========================================================= */

function bindEvents() {
  if (verifyBtn) {
    verifyBtn.addEventListener(
      "click",
      () => {
        document
          .getElementById("verify")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

        setTerminal(
          "INTAKE FORM READY.\n" +
          "VOLUNTARY STANDING DECLARATION REQUIRED."
        );

        window.setTimeout(() => {
          subjectName?.focus();
        }, 450);
      }
    );
  }

  resetBtn?.addEventListener(
    "click",
    resetStanding
  );

  form?.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();
      await submitVerification();
    }
  );

  downloadBtn?.addEventListener(
    "click",
    () => {
      const standing =
        getStanding();

      if (!standing?.verified) {
        return;
      }

      downloadId(
        standing.name
      );
    }
  );

  document.addEventListener(
    "click",
    (event) => {
      const playButton =
        event.target.closest(
          ".btn.play"
        );

      if (playButton) {
        openTrack(playButton);
        return;
      }

      const archiveLink =
        event.target.closest(
          ".archive-link"
        );

      if (archiveLink) {
        event.preventDefault();

        const url =
          archiveLink.href;

        const mediaClass =
          archiveLink.dataset.class ||
          "EXTERNAL ARCHIVE";

        setTerminal(
          "REQUEST RECEIVED...\n\n" +
          "MEDIA CLASSIFICATION:\n" +
          `${mediaClass}\n\n` +
          "AUTHORITY:\n" +
          "REG-U\n\n" +
          "COPY STATUS:\n" +
          "AUTHORIZED\n\n" +
          "VERIFYING JURISDICTION...\n\n" +
          "OPENING ARCHIVE..."
        );

        fxStamp(
          "MEDIA",
          "ACCESS",
          "AUTHORIZED"
        );

        window.setTimeout(() => {
          window.open(
            url,
            "_blank",
            "noopener,noreferrer"
          );
        }, 900);
      }
    }
  );

  jurisdictionEvent?.addEventListener(
    "click",
    closeJurisdictionEvent
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        closeThemeSelector();
        closeJurisdictionEvent();
      }
    }
  );
}


/* =========================================================
   32. SESSION RESTORATION
   ========================================================= */

function restoreStandingSession() {
  STATE.standing =
    getStanding();

  const verified =
    Boolean(
      STATE.standing?.verified
    );

  setStatus(verified);

  if (!verified) {
    drawIdPlaceholder();
    return false;
  }

  if (subjectName) {
    subjectName.value =
      STATE.standing.name || "";
  }

  if (caseTag) {
    caseTag.value =
      STATE.standing.caseTag || "";
  }

  if (consentCheck) {
    consentCheck.checked = true;
  }

  setTerminal(
    "REG-U / SCAN / RESUME\n" +
    `SUBJECT: ${String(
      STATE.standing.name || "UNKNOWN"
    ).toUpperCase()}\n` +
    "STATUS: STANDING VERIFIED\n" +
    "STAMP: FILE ACCEPTED"
  );

  drawId(STATE.standing);
  showRandomThemeLore();

  fxStamp(
    "REG-U",
    "SESSION",
    "RESUMED"
  );

  return true;
}


/* =========================================================
   33. INITIALIZATION
   ========================================================= */

async function initializeAccessNode() {
  loadThemeState();

  buildThemeSelector();
  buildTerminalInput();

  bindThemeToggle();
  bindEvents();

  updateCounterDisplay();

  applyTheme(
    STATE.theme,
    {
      animate: false,
      save: false,
    }
  );

  fxAmbientSeams();

  const resumed =
    restoreStandingSession();

  unlockButtons();
  updateThemeReveals();
  updateThemeSelector();

  if (!resumed) {
    hideLoreBar();
    await runBootSequence();
  }
}


/* =========================================================
   34. BOOT
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {
    initializeAccessNode()
      .catch((error) => {
        console.error(
          "ACCESS-NODE-009 initialization failure:",
          error
        );

        setTerminal(
          "REG-U / NODE FAILURE\n" +
          "INTERFACE CONTROLLER DID NOT COMPLETE INITIALIZATION.\n" +
          "CHECK DEVELOPMENT CONSOLE."
        );
      });
  }
);


/* =========================================================
   35. OPTIONAL DEVELOPMENT ACCESS

   This exposes limited controls in the browser console.
   It can help during testing.

   Example:
   ACCESS_NODE_009.setTheme("blackwater")
   ACCESS_NODE_009.unlockTheme("blackwater")
   ACCESS_NODE_009.command("ALL PRESENT")
   ========================================================= */

window.ACCESS_NODE_009 = {
  getState() {
    return {
      standing:
        STATE.standing,

      theme:
        STATE.theme,

      unlockedThemes:
        [...STATE.unlockedThemes],

      unlockedCommands:
        [...STATE.unlockedCommands],

      counter:
        getCounter(),
    };
  },

  setTheme(themeName) {
    applyTheme(themeName);
  },

  unlockTheme(themeName) {
    unlockTheme(themeName);
  },

  command(commandText) {
    processTerminalCommand(
      commandText
    );
  },

  resetStanding() {
    return resetStanding();
  },
};
