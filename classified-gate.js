(() => {
  "use strict";

  const KEY = "an009_classified_ack_v1";
  if (sessionStorage.getItem(KEY) === "accepted") return;

  const style = document.createElement("style");
  style.textContent = `
    html.an009-classified-open,
    html.an009-classified-open body { overflow: hidden !important; }
    .an009-classified-gate {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      display: grid;
      place-items: center;
      padding: 22px;
      background:
        radial-gradient(circle at 50% 24%, rgba(151,115,48,.13), transparent 32%),
        linear-gradient(rgba(3,4,4,.94), rgba(2,3,3,.985));
      color: #d7ceb5;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      opacity: 1;
      transition: opacity .28s ease;
    }
    .an009-classified-gate.is-closing { opacity: 0; pointer-events: none; }
    .an009-classified-gate::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: .16;
      background-image: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 4px);
    }
    .an009-classified-panel {
      position: relative;
      width: min(680px, 100%);
      border: 1px solid rgba(190,151,67,.6);
      box-shadow: 0 28px 90px rgba(0,0,0,.72), inset 0 0 0 1px rgba(255,255,255,.025);
      background: linear-gradient(180deg, rgba(20,20,16,.98), rgba(8,9,8,.99));
      padding: clamp(24px, 5vw, 48px);
    }
    .an009-classified-kicker {
      color: #d0a33d;
      letter-spacing: .22em;
      font-size: .72rem;
      font-weight: 800;
      margin-bottom: 18px;
    }
    .an009-classified-panel h1 {
      margin: 0 0 16px;
      color: #efe7d1;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(2rem, 7vw, 4.1rem);
      line-height: .95;
      font-weight: 700;
    }
    .an009-classified-panel h1 span { color: #a2232d; }
    .an009-classified-lead {
      margin: 22px 0;
      color: #c7bea7;
      font-size: clamp(.95rem, 2vw, 1.06rem);
      line-height: 1.65;
    }
    .an009-classified-notice {
      border-left: 3px solid #d0a33d;
      margin: 24px 0;
      padding: 13px 15px;
      background: rgba(208,163,61,.055);
      color: #e5dcc3;
      line-height: 1.55;
      font-size: .9rem;
    }
    .an009-classified-warning {
      margin: 0 0 26px;
      color: #a99f87;
      font-size: .78rem;
      line-height: 1.6;
    }
    .an009-classified-actions { display: flex; gap: 10px; flex-wrap: wrap; }
    .an009-classified-actions button {
      appearance: none;
      border: 1px solid rgba(208,163,61,.55);
      background: #171711;
      color: #d8cfb7;
      padding: 12px 16px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: .11em;
      font: 800 .72rem ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .an009-classified-actions button[data-enter] {
      background: linear-gradient(180deg, #4b3c18, #2d260f);
      border-color: #d0a33d;
      color: #fff5d8;
    }
    .an009-classified-actions button:hover { filter: brightness(1.12); }
    .an009-classified-foot {
      margin-top: 22px;
      padding-top: 16px;
      border-top: 1px solid rgba(208,163,61,.18);
      color: #77705f;
      font-size: .65rem;
      line-height: 1.5;
      letter-spacing: .04em;
    }
    @media (max-width: 520px) {
      .an009-classified-gate { padding: 14px; }
      .an009-classified-panel { padding: 25px 21px; }
      .an009-classified-actions { display: grid; }
      .an009-classified-actions button { width: 100%; }
    }
  `;
  document.head.appendChild(style);

  const gate = document.createElement("div");
  gate.className = "an009-classified-gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.setAttribute("aria-labelledby", "an009-warning-title");
  gate.innerHTML = `
    <section class="an009-classified-panel">
      <div class="an009-classified-kicker">REG-U // ACCESS-NODE-009 // RESTRICTED ARCHIVE</div>
      <h1 id="an009-warning-title">CLASSIFIED<br><span>ACCESS WARNING</span></h1>
      <p class="an009-classified-lead">
        You are attempting to enter a restricted Registry archive containing unresolved claimant records,
        anomalous case material, jurisdictional doctrine, and narrative evidence with disputed continuity.
      </p>
      <div class="an009-classified-notice">
        DO NOT ASSUME A RECORD IS INACTIVE BECAUSE IT IS CLOSED.<br>
        DO NOT ASSUME A FILE IS CORRECT BECAUSE IT IS COMPLETE.
      </div>
      <p class="an009-classified-warning">
        Proceeding acknowledges voluntary access to classified fictional archive material. Some records may alter presentation according to active jurisdiction and previously recognized standing.
      </p>
      <div class="an009-classified-actions">
        <button type="button" data-enter>ENTER CLASSIFIED SITE</button>
        <button type="button" data-leave>DECLINE ACCESS</button>
      </div>
      <div class="an009-classified-foot">
        LOCAL SESSION NOTICE // This acknowledgement is stored only for the current browser session. This gate does not collect login credentials.
      </div>
    </section>
  `;

  document.documentElement.classList.add("an009-classified-open");
  document.body.appendChild(gate);

  const enter = gate.querySelector("[data-enter]");
  const leave = gate.querySelector("[data-leave]");

  enter?.addEventListener("click", () => {
    sessionStorage.setItem(KEY, "accepted");
    gate.classList.add("is-closing");
    window.setTimeout(() => {
      gate.remove();
      document.documentElement.classList.remove("an009-classified-open");
    }, 290);
  });

  leave?.addEventListener("click", () => {
    if (history.length > 1) {
      history.back();
      return;
    }
    location.replace("about:blank");
  });
})();
