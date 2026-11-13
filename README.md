# A.R.E.S. Health Monitor
**Autonomous Real-time Evaluation & Support // Deep Space Medical Triage System**

> *Built for the NASA Space Apps Challenge 2026*

![Svelte 5](https://shields.io)
![Tailwind CSS](https://shields.io)
![NASA Open Data](https://shields.io)

---

## Overview & The Problem
During deep-space transit to Mars, communication latency between spacecraft and Earth reaches **~20+ minutes each way** (a 40+ minute round-trip delay). In an acute medical or space-weather emergency, astronauts cannot wait for real-time guidance from flight surgeons at Mission Control.

**A.R.E.S. Health Monitor** is a lightweight, offline-capable onboard medical triage console designed for resource-constrained deep-space avionics. It combines live NASA space-weather telemetry, orbital light-time calculations, interactive clinical screening, and hybrid edge/cloud AI to unlock pre-authorized countermeasures when Earth communication is delayed.

---

## Key Features
* **Live Space Radiation Monitoring (NASA DONKI API):** Queries Solar Energetic Particle (`SEP`) events in real time to automatically trigger radiation storm alerts and water-wall shelter directives.
* **Dynamic Mars Light-Time Delay (Orbital Ephemeris):** Calculates the real-time Earth–Mars distance in Astronomical Units (AU) to compute exact One-Way Light Time (OWLT) latency and unlock **Autonomous Mode**.
* **Interactive 7×7 Digital Amsler Grid:** Replaces passive symptom checkboxes with a clinical retinal screening grid that detects visual distortion quadrants and triggers **Spaceflight Associated Neuro-ocular Syndrome (SANS)** countermeasures (lower-body thigh cuffs).
* **Multi-System Crew Diagnostics:** Evaluates sleep debt, sensorimotor reaction time decline, and altered immune symptom clusters against NASA Human Research Program (HRP) baselines.
* **Hybrid A.R.E.S. AI Flight Surgeon:** Pairs **Google Gemini 2.5 Flash** with a deterministic **Onboard Edge Triage Engine** so crew members receive instant, context-aware medical guidance even during solar conjunctions or network blackouts.
* **Auto-Generated Ground Sync Logs:** Compiles structured telemetry summaries (`SYS.LOG`) ready for Deep Space Network (DSN) downlink.

---

##  NASA & Space Agency Partner Data Used
In compliance with NASA Space Apps Global Awards requirements, A.R.E.S. integrates and cites the following official datasets and resources:

1. **NASA Human Research Program (HRP) – 5 Hazards & Risks of Human Spaceflight**
   * **Source:** [https://nasa.gov](https://nasa.gov)
   * **How it supports our solution:** Defines clinical thresholds and physiological countermeasures for SANS fluid shifts, altered immune response (latent virus reactivation), vestibular/sensorimotor decline, and circadian sleep disruption.
2. **NASA DONKI (Space Weather Database Of Notifications, Knowledge, Information) API**
   * **Source:** [https://nasa.gov](https://nasa.gov) (`DONKI/SEP` endpoint)
   * **How it supports our solution:** Supplies live Solar Energetic Particle (`SEP`) event telemetry to trigger immediate radiation shielding protocols.
3. **Canadian Space Agency (CSA) – Monitoring Radiation for Astronaut Health**
   * **Source:** [https://asc-csa.gc.ca](https://asc-csa.gc.ca)
   * **How it supports our solution:** Grounds cumulative crew dosimeter logging and radiation exposure mitigation protocols during long-duration missions.
4. **Orbital Ephemeris Reference (NASA JPL Horizons Model)**
   * **Source:** [https://nasa.gov](https://nasa.gov)
   * **How it supports our solution:** Models synodic Earth–Mars orbital separation to compute accurate One-Way Light Time (OWLT) communication delays.

---

## Tech Stack
* **Frontend:** Svelte 5 (Fine-grained reactivity via `$state`, `$derived`, and `$effect` runes—zero Virtual DOM overhead)
* **Build Tool & Styling:** Vite + Tailwind CSS
* **APIs & AI:** NASA DONKI REST API, Google Gemini 2.5 Flash API + Deterministic Offline Edge Triage Engine

---

## Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   cd ares-health-monitor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   Create a `.env` file in the project root (see `.env.example`):
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: If no Gemini key is provided, A.R.E.S. automatically runs on its built-in Onboard Edge AI engine, and NASA DONKI uses `DEMO_KEY` by default.)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
