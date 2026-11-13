<script>
  /** @type {{ visionDistortion?: boolean, distortedCells?: number[] }} */
  let { visionDistortion = $bindable(false), distortedCells = $bindable([]) } = $props();

  const size = 7; // 7x7 clinical grid
  const centerIndex = Math.floor((size * size) / 2);

  /** @param {number} idx */
  function toggleCell(idx) {
    if (idx === centerIndex) return;
    if (distortedCells.includes(idx)) {
      distortedCells = distortedCells.filter(c => c !== idx);
    } else {
      distortedCells = [...distortedCells, idx];
    }
    visionDistortion = distortedCells.length > 0;
  }

  function clearGrid() {
    distortedCells = [];
    visionDistortion = false;
  }
</script>

<div class="mt-3 bg-[#0f172a]/90 p-3.5 rounded-xl border border-slate-700/60">
  <div class="flex justify-between items-center mb-2">
    <span class="text-[10px] font-mono text-blue-400 tracking-wider">INTERACTIVE AMSLER GRID</span>
    {#if distortedCells.length > 0}
      <button type="button" onclick={clearGrid} class="text-[10px] font-mono text-amber-400 hover:underline">
        CLEAR ({distortedCells.length})
      </button>
    {/if}
  </div>

  <p class="text-[11px] text-slate-400 mb-3 leading-relaxed">
    Focus on the center dot. Tap any grid squares that appear wavy, blurred, or missing.
  </p>

  <div class="grid grid-cols-7 gap-0.5 bg-slate-700/70 p-0.5 rounded-lg max-w-[210px] mx-auto aspect-square">
    {#each Array(size * size) as _, idx}
      {@const isCenter = idx === centerIndex}
      {@const isDistorted = distortedCells.includes(idx)}
      <button
        type="button"
        aria-label="Grid cell {idx + 1}"
        onclick={() => toggleCell(idx)}
        class="relative flex items-center justify-center transition-colors duration-200
          {isCenter ? 'bg-[#050914] cursor-default' : isDistorted ? 'bg-amber-500/40 border border-amber-400' : 'bg-[#050914] hover:bg-slate-800'}"
      >
        {#if isCenter}
          <span class="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span>
        {:else if isDistorted}
          <span class="w-1.5 h-1.5 rounded-full bg-amber-300"></span>
        {/if}
      </button>
    {/each}
  </div>
</div>
