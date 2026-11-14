<script>
  /**
   * @type {{
   *   sleepHours: number,
   *   symptoms: string[],
   *   visionDistortion: boolean,
   *   reactionTimeMs: number,
   *   radiationEvent: any,
   *   commsMode: string,
   *   marsTelemetry: { distanceAU: string, minutes: number, formatted: string }
   * }}
   */
  let {
    sleepHours,
    symptoms,
    visionDistortion,
    reactionTimeMs,
    radiationEvent,
    commsMode,
    marsTelemetry
  } = $props();

  let promptInput = $state("");
  let isThinking = $state(false);
  /** @type {HTMLDivElement | undefined} */
  let chatContainer = $state();

  let messages = $state([
    {
      role: "ai",
      text: "A.R.E.S. Onboard AI ready. Ask about EVA clearance, SANS protocol, or alert triage."
    }
  ]);

  $effect(() => {
    messages.length;
    isThinking;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  });

  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

  /**
   * Generates context-aware NASA HRP clinical guidance offline or as fallback
   * @param {string} query
   */
  /**
   * Generates context-aware NASA HRP clinical guidance offline or as fallback
   * @param {string} query
   */
  function generateLocalTriage(query) {
    const q = query.toLowerCase();
    /** @type {string[]} */
    const activeRisks = [];
    if (radiationEvent) activeRisks.push("active SEP solar radiation storm");
    if (visionDistortion) activeRisks.push("SANS ocular fluid shift");
    if (symptoms.length >= 2) activeRisks.push(`immune cluster (${symptoms.join(", ")})`);
    if (reactionTimeMs > 350) activeRisks.push(`vestibular delay (${reactionTimeMs}ms)`);
    if (sleepHours < 5) activeRisks.push(`sleep debt (${sleepHours}h)`);

    if (q.includes("eva") || q.includes("spacewalk") || q.includes("pilot")) {
      return activeRisks.length > 0
        ? `EVA / MANUAL PILOTING DENIED. Active risks: ${activeRisks.join("; ")}. Defer external ops until reaction time < 320ms and radiation clears.`
        : `EVA CLEARED. Sensorimotor baseline (${reactionTimeMs}ms), ocular status, and space weather are nominal.`;
    }

    if (q.includes("vision") || q.includes("sans") || q.includes("eye") || q.includes("cuff")) {
      return visionDistortion
        ? "SANS PROTOCOL: 1) Don lower-body thigh cuffs for 30 min to pull fluids away from the optic nerve. 2) Log intraocular pressure. 3) Re-test Amsler grid in 4 hours."
        : "Ocular telemetry nominal. Continue routine Amsler grid checks.";
    }

    if (q.includes("radiation") || q.includes("storm") || q.includes("shelter")) {
      return radiationEvent
        ? "RADIATION PROTOCOL: 1) Move crew into water-wall storm shelter immediately. 2) Hydrate with electrolytes. 3) Log cumulative dosimeter reading."
        : "DONKI solar particle flux is quiet. Standard hull shielding sufficient.";
    }

    // Smart follow-up handler for "so how?", "what should I do?", "steps", etc.
    if (q.includes("how") || q.includes("what") || q.includes("step") || q.includes("help") || q.includes("do")) {
      if (activeRisks.length === 0) {
        return "NO ACTION REQUIRED: All telemetry is nominal. Maintain standard hydration, 8h circadian sleep cycle, and weekly Amsler screening.";
      }
      /** @type {string[]} */
      const steps = [];
      if (radiationEvent) steps.push("1) Shelter in water-wall bay until SEP flux drops");
      if (visionDistortion) steps.push("2) Wear thigh cuffs for 30 mins to relieve SANS pressure");
      if (symptoms.length >= 2) steps.push("3) Boost cabin HEPA filtration & isolate symptomatic crew");
      if (reactionTimeMs > 350) steps.push("4) Suspend manual piloting/EVA & run 30m balance training");
      if (sleepHours < 5) steps.push("5) Shift cabin LEDs to morning blue spectrum");
      return `ACTION PLAN (${commsMode === "MARS" ? marsTelemetry.formatted + " OWLT" : "LEO"}): ${steps.join(". ")}.`;
    }

    return activeRisks.length > 0
      ? `AUTONOMOUS TRIAGE (${commsMode === "MARS" ? marsTelemetry.formatted + " OWLT" : "LEO"}): Priority risks are ${activeRisks.join(", ")}. Ask "how?" for step-by-step countermeasures.`
      : `ALL VITALS NOMINAL (${sleepHours}h sleep, ${reactionTimeMs}ms reaction). Maintain circadian lighting schedule.`;
  }


  /** @param {string} [customPrompt=""] */
  async function askSurgeon(customPrompt = "") {
    const question = (customPrompt || promptInput).trim();
    if (!question || isThinking) return;

    messages = [...messages, { role: "user", text: question }];
    promptInput = "";
    isThinking = true;

    const telemetryContext = `Astronaut Telemetry: Sleep=${sleepHours}h, Reaction=${reactionTimeMs}ms, Symptoms=${symptoms.join(",") || "none"}, SANS=${visionDistortion}, SEP_Storm=${Boolean(radiationEvent)}, Comms=${commsMode} (${marsTelemetry.formatted} delay).`;

  if (GEMINI_KEY) {
      try {
        const host = "https://generativelanguage.googleapis.com";
        const path = "/v1beta/models/gemini-3.1-flash-lite:generateContent";
        const res = await fetch(
          `${host}${path}?key=${GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are A.R.E.S., an autonomous NASA deep-space medical triage AI. Keep answers under 50 words, clinical, and grounded in NASA HRP protocols. ${telemetryContext} Crew question: ${question}`
                }]
              }]
            })
          }
        );
        const data = await res.json();
        const reply = data?.candidates?.at(0)?.content?.parts?.at(0)?.text;
        if (reply) {
          messages = [...messages, { role: "ai", text: reply.trim() }];
          isThinking = false;
          return;
        }
      } catch (err) {
        console.warn("Gemini API fallback:", err);
      }
    }

    await new Promise(r => setTimeout(r, 300));
    messages = [...messages, { role: "ai", text: generateLocalTriage(question) }];
    isThinking = false;
  }
</script>

<div class="bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-4 shadow-2xl">
  <div class="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-2">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
      <h3 class="text-[10px] font-mono text-blue-400 tracking-widest">A.R.E.S. AI FLIGHT SURGEON</h3>
    </div>
    <span class="text-[9px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
      {GEMINI_KEY ? 'GEMINI + EDGE' : 'ONBOARD AI'}
    </span>
  </div>

  <!-- Quick Triage Chips -->
  <div class="flex flex-wrap gap-1.5 mb-3">
    <button type="button" onclick={() => askSurgeon("Am I cleared for EVA today?")} class="text-[10px] font-mono bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-md transition-colors">
      EVA CLEARANCE?
    </button>
    <button type="button" onclick={() => askSurgeon("Prioritize my current alerts")} class="text-[10px] font-mono bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-md transition-colors">
      TRIAGE PRIORITY
    </button>
    <button type="button" onclick={() => askSurgeon("SANS protocol steps?")} class="text-[10px] font-mono bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-md transition-colors">
      SANS STEPS
    </button>
  </div>

  <!-- Message Feed -->
  <div bind:this={chatContainer} class="space-y-2 max-h-32 overflow-y-auto mb-3 pr-1 text-xs scroll-smooth">
    {#each messages as msg}
      <div class="p-2.5 rounded-lg font-mono leading-relaxed {msg.role === 'user' ? 'bg-slate-800/70 text-slate-200 ml-6' : 'bg-[#050914] text-blue-300 border border-slate-800'}">
        <span class="text-[9px] uppercase tracking-wider block mb-0.5 {msg.role === 'user' ? 'text-slate-400' : 'text-blue-500'}">
          {msg.role === 'user' ? 'CREW' : 'A.R.E.S. TRIAGE'}
        </span>
        {msg.text}
      </div>
    {/each}
    {#if isThinking}
      <div class="text-[10px] font-mono text-blue-400 animate-pulse px-2">ANALYZING TELEMETRY...</div>
    {/if}
  </div>

  <!-- Input Form -->
  <form onsubmit={(e) => { e.preventDefault(); askSurgeon(); }} class="flex gap-2">
    <input
      type="text"
      bind:value={promptInput}
      placeholder="Ask onboard medical AI..."
      class="flex-1 bg-[#050914] border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:border-blue-500/50 outline-none"
    />
    <button type="submit" class="bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs px-3.5 py-2 rounded-lg transition-colors">
      ASK
    </button>
  </form>
</div>
