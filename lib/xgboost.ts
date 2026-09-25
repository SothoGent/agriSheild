/**
 * Pure-TypeScript inference for the trained gradient-boosted drought model.
 * The model is loaded from /public/models/xgb_drought.json.
 * No Python needed at runtime. Works on Vercel edge and in the browser.
 */

export type ModelNode =
  | { leaf: number }
  | { f: number; t: number; l: number; r: number };

export type ModelTree = { nodes: ModelNode[] };

export type ModelMetadata = {
  trained_at: string;
  algorithm: string;
  n_estimators: number;
  max_depth: number;
  learning_rate: number;
  features: string[];
  feature_importance: number[];
  train_accuracy: number;
  test_accuracy: number;
  auc: number;
  n_train: number;
  n_test: number;
  labels: Record<string, string>;
};

export type XgbModel = {
  metadata: ModelMetadata;
  base_score: number;
  learning_rate: number;
  trees: ModelTree[];
};

let cached: XgbModel | null = null;

export async function loadModel(): Promise<XgbModel> {
  if (cached) return cached;
  const res = await fetch("/models/xgb_drought.json");
  if (!res.ok) throw new Error("Failed to load model: " + res.status);
  cached = await res.json();
  return cached!;
}

function walkTree(tree: ModelTree, features: number[]): number {
  let idx = 0;
  let guard = 0;
  while (guard++ < 64) {
    const node = tree.nodes[idx];
    if (!node) return 0;
    if ("leaf" in node) return node.leaf;
    const value = features[node.f] ?? 0;
    idx = value <= node.t ? node.l : node.r;
  }
  return 0;
}

export function predict(model: XgbModel, features: number[]): number {
  let score = model.base_score;
  for (const tree of model.trees) {
    score += walkTree(tree, features);
  }
  score *= model.learning_rate;
  // Sigmoid
  return 1 / (1 + Math.exp(-score));
}

/**
 * Build the feature vector from a 30-day climate window.
 * Matches the training-time feature order exactly:
 *   dry_days, total_rain, avg_tmax, humidity_mean, consecutive_dry
 */
export function buildFeatures(
  dailyRain: number[],
  dailyTmax: number[],
  dailyHumidity: number[]
): number[] {
  const n = dailyRain.length;
  if (n === 0) return [0, 0, 0, 0, 0];

  let dryDays = 0;
  let totalRain = 0;
  let tmaxSum = 0;
  let humidSum = 0;
  let consecDry = 0;
  let maxConsecDry = 0;

  for (let i = 0; i < n; i++) {
    const rain = dailyRain[i] ?? 0;
    totalRain += rain;
    tmaxSum += dailyTmax[i] ?? 0;
    humidSum += dailyHumidity[i] ?? 0;

    if (rain < 1) {
      dryDays++;
      consecDry++;
      if (consecDry > maxConsecDry) maxConsecDry = consecDry;
    } else {
      consecDry = 0;
    }
  }

  return [
    dryDays,
    Math.round(totalRain * 10) / 10,
    Math.round((tmaxSum / n) * 10) / 10,
    Math.round((humidSum / n) * 10) / 10,
    maxConsecDry,
  ];
}
