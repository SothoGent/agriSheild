export type Zone = {
  id: string;
  name: string;
  district: string;
  lat: number;
  lon: number;
  threshold: number;
  farmersEnrolled: number;
  policiesActive: number;
};

export const ZONES: Zone[] = [
  { id: "chiwundura", name: "Chiwundura", district: "Midlands", lat: -19.45, lon: 29.85, threshold: 0.72, farmersEnrolled: 4820, policiesActive: 4610 },
  { id: "gweru-rural", name: "Gweru Rural", district: "Midlands", lat: -19.52, lon: 29.72, threshold: 0.68, farmersEnrolled: 5180, policiesActive: 4920 },
  { id: "zhombe", name: "Zhombe", district: "Midlands", lat: -18.85, lon: 29.55, threshold: 0.70, farmersEnrolled: 3240, policiesActive: 3080 },
  { id: "mberengwa", name: "Mberengwa", district: "Midlands", lat: -20.55, lon: 29.90, threshold: 0.75, farmersEnrolled: 2960, policiesActive: 2740 },
];
