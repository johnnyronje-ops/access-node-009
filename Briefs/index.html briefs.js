<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>REG-U Case File PS-014 // Elizabeth Kuroda</title>
  <style>
    :root {
      --paper: #d5c8a5;
      --paper-dark: #9f9271;
      --ink: #1b1a16;
      --red: #7b1515;
      --amber: #b78b33;
      --black: #080807;
      --panel: rgba(20, 18, 15, 0.92);
      --ghost: rgba(255, 244, 198, 0.08);
    }

    * { box-sizing: border-box; }

    body {
      margin: 0;
      background:
        radial-gradient(circle at 30% 10%, rgba(183,139,51,0.14), transparent 28%),
        linear-gradient(180deg, #050505 0%, #11100d 45%, #050505 100%);
      color: var(--ink);
      font-family: "Courier New", Courier, monospace;
      line-height: 1.55;
    }

    .archive-shell {
      width: min(1180px, 94vw);
      margin: 32px auto;
      border: 2px solid #2b261c;
      background:
        linear-gradient(rgba(213,200,165,0.90), rgba(191,176,137,0.90)),
        repeating-linear-gradient(0deg, transparent 0 18px, rgba(0,0,0,0.03) 19px 20px);
      box-shadow: 0 0 50px rgba(0,0,0,0.75), inset 0 0 90px rgba(0,0,0,0.20);
      position: relative;
      overflow: hidden;
    }

    .archive-shell:before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 18% 14%, rgba(0,0,0,0.16), transparent 14%),
        radial-gradient(circle at 82% 72%, rgba(0,0,0,0.14), transparent 18%),
        linear-gradient(90deg, rgba(0,0,0,0.08), transparent 20%, transparent 80%, rgba(0,0,0,0.12));
      pointer-events: none;
      mix-blend-mode: multiply;
    }

    header {
      position: relative;
      padding: 28px 34px 18px;
      border-bottom: 5px double #221f17;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: end;
    }

    .regu { font-size: clamp(32px, 4vw, 56px); letter-spacing: 0.06em; font-weight: 900; }
    .subhead { font-size: 13px; text-transform: uppercase; letter-spacing: 0.13em; }
    .stamp {
      border: 3px solid var(--red);
      color: var(--red);
      padding: 12px 16px;
      transform: rotate(-2deg);
      font-weight: 900;
      text-align: center;
      font-size: 22px;
      text-transform: uppercase;
      box-shadow: inset 0 0 0 2px rgba(123,21,21,0.25);
    }

    .case-grid {
      position: relative;
      display: grid;
      grid-template-columns: 310px 1fr;
      min-height: 100vh;
    }

    aside {
      border-right: 2px solid #2b261c;
      padding: 28px 22px;
      background: rgba(155,143,107,0.34);
    }

    .field { margin-bottom: 22px; }
    .label { font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
    .value { font-size: 18px; font-weight: 800; }
    .small { font-size: 12px; }

    main { padding: 30px; }

    .warning {
      background: var(--panel);
      color: #e7d9ad;
      border: 1px solid #5f563e;
      padding: 22px;
      margin-bottom: 28px;
      box-shadow: inset 0 0 32px rgba(0,0,0,0.55);
    }

    .warning h1 {
      margin: 0 0 10px;
      color: #f3d879;
      font-size: clamp(28px, 4vw, 48px);
      line-height: 1.05;
      letter-spacing: 0.02em;
    }

    .cold-open {
      font-size: clamp(19px, 2.3vw, 28px);
      font-weight: 900;
      color: #f4e6b6;
      border-left: 6px solid var(--amber);
      padding-left: 18px;
      margin-top: 18px;
    }

    .chapter {
      margin: 28px 0;
      border: 2px solid #312c21;
      background:
        linear-gradient(90deg, rgba(255,255,255,0.08), transparent 24%),
        rgba(231,218,177,0.68);
      padding: 24px;
      position: relative;
    }

    .chapter:after {
      content: attr(data-status);
      position: absolute;
      top: 10px;
      right: 12px;
      color: rgba(123,21,21,0.85);
      font-weight: 900;
      border: 1px solid rgba(123,21,21,0.42);
      padding: 2px 8px;
      font-size: 11px;
      transform: rotate(1deg);
    }

    h2 {
      margin: 0 0 14px;
      font-size: 24px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #100f0b;
      border-bottom: 1px solid rgba(0,0,0,0.38);
      padding-bottom: 8px;
      max-width: 78%;
    }

    p { margin: 0 0 14px; }
    .note {
      background: rgba(0,0,0,0.08);
      border-left: 4px solid var(--red);
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 700;
    }

    .transmission {
      color: #271d11;
      background: rgba(183,139,51,0.17);
      border: 1px dashed #5d4520;
      padding: 12px 14px;
      font-size: 14px;
    }

    .footer-doctrine {
      margin: 36px 0 6px;
      border-top: 4px double #221f17;
      padding-top: 18px;
      font-weight: 900;
      text-transform: uppercase;
      color: var(--red);
      text-align: center;
      letter-spacing: 0.08em;
    }

    @media (max-width: 820px) {
      header { grid-template-columns: 1fr; }
      .case-grid { grid-template-columns: 1fr; }
      aside { border-right: 0; border-bottom: 2px solid #2b261c; }
      h2 { max-width: 100%; }
      .chapter:after { position: static; display: inline-block; margin-bottom: 10px; }
    }
  </style>
</head>
<body>
  <article class="archive-shell">
    <header>
      <div>
        <div class="regu">REG-U</div>
        <div class="subhead">Reality Evaluation & Governance Unit // Information / Records / Reconciliation</div>
      </div>
      <div class="stamp">CASE ACTIVE<br />DO NOT RING</div>
    </header>

    <section class="case-grid">
      <aside>
        <div class="field"><div class="label">Subject File</div><div class="value">PS-014</div></div>
        <div class="field"><div class="label">Processing Subject</div><div class="value">Elizabeth Kuroda</div></div>
        <div class="field"><div class="label">Alias</div><div class="value">The Bloodhound</div></div>
        <div class="field"><div class="label">Case Title</div><div class="value">The Bell Clerk: Reconciliation Pending</div></div>
        <div class="field"><div class="label">Origin Threat</div><div class="value">Moon’s Eye Organization</div></div>
        <div class="field"><div class="label">Primary Device</div><div class="value">LTR-3 Liminal Thread Recorder</div></div>
        <div class="field"><div class="label">Inventor</div><div class="value">Claudia Loomwright</div></div>
        <div class="field"><div class="label">Missing Contact</div><div class="value">Reina Kuroda</div></div>
        <div class="field"><div class="label">Classification</div><div class="value">Procedural Horror / Dossier Narrative</div></div>
        <div class="field small"><div class="label">Registry Doctrine</div>Memory is a record. Records require order. Order requires witnesses.</div>
      </aside>

      <main>
        <section class="warning">
          <h1>THE CITY DID NOT CONTAIN MONSTERS.<br />IT CONTAINED THEIR PAPERWORK.</h1>
          <div class="cold-open">Elizabeth Kuroda did not escape the Moon’s Eye. She escaped the room where it was watching her. Three blocks later, the city began correcting the mistake.</div>
        </section>

        <section class="chapter" data-status="INTAKE 01">
          <h2>Chapter 01 // The Room Without Corners</h2>
          <p>The Moon’s Eye safehouse had no clocks, no windows, and no visible door from the inside. Elizabeth Kuroda found the exit by noticing what the room refused to reflect: her cigarette smoke bent left whenever she passed the south wall.</p>
          <p>She had been held for thirty-six hours. Long enough for the organization to ask about Reina, her missing sister, seventeen different ways. Long enough for Elizabeth to lie seventeen different ways back.</p>
          <p>On the table sat Claudia Loomwright’s parting gift: a black cassette-sized instrument wrapped in brass wire and stitched velvet. The LTR-3 Liminal Thread Recorder. Claudia had shoved it into Elizabeth’s coat the night everything went bad and said, “When the world starts pretending it is normal, record what it forgets to hide.”</p>
          <div class="note">Recovered Note: Subject escaped before formal termination protocol. Moon’s Eye observers reported “hallway disagreement” before loss of visual.</div>
        </section>

        <section class="chapter" data-status="INTAKE 02">
          <h2>Chapter 02 // Three Blocks Later</h2>
          <p>Rain flattened the city into neon grease. Elizabeth ran until her lungs tasted like pennies and found herself outside an office she had never seen, under a sign that read: INFORMATION / RECORDS / RECONCILIATION.</p>
          <p>The door opened before she touched it. That was the first mistake. Doors that open by themselves are either expensive or hungry, and this one looked broke.</p>
          <p>Inside, a receptionist sat behind a counter. Not a woman. Not a man. A coat, a tie, a service bell, and a head made from stacked filing cabinets. Its drawer labels shifted as Elizabeth watched: BIRTH CERTIFICATES. TRAUMA DUPLICATES. UNRESOLVED SIBLINGS. FALSE ESCAPES.</p>
          <p>The Bell Clerk raised one hand and tapped the brass bell once.</p>
          <div class="transmission">LTR-3 INTERFERENCE: “Liz—don’t answer it by name.”</div>
        </section>

        <section class="chapter" data-status="RECONCILIATION">
          <h2>Chapter 03 // Form RU-87B</h2>
          <p>“State your purpose in numeric terms,” the clerk printed across a wall-mounted slate without moving.</p>
          <p>Elizabeth looked for exits. There were six, but each had been stamped CLOSED FOR ACCURACY. Behind her, the street had become a hallway lined with cabinets. The Moon’s Eye men were gone. Their footprints remained, each one tagged, dated, and cross-referenced.</p>
          <p>She picked up the form on the counter. It asked for her name, her reason for arrival, her last confirmed memory, and the number of people she had failed to save. The last field had too many boxes.</p>
          <p>Elizabeth wrote: ONE.</p>
          <p>The Bell Clerk rang again. A drawer opened in its face.</p>
          <div class="note">Behavioral Finding: PS-014 resists institutional framing but responds to familial triggers.</div>
        </section>

        <section class="chapter" data-status="CONTACT TRACE">
          <h2>Chapter 04 // Reina on the Static</h2>
          <p>The LTR-3 warmed in Elizabeth’s pocket. She ducked behind a cabinet row while the building rearranged itself with the patience of an accountant.</p>
          <p>She flipped the device open. Its tiny spool turned with no tape loaded. Claudia had said liminal contact never sounded clean. “If you hear someone you love, assume the signal is bleeding through three lies and one door.”</p>
          <p>“Reina,” Elizabeth whispered.</p>
          <p>Static answered first. Then breath. Then the voice of a girl Elizabeth had not heard clearly in years.</p>
          <p>“You’re in the place after the crime,” Reina said. “Not the crime. The after.”</p>
          <div class="transmission">LTR-3 CONTACT: REINA KURODA // COHERENCE 14% // WARNING: SISTERHOOD MAY BE USED AS ROUTE BAIT.</div>
        </section>

        <section class="chapter" data-status="ENTITY SIGHTING">
          <h2>Chapter 05 // The Carbon Mother</h2>
          <p>The first real scream came from the family archive.</p>
          <p>Elizabeth found a woman-shaped figure standing beneath a fluorescent light, draped in birth certificates, custody papers, adoption files, and death records. Her body shed copies that crawled across the floor like exhausted moths.</p>
          <p>“She catalogues what families owe each other,” Reina said through the recorder. “Don’t let her touch your ID.”</p>
          <p>The Carbon Mother extended one paper-clad hand. The gesture was almost kind. That made it worse. Monsters lunged. This thing offered comfort with the confidence of a court order.</p>
          <p>Elizabeth backed away, but the copy at her feet already had her face.</p>
        </section>

        <section class="chapter" data-status="DUPLICATION EVENT">
          <h2>Chapter 06 // A Copy That Knows Your Birthday</h2>
          <p>The duplicate was incomplete from the waist down, but it smiled with Elizabeth’s mouth and said, “I can find Reina for you.”</p>
          <p>That was the second mistake. Anyone who offered Reina too quickly was either lying or employed.</p>
          <p>Elizabeth lit a cigarette and pressed the burning tip against the copy’s cheek. Carbon paper curled. The duplicate did not scream. It printed.</p>
          <p>HER ANGER IS OLDER THAN HER EVIDENCE.</p>
          <p>“Cute,” Elizabeth said. “Put that on my business card.”</p>
          <div class="note">Registry Note: Humor functions as resistance behavior. Do not mistake sarcasm for emotional stability.</div>
        </section>

        <section class="chapter" data-status="ROUTE FINALIZATION">
          <h2>Chapter 07 // Corridor Warden</h2>
          <p>The hallway ahead flashed yellow.</p>
          <p>A tall figure stepped from the dark wearing a ruined archival coat and a surveillance camera for a head. It dragged a heavy authorization stamp across the tile. Wherever the stamp struck, the floor accepted the decision. APPROVED. APPROVED. APPROVED.</p>
          <p>The corridor narrowed behind each impact. Escape was not blocked. It was administratively revoked.</p>
          <p>Elizabeth raised her pistol. The Warden’s camera clicked once. A yellow square locked around her face.</p>
          <p>“Employment status,” the Warden projected onto the wall. “Pending.”</p>
        </section>

        <section class="chapter" data-status="MOON’S EYE TRACE">
          <h2>Chapter 08 // Men Who Thought They Were Hunters</h2>
          <p>The Moon’s Eye entered the facility six minutes after Elizabeth.</p>
          <p>They came with black coats, suppressed weapons, and the arrogant silence of men who had never been processed. Their leader, Mr. Voss, stepped over a trail of family records and ordered his team to retrieve “the girl and the device.”</p>
          <p>The Corridor Warden turned toward them.</p>
          <p>Voss smiled. “We don’t answer to local systems.”</p>
          <p>The stamp came down.</p>
          <p>For a moment, every man in the hallway became a laminated badge hanging from the Warden’s wrist.</p>
          <div class="note">Observation: External organizations retain confidence until converted into supporting documentation.</div>
        </section>

        <section class="chapter" data-status="AUDIT OPENED">
          <h2>Chapter 09 // The Auditor Calculates</h2>
          <p>The archive’s lights dimmed. A new sound entered the building: receipt paper printing from somewhere deep in the walls.</p>
          <p>The Auditor sat in a room full of ledgers, faceless beneath a curtain of receipts. It wrote with one hand and calculated with the other. Elizabeth saw categories she hated immediately: WORDS UNSPOKEN, PROMISES BROKEN, PEOPLE HURT, LOVE IGNORED, GOOD DEEDS UNCLAIMED.</p>
          <p>Her file was already open.</p>
          <p>Under DEBT, Reina’s name appeared without a number beside it.</p>
          <p>The Auditor printed one phrase: BALANCE IS NOT OPTIONAL.</p>
        </section>

        <section class="chapter" data-status="SISTER SIGNAL">
          <h2>Chapter 10 // Reina Lies Badly</h2>
          <p>“I’m fine,” Reina said through the LTR-3.</p>
          <p>Elizabeth almost laughed. Reina had never been good at lying. As a kid, she smiled too hard. As a signal, she distorted around the edges.</p>
          <p>“Where are you?” Elizabeth asked.</p>
          <p>“Between the shelves.”</p>
          <p>“Which shelves?”</p>
          <p>“The ones they use for people no one finished missing.”</p>
          <p>Elizabeth closed her eyes. Grief sharpened into something usable. “Then keep talking. I’ll follow the damage.”</p>
          <div class="transmission">LTR-3 WARNING: EMOTIONAL PROXIMITY INCREASES ROUTE STABILITY.</div>
        </section>

        <section class="chapter" data-status="WITNESS REMOVED">
          <h2>Chapter 11 // The Lost Witness</h2>
          <p>She found the Lost Witness in a chamber where testimony hung like wet laundry.</p>
          <p>The entity was tall, hollow-faced, and covered in tags. It carried a lantern full of recovered objects: a child’s shoe, a cracked tape recorder, a teddy bear, three wedding rings, and one blood-dark camera lens.</p>
          <p>It did not attack. It waited.</p>
          <p>Elizabeth understood waiting. She had built a career out of standing in the places where answers were supposed to arrive.</p>
          <p>The Lost Witness raised the lantern. Inside it, something knocked back.</p>
        </section>

        <section class="chapter" data-status="EVIDENCE LANTERN">
          <h2>Chapter 12 // The Shoe in the Lantern</h2>
          <p>The shoe belonged to Reina.</p>
          <p>Elizabeth knew it before the tag turned. Purple canvas. Silver star on the heel. One lace always shorter because Reina chewed the plastic tip when she was nervous.</p>
          <p>The Lost Witness placed the lantern on the floor between them and bowed its head.</p>
          <p>“Not proof,” Elizabeth whispered. “A direction.”</p>
          <p>The entity’s tags fluttered. The room filled with voices, all giving statements at once, all interrupted before the final sentence.</p>
          <p>Then Reina’s voice cut through: “Liz, the Moon’s Eye didn’t take me first. They found me already filed.”</p>
        </section>

        <section class="chapter" data-status="CASE THEORY">
          <h2>Chapter 13 // Procedural Aftermath</h2>
          <p>Elizabeth pinned the facts to the inside of her skull.</p>
          <p>The Moon’s Eye had been studying liminal disappearances. REG-U was not causing the horror. It was what remained after reality tried to process violations too large for normal consequence. No fangs. No claws. No beasts in the old sense.</p>
          <p>Only counters. Receipts. Badges. Forms. Hallways that had learned how to punish.</p>
          <p>“A world without monsters,” she said.</p>
          <p>The Bell Clerk rang in the distance.</p>
          <p>“No,” Reina answered. “A world after monsters won and left paperwork behind.”</p>
        </section>

        <section class="chapter" data-status="CLAUDIA FOOTNOTE">
          <h2>Chapter 14 // Loomwright’s Warning</h2>
          <p>The LTR-3 produced a hidden recording Claudia had buried beneath the device’s casing.</p>
          <p>“Elizabeth,” Claudia’s voice said, steady and tired, “if the recorder opens a route to Reina, do not trust the straight path. Systems love straight paths. They use them to make people feel responsible for walking into cages.”</p>
          <p>A pause followed. Then softer: “Your sister is alive in a way language will insult. Find the procedure keeping her reachable. Break that, not yourself.”</p>
          <p>The recording ended with a sound like thread snapping.</p>
        </section>

        <section class="chapter" data-status="FALSE EXIT">
          <h2>Chapter 15 // Approved Departure</h2>
          <p>Elizabeth found an exit door with her name typed neatly on the frosted glass.</p>
          <p>ELIZABETH KURODA. DEPARTURE AUTHORIZED.</p>
          <p>On the other side, rain fell over Neon Nights Private Investigations. Her chair waited. Her ashtray waited. A fresh case file sat on her desk, labeled REINA KURODA: CLOSED.</p>
          <p>That was the third mistake.</p>
          <p>Elizabeth had never owned a closed file on Reina. She kept every folder open, even the ones that cut her hands.</p>
          <p>She shot the glass. The office screamed in carbon paper.</p>
        </section>

        <section class="chapter" data-status="PURSUIT DOCUMENTED">
          <h2>Chapter 16 // Voss Becomes Evidence</h2>
          <p>Mr. Voss found her near the compliance stairwell, half his face replaced by a visitor badge.</p>
          <p>“You don’t know what your sister is,” he said.</p>
          <p>Elizabeth aimed at his knee. “I know what you are.”</p>
          <p>“And what is that?”</p>
          <p>“A man who mistook access for ownership.”</p>
          <p>The Auditor’s receipts uncoiled from the ceiling. Voss’s sins printed fast enough to smoke. He tried to run, but the Corridor Warden stamped the stairwell beneath him.</p>
          <p>APPROVED.</p>
          <p>Voss fell upward into a filing cabinet that had not existed until it needed him.</p>
        </section>

        <section class="chapter" data-status="REINA 31%">
          <h2>Chapter 17 // The Shelf Between Names</h2>
          <p>Reina’s signal strengthened in the personnel archive.</p>
          <p>“I can see you,” she said.</p>
          <p>Elizabeth turned slowly. Every cabinet drawer had an eye-sized keyhole. None blinked. All watched.</p>
          <p>“Then tell me how to get you out.”</p>
          <p>“You can’t pull me out like a person trapped in a room. I’m not in one place.”</p>
          <p>“Then I’ll take the whole place apart.”</p>
          <p>Static crackled. Reina almost laughed. It came through broken, but it was hers. “That sounds like you.”</p>
        </section>

        <section class="chapter" data-status="DOCTRINE CONFLICT">
          <h2>Chapter 18 // The Bell Clerk’s Offer</h2>
          <p>The Bell Clerk waited at the original counter.</p>
          <p>This time, it had prepared two forms. One read: RELEASE OF SISTER, CONDITIONAL. The other read: ACCEPTANCE OF ARCHIVAL AUTHORITY.</p>
          <p>Elizabeth read the fine print. Reina could be returned as a record, a voice, a witness, or a body with unspecified continuity defects. In exchange, Elizabeth would acknowledge REG-U’s right to reconcile her memories whenever conflict arose.</p>
          <p>“You want permission,” Elizabeth said.</p>
          <p>The Clerk’s drawers opened and closed like teeth deciding whether to smile.</p>
          <p>The bell sat between them.</p>
        </section>

        <section class="chapter" data-status="NONCOMPLIANCE">
          <h2>Chapter 19 // Do Not Ring</h2>
          <p>Elizabeth picked up the bell.</p>
          <p>Every entity in the facility stopped moving.</p>
          <p>The Carbon Mother lowered her hand. The Auditor paused mid-calculation. The Corridor Warden’s surveillance beam narrowed to a trembling line. The Lost Witness clutched its lantern like a heart.</p>
          <p>“Ringing constitutes acceptance,” Reina warned.</p>
          <p>“Good thing I’m not ringing it.”</p>
          <p>Elizabeth threw the bell through the service window.</p>
          <p>The sound it made was not a chime. It was a thousand forms being denied at once.</p>
        </section>

        <section class="chapter" data-status="SYSTEM FRACTURE">
          <h2>Chapter 20 // Records Bleed Backward</h2>
          <p>The archive convulsed.</p>
          <p>Drawers spat out documents from crimes that had not happened yet. Hallways unfolded into childhood bedrooms, hospital corridors, interrogation rooms, funeral homes, empty classrooms, and one moonlit chamber where Reina stood behind glass with her palms pressed to the other side.</p>
          <p>Elizabeth ran toward her.</p>
          <p>The Moon’s Eye symbol appeared on the glass, then cracked beneath a REG-U stamp, then cracked again beneath Reina’s hand.</p>
          <p>“Liz,” Reina said, close enough to be real and far enough to ruin her, “this is not the rescue. This is the first case.”</p>
        </section>

        <section class="chapter" data-status="FIRST CASE CONFIRMED">
          <h2>Chapter 21 // The Girl Behind the Glass</h2>
          <p>Elizabeth wanted to break the glass. Every old part of her demanded it.</p>
          <p>But Claudia’s warning held: break the procedure, not yourself.</p>
          <p>So Elizabeth studied the room instead. The glass had no hinges. Reina cast no shadow. The Moon’s Eye symbol did not sit on the surface; it floated one inch behind it. The REG-U stamp covered the lower corner like a bad signature.</p>
          <p>This was not a prison. It was custody.</p>
          <p>“Who filed you?” Elizabeth asked.</p>
          <p>Reina’s eyes filled with fear.</p>
          <p>Behind her, someone rang a smaller bell.</p>
        </section>

        <section class="chapter" data-status="ENTITY MERGER">
          <h2>Chapter 22 // The Committee of Aftermath</h2>
          <p>The entities gathered.</p>
          <p>The Bell Clerk without its bell. The Carbon Mother trailing copies. The Corridor Warden with its stamp raised. The Auditor printing Elizabeth’s unresolved debt. The Lost Witness holding Reina’s shoe in pale lantern light.</p>
          <p>They did not circle her like predators.</p>
          <p>They assembled like a hearing.</p>
          <p>Elizabeth understood then why this world felt worse than any monster story. A monster could hate you. A monster could want you. These things only processed. They would ruin her with clean hands and correct terminology.</p>
          <p>The Clerk’s drawer-face printed one sentence: PURPOSE?</p>
        </section>

        <section class="chapter" data-status="DECLARATION">
          <h2>Chapter 23 // Purpose in Numeric Terms</h2>
          <p>Elizabeth took Form RU-87B from her coat. The first one. The one where she had written ONE.</p>
          <p>She crossed it out.</p>
          <p>Then she wrote: 2.</p>
          <p>Two sisters. Two witnesses. Two sides of the glass. Two records refusing closure.</p>
          <p>The archive rejected the answer at first. Lights blew. Receipts whipped through the air. The Warden stamped the floor until APPROVED became a blur of yellow.</p>
          <p>Elizabeth held the form up anyway.</p>
          <p>“My purpose is not reconciliation,” she said. “It’s retrieval.”</p>
        </section>

        <section class="chapter" data-status="PARTIAL RELEASE">
          <h2>Chapter 24 // What Came Through</h2>
          <p>The glass broke inward.</p>
          <p>Not all of Reina came through.</p>
          <p>A voice. A handprint. A strip of purple canvas. A memory of the sisters hiding under a kitchen table during a thunderstorm. A coordinate written in Claudia’s handwriting. A school name Elizabeth did not recognize.</p>
          <p>Then Reina’s hand touched Elizabeth’s for one impossible second.</p>
          <p>It was cold. It was real. It was enough to become a promise and not enough to become peace.</p>
          <p>The Lost Witness placed the lantern at Elizabeth’s feet. Inside, the shoe had become a key.</p>
        </section>

        <section class="chapter" data-status="CASE TRANSFER">
          <h2>Chapter 25 // Neon Nights Reopens</h2>
          <p>Elizabeth woke in her office at dawn with the LTR-3 smoking on the desk and Form RU-87B pinned beneath her hand.</p>
          <p>The Moon’s Eye safehouse had burned down overnight. No bodies were recovered. Twenty-three visitor badges were found in the ashes. Each bore the same title: SUPPORTING DOCUMENT.</p>
          <p>On her wall, Elizabeth’s corkboard had rearranged itself while she slept. Reina’s photo sat at the center. Beneath it, the new coordinate. Beside it, the school name from the broken glass.</p>
          <p>The LTR-3 clicked on by itself.</p>
          <p>Reina whispered, “First bell survived.”</p>
          <p>Elizabeth smiled without humor, loaded her pistol, and opened a fresh case file.</p>
          <div class="transmission">CASE STATUS: RECONCILIATION PENDING // NEXT LOCATION: HAUNTED SCHOOL FACILITY // WARNING: ATTENDANCE MAY BE RETROACTIVE.</div>
        </section>

        <div class="footer-doctrine">Memory is a record. Records require order. Sisters require retrieval.</div>
      </main>
    </section>
  </article>
</body>
</html>





const BRIEFS = [
  {
    date: "2026-07-09",
    division: "CURRENT EVENTS DIVISION",
    title: "CEASEFIRE PENDING",
    classification: "PUBLIC RECORD",
    body: `
REG-U recovered another report.

Conflict status:
transitioning.

Narrative status:
critical.

Standing recommended.
`
  }
];
