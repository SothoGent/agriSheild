import { NasaPoint } from "./nasa";
import { loadModel, predict, buildFeatures } from "./xgboost";

/**
 * Compute drought risk using the trained XGBoost model.
 * Falls back to a heuristic formula if the model file is missing.
 */
export async function computeRisk(points: NasaPoint[]) {
  const dailyRain = points.map((p) => p.rainfall);
  const dailyTmax = points.map((p) => p.tmax);
  const dailyHumidity = points.map((p) => p.humidity);

  const features = buildFeatures(dailyRain, dailyTmax, dailyHumidity);

  let score: number;
  let source: string;

  try {
    const model = await loadModel();
    score = predict(model, features);
    source = "xgboost";
  } catch {
    // Fallback heuristic (same formula as before) if model fails to load
    const dryFactor = Math.min(features[0] / 30, 1);
    const rainFactor = Math.max(0, 1 - features[1] / 60);
    const heatFactor = Math.min(Math.max((features[2] - 25) / 15, 0), 1);
    score = 0.5 * dryFactor + 0.3 * rainFactor + 0.2 * heatFactor;
    source = "heuristic";
  }

  return {
    score: Math.round(score * 1000) / 1000,
    dryDays: features[0],
    totalRain: features[1],
    avgTmax: features[2],
    humidity: features[3],
    consecutiveDry: features[4],
    source,
    features,
  };
}
