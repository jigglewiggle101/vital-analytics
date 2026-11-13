<script>
  import { checkHealth, getMarsTelemetry } from './lib/healthEngine.js';
  import AmslerGrid from './lib/AmslerGrid.svelte';
  import FlightSurgeonAI from './lib/FlightSurgeonAI.svelte';

  let missionDay = $state(1);
  let sleepHours = $state(8);
  let symptoms = $state(/** @type {string[]} */ ([]));
  let visionDistortion = $state(false);
  let distortedCells = $state(/** @type {number[]} */ ([]));
  let reactionTimeMs = $state(250);
  let commsMode = $state("LEO"); // "LEO" | "MARS"
  
  // Live NASA DONKI Radiation State
  let radiationEvent = $state(/** @type {any} */ (null));
  let donkiStatus = $state("SYNCING DONKI...");

  // Dynamic Earth-Mars Light-Time Delay
  let marsTelemetry = $derived(getMarsTelemetry());
  
  // Automatically passes live radiationEvent into checkHealth
  let healthResult = $derived(
    checkHealth({ sleepHours, symptoms, visionDistortion, reactionTimeMs, radiationEvent })
  );

  // Fetch live Solar Energetic Particle (SEP) alerts from NASA DONKI on mount
  $effect(() => {
    const end = new Date().toISOString().split('T')[0];
    const startObj = new Date();
    startObj.setDate(startObj.getDate() - 30);
    const start = startObj.toISOString().split('T')[0];


  const url = `https://nasa.gov{start}&endDate=${end}&api_key=DEMO_KEY`;



    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("LIVE NASA DONKI API RESPONSE:", data);
        if (Array.isArray(data) && data.length > 0) {
          radiationEvent = data[data.length - 1];
          donkiStatus = `DONKI LIVE: SEP DETECTED`;
        } else {
          donkiStatus = `DONKI LIVE: SOLAR QUIET`;
        }
      })
      .catch(err => {
        console.warn("DONKI fetch error:", err);
        donkiStatus = `DONKI: STANDBY (SIM READY)`;
      });
  });

  function loadDay45() {
    missionDay = 45;
    sleepHours = 4.5;
    symptoms = ["rash", "fatigue"];
    visionDistortion = true;
    reactionTimeMs = 380;
    commsMode = "MARS";
  }

  function resetNominal() {
    missionDay = 1;
    sleepHours = 8;
    symptoms = [];
    visionDistortion = false;
    distortedCells = [];
    reactionTimeMs = 250;
    commsMode = "LEO";
    radiationEvent = null;
    donkiStatus = "DONKI LIVE: SOLAR QUIET";
  }

  function toggleDemoSolarStorm() {
    if (radiationEvent) {
      radiationEvent = null;
      donkiStatus = "DONKI LIVE: SOLAR QUIET";
    } else {
      radiationEvent = { eventTime: new Date().toISOString().slice(0, 16) + "Z" };
      donkiStatus = "DONKI ALERT: SIMULATED SEP";
    }
  }

  /** @param {string} sym */
  function toggleSymptom(sym) {
    if (symptoms.includes(sym)) {
      symptoms = symptoms.filter(s => s !== sym);
    } else {
      symptoms = [...symptoms, sym];
    }
  }
</script>

<!-- Deep Space Gradient Background with Subtle Grid -->
<div class="min-h-screen bg-[#050914] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0a1226] via-[#050914] to-black text-slate-200 p-4 md:p-8 font-sans selection:bg-blue-500/30 relative overflow-hidden">
  
  <!-- Decorative background glow -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

  <!-- Top Header -->
  <header class="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 border-b border-slate-800/50 pb-6 gap-6 relative z-10">
    <div class="flex items-center gap-5">
      <!-- Premium Glowing Logo -->
      <div class="relative flex items-center justify-center w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-b from-blue-400 to-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.4)] border border-blue-300/20">
        <div class="absolute inset-0 rounded-2xl bg-blue-400/20 blur-md"></div>
        <svg class="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
      </div>
      
      <!-- Typography -->
      <div>
        <h1 class="text-2xl xl:text-3xl font-medium text-white tracking-wide flex items-center gap-3 whitespace-nowrap">
          <span class="font-bold tracking-widest">A.R.E.S.</span>
          <span class="text-slate-600 font-light text-2xl">|</span>
          <span class="text-slate-300 font-light tracking-wider text-xl xl:text-2xl">HEALTH MONITOR</span>
        </h1>
        <p class="text-[10px] text-blue-400/80 mt-1.5 font-mono tracking-[0.2em] uppercase">
          Vital Analytics // Deep Space Autonomous Triage
        </p>
      </div>
    </div>
    
    <div class="flex flex-wrap gap-3 w-full lg:w-auto items-center">
      <span class="text-[10px] font-mono text-blue-400/80 bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-lg whitespace-nowrap">
        {donkiStatus}
      </span>
      <button onclick={toggleDemoSolarStorm} class="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wide transition-all whitespace-nowrap">
        {radiationEvent ? 'CLEAR SEP' : 'TEST SEP STORM'}
      </button>
      {#if missionDay === 45}
        <button onclick={resetNominal} class="bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-600/50 px-4 py-2.5 rounded-xl font-mono text-xs tracking-wide transition-all whitespace-nowrap">
          RESET DAY 1
        </button>
      {/if}
      <button onclick={loadDay45} class="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all duration-300 font-mono text-xs tracking-wide flex items-center justify-center gap-2 group whitespace-nowrap">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse group-hover:scale-125 transition-transform"></span> SIMULATE DAY 45 CRISIS
      </button>
    </div>
  </header>

  <!-- Main Dashboard Grid -->
  <div class="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
    
    <!-- PANEL 1: Anatomical Status -->
    <div class="lg:col-span-3 bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 flex flex-col shadow-2xl">
      <div class="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-3">
        <h2 class="text-xs font-mono text-slate-400 tracking-widest">CREW STATUS</h2>
        <span class="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">DAY {missionDay}</span>
      </div>
      
      <div class="flex flex-col gap-6 flex-grow">
        <!-- Neuro -->
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-500 {visionDistortion ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-700/50 bg-slate-800/50'}">
            <svg class="w-6 h-6 {visionDistortion ? 'text-amber-400' : 'text-slate-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </div>
          <div>
            <div class="text-[10px] font-mono text-slate-400 tracking-wider">NEURO / OCULAR</div>
            <div class="text-sm font-bold {visionDistortion ? 'text-amber-400' : 'text-slate-300'}">{visionDistortion ? 'SANS ALERT' : 'NOMINAL'}</div>
          </div>
        </div>

        <!-- Immune -->
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-500 {symptoms.length >= 2 ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-700/50 bg-slate-800/50'}">
            <svg class="w-6 h-6 {symptoms.length >= 2 ? 'text-amber-400' : 'text-slate-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
          </div>
          <div>
            <div class="text-[10px] font-mono text-slate-400 tracking-wider">IMMUNE SYSTEM</div>
            <div class="text-sm font-bold {symptoms.length >= 2 ? 'text-amber-400' : 'text-slate-300'}">{symptoms.length >= 2 ? 'ALERT' : 'NOMINAL'}</div>
          </div>
        </div>

   <!-- Vestibular -->
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-500 {reactionTimeMs > 350 ? 'border-amber-500/50 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-700/50 bg-slate-800/50'}">
            <svg class="w-6 h-6 {reactionTimeMs > 350 ? 'text-amber-400' : 'text-slate-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <div class="text-[10px] font-mono text-slate-400 tracking-wider">VESTIBULAR</div>
            <div class="text-sm font-bold {reactionTimeMs > 350 ? 'text-amber-400' : 'text-slate-300'}">{reactionTimeMs > 350 ? 'DECLINE' : 'NOMINAL'}</div>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-4 border-t border-slate-700/50">
        <label for="comms-environment" class="block text-[10px] font-mono text-slate-500 mb-2 tracking-wider">COMMS ENVIRONMENT</label>
        <select id="comms-environment" bind:value={commsMode} class="w-full bg-[#050914] border border-slate-700/80 rounded-lg p-2.5 text-xs font-mono text-blue-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all">
          <option value="LEO">Low (Earth/LEO)</option>
          <option value="MARS">High (Mars - {marsTelemetry.formatted})</option>
        </select>
        {#if commsMode === "MARS"}
          <p class="text-[10px] font-mono text-slate-400 mt-2">
            EPHEMERIS DIST: <span class="text-blue-400">{marsTelemetry.distanceAU} AU</span> (OWLT)
          </p>
        {/if}
      </div>
    </div>

    <!-- PANEL 2: Data Input -->
    <div class="lg:col-span-4 bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <h2 class="text-xs font-mono text-slate-400 mb-6 tracking-widest border-b border-slate-700/50 pb-3">DAILY SELF-ASSESSMENT</h2>
      
      <div class="space-y-8">
        <!-- Sleep -->
        <div>
          <div class="flex justify-between items-end mb-2">
            <span class="text-[10px] font-mono text-slate-400 tracking-wider">SLEEP DURATION</span>
            <span class="text-2xl font-bold {sleepHours < 5 ? 'text-amber-400' : 'text-blue-400'}">{sleepHours.toFixed(1)}<span class="text-sm text-slate-500 font-normal font-sans"> hrs</span></span>
          </div>
          <input type="range" min="3" max="10" step="0.5" bind:value={sleepHours} class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>

        <!-- Reaction -->
        <div>
          <div class="flex justify-between items-end mb-2">
            <span class="text-[10px] font-mono text-slate-400 tracking-wider">REACTION TIME</span>
            <span class="text-2xl font-bold {reactionTimeMs > 350 ? 'text-amber-400' : 'text-blue-400'}">{reactionTimeMs}<span class="text-sm text-slate-500 font-normal font-sans"> ms</span></span>
          </div>
          <input type="range" min="200" max="500" step="10" bind:value={reactionTimeMs} class="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>

        <!-- Symptoms -->
        <div>
          <div class="block text-[10px] mb-3 font-mono text-slate-400 tracking-wider">IMMUNE SYMPTOM CLUSTER</div>
          <div class="flex gap-2">
            <button onclick={() => toggleSymptom('rash')} class="flex-1 py-2.5 rounded-lg text-xs font-mono border transition-all duration-300 {symptoms.includes('rash') ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500'}">RASH</button>
            <button onclick={() => toggleSymptom('fatigue')} class="flex-1 py-2.5 rounded-lg text-xs font-mono border transition-all duration-300 {symptoms.includes('fatigue') ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500'}">FATIGUE</button>
            <button onclick={() => toggleSymptom('fever')} class="flex-1 py-2.5 rounded-lg text-xs font-mono border transition-all duration-300 {symptoms.includes('fever') ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.15)]' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-500'}">FEVER</button>
          </div>
        </div>

         <!-- Vision -->
        <div class="bg-[#050914]/50 p-4 rounded-xl border border-slate-700/50">
          <button type="button" class="flex items-center justify-between w-full cursor-pointer select-none group" onclick={() => visionDistortion = !visionDistortion}>
            <span class="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">VISION ANOMALY (SANS)</span>
            <div class="w-10 h-5 rounded-full relative transition-colors duration-300 {visionDistortion ? 'bg-amber-500' : 'bg-slate-700'}">
              <div class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 {visionDistortion ? 'left-[22px]' : 'left-0.5'}"></div>
            </div>
          </button>

          <AmslerGrid bind:visionDistortion bind:distortedCells />
        </div>
      </div>
    </div>

    <!-- PANEL 3: Diagnostics -->
    <div class="lg:col-span-5 flex flex-col gap-4">
      
      <!-- Status Bar -->
      <div class="bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 flex justify-between items-center shadow-2xl">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          <h2 class="text-xs font-mono text-slate-400 tracking-widest">SYSTEM DIAGNOSTICS</h2>
        </div>
        <div class="px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-widest border transition-colors duration-500
          {healthResult.overallStatus === 'amber' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'}
        ">
          {healthResult.overallStatus.toUpperCase()}
        </div>
      </div>

      <!-- Autonomy Banner -->
      {#if commsMode === "MARS"}
        <div class="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl text-xs font-mono text-blue-300 flex items-center gap-3">
          <svg class="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path></svg>
          <span><strong>AUTONOMOUS MODE ({marsTelemetry.formatted} DELAY).</strong> Pre-authorized protocols unlocked.</span>
        </div>
      {/if}

      <!-- Action Cards -->
      <div class="space-y-4 flex-grow overflow-y-auto max-h-[500px] pr-1">
        {#if healthResult.alerts.length === 0}
          <div class="flex flex-col items-center justify-center h-full text-slate-500 bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 min-h-[300px] shadow-2xl">
            <svg class="w-16 h-16 mb-4 text-slate-700/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            <p class="font-mono text-sm tracking-widest text-green-500/70">ALL SYSTEMS NOMINAL</p>
          </div>
        {/if}

                {#each healthResult.alerts as alert}
          <div class="p-5 rounded-2xl bg-gradient-to-r from-[#0f172a]/90 to-[#0a1226]/90 border border-slate-700/50 border-l-2 border-l-amber-500/80 shadow-2xl relative overflow-hidden group">
            <div class="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 class="font-bold text-amber-400 mb-2 font-mono text-sm tracking-wide flex items-center gap-2 relative z-10">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {alert.title.toUpperCase()}
            </h3>
            <p class="text-xs text-slate-400 mb-4 leading-relaxed relative z-10">{alert.description}</p>
            
            <div class="bg-[#050914] p-4 rounded-xl border border-slate-700/50 text-xs text-green-400 font-mono leading-relaxed relative z-10 shadow-inner">
              <strong class="text-green-500/70 block mb-1 text-[10px] tracking-wider">/// DIRECTIVE</strong>
              {alert.action}
            </div>
          </div>
        {/each}
      </div>

      <!-- AI Flight Surgeon Triage -->
      <FlightSurgeonAI
        {sleepHours}
        {symptoms}
        {visionDistortion}
        {reactionTimeMs}
        {radiationEvent}
        {commsMode}
        {marsTelemetry}
      />


      <!-- Sync Summary -->
      {#if healthResult.alerts.length > 0}
        <div class="bg-[#0f172a]/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl mt-2 p-4">
          <div class="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-2">
            <h3 class="text-[10px] font-mono text-blue-400/80 tracking-widest">GROUND SYNC SUMMARY</h3>
            <span class="text-[9px] text-slate-500 font-mono bg-slate-800/50 px-2 py-0.5 rounded">AUTO-GEN</span>
          </div>
          <textarea readonly class="w-full bg-[#050914] text-slate-400 text-xs p-3 rounded-lg border border-slate-700/50 h-28 font-mono focus:outline-none resize-none leading-relaxed">
SYS.LOG // DAY {missionDay} ({commsMode === 'MARS' ? `OWLT: ${marsTelemetry.formatted}` : 'LEO'})
------------------------
SLEEP: {sleepHours}H | REACT: {reactionTimeMs}MS
SYMPTOMS: {symptoms.join(', ').toUpperCase() || 'NONE'}
VISION: {visionDistortion ? 'ANOMALY' : 'OK'} | RADIATION: {radiationEvent ? 'SEP ALERT' : 'NOMINAL'}
ALERTS: {healthResult.alerts.map(a => a.title).join(' | ').toUpperCase()}
STATUS: {commsMode === 'MARS' ? 'Autonomous protocol executed. Queued for Earth downlink.' : 'Awaiting flight surgeon review.'}
          </textarea>
        </div>
      {/if}

    </div>
  </div>
</div>

