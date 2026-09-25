/**
 * Insurer data model and sample policy book.
 *
 * The insurer is a licensed carrier. It writes the policies, sets
 * trigger thresholds, underwrites the risk, and executes payouts.
 * AgriShield only supplies the environmental evidence and the model
 * signal. The insurer's rules decide what happens.
 */

export type PolicyStatus = "ACTIVE" | "LAPSED" | "CLAIMED";

export type Policy = {
  id: string;
  holder: string;
  nationalId: string;
  zoneId: string;
  crop: string;
  hectares: number;
  sumInsured: number;
  premium: number;
  triggerThreshold: number;   // model score at or above which the policy fires
  exitThreshold: number;      // model score below which recovery is considered
  payoutRatio: number;        // proportion of sumInsured paid on trigger
  observationStart: string;   // ISO date
  observationEnd: string;     // ISO date
  status: PolicyStatus;
};

export type Insurer = {
  id: string;
  name: string;
  regulator: string;
  licenseNumber: string;
  underwriterOfRecord: string;
  contact: string;
};

export const INSURER: Insurer = {
  id: "afc-insurance",
  name: "AFC Insurance Zimbabwe",
  regulator: "IPEC",
  licenseNumber: "IPEC/ZIC/2019/0412",
  underwriterOfRecord: "AFC Insurance Company Limited",
  contact: "claims@afc.co.zw",
};

/**
 * Sample policy book.
 * Sixteen policies across four zones. Each policy has its own
 * trigger threshold and payout ratio, reflecting how a real insurer
 * would price different farms differently based on crop, region,
 * historical loss, and coverage tier.
 */
export const POLICIES: Policy[] = [
  // ---- Chiwundura (zone threshold 0.72) ----
  { id: "AFC-CHI-0001", holder: "Tendai Moyo", nationalId: "63-1234567A12", zoneId: "chiwundura", crop: "Maize", hectares: 2.4, sumInsured: 300, premium: 5.00, triggerThreshold: 0.68, exitThreshold: 0.60, payoutRatio: 0.90, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-CHI-0002", holder: "Rudo Chikafu", nationalId: "63-2345678B23", zoneId: "chiwundura", crop: "Maize", hectares: 3.1, sumInsured: 400, premium: 6.50, triggerThreshold: 0.70, exitThreshold: 0.62, payoutRatio: 0.85, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-CHI-0003", holder: "Simba Muzenda", nationalId: "63-3456789C34", zoneId: "chiwundura", crop: "Groundnuts", hectares: 1.8, sumInsured: 250, premium: 4.00, triggerThreshold: 0.72, exitThreshold: 0.65, payoutRatio: 0.90, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-CHI-0004", holder: "Grace Nyathi", nationalId: "63-4567890D45", zoneId: "chiwundura", crop: "Maize", hectares: 4.2, sumInsured: 500, premium: 8.00, triggerThreshold: 0.66, exitThreshold: 0.58, payoutRatio: 0.80, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },

  // ---- Gweru Rural (zone threshold 0.68) ----
  { id: "AFC-GWR-0001", holder: "Farai Zhou", nationalId: "63-5678901E56", zoneId: "gweru-rural", crop: "Maize", hectares: 2.9, sumInsured: 350, premium: 5.50, triggerThreshold: 0.65, exitThreshold: 0.55, payoutRatio: 0.85, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-GWR-0002", holder: "Nyasha Dube", nationalId: "63-6789012F67", zoneId: "gweru-rural", crop: "Sorghum", hectares: 5.0, sumInsured: 600, premium: 9.50, triggerThreshold: 0.70, exitThreshold: 0.60, payoutRatio: 0.80, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-GWR-0003", holder: "Blessing Sithole", nationalId: "63-7890123G78", zoneId: "gweru-rural", crop: "Maize", hectares: 1.5, sumInsured: 200, premium: 3.50, triggerThreshold: 0.62, exitThreshold: 0.52, payoutRatio: 0.95, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-GWR-0004", holder: "Priscilla Mhlanga", nationalId: "63-8901234H89", zoneId: "gweru-rural", crop: "Cotton", hectares: 6.5, sumInsured: 800, premium: 12.50, triggerThreshold: 0.68, exitThreshold: 0.58, payoutRatio: 0.75, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },

  // ---- Zhombe (zone threshold 0.70) ----
  { id: "AFC-ZHO-0001", holder: "Tafadzwa Ncube", nationalId: "63-9012345J90", zoneId: "zhombe", crop: "Maize", hectares: 3.3, sumInsured: 380, premium: 6.00, triggerThreshold: 0.68, exitThreshold: 0.58, payoutRatio: 0.85, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-ZHO-0002", holder: "Memory Chuma", nationalId: "63-0123456K01", zoneId: "zhombe", crop: "Groundnuts", hectares: 2.1, sumInsured: 260, premium: 4.20, triggerThreshold: 0.72, exitThreshold: 0.62, payoutRatio: 0.90, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-ZHO-0003", holder: "Joseph Mbewe", nationalId: "63-1234567L12", zoneId: "zhombe", crop: "Maize", hectares: 4.7, sumInsured: 550, premium: 8.80, triggerThreshold: 0.70, exitThreshold: 0.60, payoutRatio: 0.80, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-ZHO-0004", holder: "Rutendo Shumba", nationalId: "63-2345678M23", zoneId: "zhombe", crop: "Sorghum", hectares: 3.9, sumInsured: 450, premium: 7.00, triggerThreshold: 0.66, exitThreshold: 0.56, payoutRatio: 0.85, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },

  // ---- Mberengwa (zone threshold 0.75) ----
  { id: "AFC-MBE-0001", holder: "Tarisai Mudimu", nationalId: "63-3456789N34", zoneId: "mberengwa", crop: "Maize", hectares: 2.6, sumInsured: 320, premium: 5.20, triggerThreshold: 0.73, exitThreshold: 0.65, payoutRatio: 0.90, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-MBE-0002", holder: "Charles Nyoni", nationalId: "63-4567890P45", zoneId: "mberengwa", crop: "Cotton", hectares: 7.2, sumInsured: 900, premium: 14.00, triggerThreshold: 0.76, exitThreshold: 0.68, payoutRatio: 0.75, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-MBE-0003", holder: "Sekai Mutasa", nationalId: "63-5678901Q56", zoneId: "mberengwa", crop: "Maize", hectares: 3.5, sumInsured: 400, premium: 6.50, triggerThreshold: 0.74, exitThreshold: 0.66, payoutRatio: 0.85, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
  { id: "AFC-MBE-0004", holder: "Peter Chirwa", nationalId: "63-6789012R67", zoneId: "mberengwa", crop: "Groundnuts", hectares: 2.0, sumInsured: 240, premium: 4.00, triggerThreshold: 0.72, exitThreshold: 0.64, payoutRatio: 0.90, observationStart: "2026-10-01", observationEnd: "2027-03-31", status: "ACTIVE" },
];
