// /**
//  * @typedef {Object} HealthInputs
//  * @property {string[]} symptoms
//  * @property {boolean} visionDistortion
//  * @property {number} reactionTimeMs
//  * @property {number} sleepHours
//  */

// /**
//  * @typedef {Object} HealthAlert
//  * @property {"immune"|"sans"|"vestibular"|"behavioral"} type
//  * @property {string} title
//  * @property {string} description
//  * @property {string} action
//  * @property {"amber"} severity
//  */

// /**
//  * @typedef {Object} HealthCheckResult
//  * @property {"nominal"|"amber"} overallStatus
//  * @property {HealthAlert[]} alerts
//  */

// /**
//  * @param {HealthInputs} inputs
//  * @returns {HealthCheckResult}
//  */
// export const checkHealth = (inputs) => {
//   /** @type {HealthAlert[]} */
//   const alerts = [];
//   /** @type {"nominal" | "amber"} */
//   let overallStatus = "nominal"; 

//   // 1. Latent Virus / Immune Check
//   if (inputs.symptoms.length >= 2) {
//     overallStatus = "amber";
//     alerts.push({
//       type: "immune",
//       title: "Immune Alert: Symptom Cluster",
//       description: "Multiple symptoms reported. NASA HRP notes spaceflight can awaken dormant viruses (Altered Immune Response).",
//       action: "Initiate cabin air filtration check. Isolate if contagious. Review Immune Biomarkers log.",
//       severity: "amber"
//     });
//   }

//   // 2. SANS Visual Check
//   if (inputs.visionDistortion) {
//     overallStatus = "amber";
//     alerts.push({
//       type: "sans",
//       title: "SANS Risk: Visual Distortion",
//       description: "Amsler grid deviation detected. Fluid shift toward head may be affecting intracranial pressure.",
//       action: "Don Thigh Cuffs for 30 minutes to pull fluids to lower body. Re-test visual baseline.",
//       severity: "amber"
//     });
//   }

//   // 3. Vestibular / Sensorimotor Check
//   if (inputs.reactionTimeMs > 350) {
//     if (overallStatus === "nominal") overallStatus = "amber";
//     alerts.push({
//       type: "vestibular",
//       title: "Sensorimotor Decline",
//       description: "Reaction time is 20% slower than personal baseline. Vestibular adaptation detected.",
//       action: "Do not attempt manual piloting or EVA. Schedule 30 mins of balance training.",
//       severity: "amber"
//     });
//   }

//   // 4. Sleep & Mood (Behavioral)
//   if (inputs.sleepHours < 5) {
//     if (overallStatus === "nominal") overallStatus = "amber";
//     alerts.push({
//       type: "behavioral",
//       title: "Sleep Debt Warning",
//       description: "Sleep is below 5 hours. Chronic sleep loss impacts cognitive performance.",
//       action: "Adjust cabin lighting to blue-enriched morning cycle. Log 10 mins in Veggie Monitoring (Space Gardening) to reduce stress.",
//       severity: "amber"
//     });
//   }

//   return { overallStatus, alerts };
// };

/**
 * @typedef {Object} HealthInputs
 * @property {string[]} symptoms
 * @property {boolean} visionDistortion
 * @property {number} reactionTimeMs
 * @property {number} sleepHours
 * @property {{eventTime: string}|null} [radiationEvent]
 */

/**
 * @typedef {Object} HealthAlert
 * @property {"radiation"|"immune"|"sans"|"vestibular"|"behavioral"} type
 * @property {string} title
 * @property {string} description
 * @property {string} action
 * @property {"amber"} severity
 */

/**
 * @typedef {Object} HealthCheckResult
 * @property {"nominal"|"amber"} overallStatus
 * @property {HealthAlert[]} alerts
 */

/**
 * Calculates real-time Earth-Mars distance and One-Way Light Time (OWLT)
 * @param {Date} [date=new Date()]
 */
export const getMarsTelemetry = (date = new Date()) => {
  const J2000 = new Date('2000-01-01T12:00:00Z');
  const daysSinceJ2000 = (date.getTime() - J2000.getTime()) / (1000 * 60 * 60 * 24);
  const synodicAngle = ((daysSinceJ2000 % 779.94) / 779.94) * 2 * Math.PI;
  
  const distanceAU = Math.sqrt(1.0 ** 2 + 1.524 ** 2 - 2 * 1.0 * 1.524 * Math.cos(synodicAngle));
  const owltSeconds = Math.round(distanceAU * 499.00478);
  const minutes = Math.floor(owltSeconds / 60);
  const seconds = owltSeconds % 60;

  return {
    distanceAU: distanceAU.toFixed(2),
    minutes,
    formatted: `${minutes}m ${seconds}s`
  };
};

/**
 * @param {HealthInputs} inputs
 * @returns {HealthCheckResult}
 */
export const checkHealth = (inputs) => {
  /** @type {HealthAlert[]} */
  const alerts = [];
  /** @type {"nominal" | "amber"} */
  let overallStatus = "nominal"; 

  // 0. Live NASA DONKI Radiation Hazard Check
  if (inputs.radiationEvent) {
    overallStatus = "amber";
    alerts.push({
      type: "radiation",
      title: "Space Radiation Hazard (SEP Event)",
      description: `NASA DONKI detected a Solar Energetic Particle event (${inputs.radiationEvent.eventTime}). Elevated cosmic radiation risk.`,
      action: "Relocate crew to water-wall storm shelter. Log cumulative dosimeter exposure per CSA/NASA radiation protocols.",
      severity: "amber"
    });
  }

  // 1. Latent Virus / Immune Check
  if (inputs.symptoms.length >= 2) {
    overallStatus = "amber";
    alerts.push({
      type: "immune",
      title: "Immune Alert: Symptom Cluster",
      description: "Multiple symptoms reported. NASA HRP notes spaceflight can awaken dormant viruses (Altered Immune Response).",
      action: "Initiate cabin air filtration check. Isolate if contagious. Review Immune Biomarkers log.",
      severity: "amber"
    });
  }

  // 2. SANS Visual Check
  if (inputs.visionDistortion) {
    overallStatus = "amber";
    alerts.push({
      type: "sans",
      title: "SANS Risk: Visual Distortion",
      description: "Amsler grid deviation detected. Fluid shift toward head may be affecting intracranial pressure.",
      action: "Don Thigh Cuffs for 30 minutes to pull fluids to lower body. Re-test visual baseline.",
      severity: "amber"
    });
  }

  // 3. Vestibular / Sensorimotor Check
  if (inputs.reactionTimeMs > 350) {
    if (overallStatus === "nominal") overallStatus = "amber";
    alerts.push({
      type: "vestibular",
      title: "Sensorimotor Decline",
      description: "Reaction time is 20% slower than personal baseline. Vestibular adaptation detected.",
      action: "Do not attempt manual piloting or EVA. Schedule 30 mins of balance training.",
      severity: "amber"
    });
  }

  // 4. Sleep & Mood (Behavioral)
  if (inputs.sleepHours < 5) {
    if (overallStatus === "nominal") overallStatus = "amber";
    alerts.push({
      type: "behavioral",
      title: "Sleep Debt Warning",
      description: "Sleep is below 5 hours. Chronic sleep loss impacts cognitive performance.",
      action: "Adjust cabin lighting to blue-enriched morning cycle. Log 10 mins in Veggie Monitoring (Space Gardening) to reduce stress.",
      severity: "amber"
    });
  }

  return { overallStatus, alerts };
};
