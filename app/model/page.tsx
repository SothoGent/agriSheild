"use client";

import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import { loadModel, XgbModel } from "@/lib/xgboost";

export default function ModelPage() {
  const [model, setModel] = useState<XgbModel | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadModel()
      .then(setModel)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <TopNav />
      <main className="flex-1 p-10 max-w-6xl mx-auto w-full">
        <div className="mb-10">
          <div className="mono text-[10px] tracking-[0.3em] mb-2" style={{ color: "var(--fg-dimmer)" }}>
            MODEL CARD
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ color: "var(--fg)" }}>
            XGBoost drought classifier
          </h1>
          <p className="text-sm" style={{ color: "var(--fg-dim)" }}>
            Trained gradient-boosted trees, exported to JSON, executed in the browser.
          </p>
        </div>

        {error && (
          <div className="panel p-6" style={{ borderColor: "var(--alert)" }}>
            <div className="mono text-[11px]" style={{ color: "var(--alert)" }}>
              {error}
            </div>
            <div className="mono text-[11px] mt-2" style={{ color: "var(--fg-dim)" }}>
              Run: python train_xgb.py
            </div>
          </div>
        )}

        {model && (
          <div className="grid grid-cols-2 gap-6">
            <div className="panel bracket p-6">
              <div className="mono text-[10px] tracking-[0.3em] mb-4" style={{ color: "var(--fg-dimmer)" }}>
                PERFORMANCE
              </div>
              <Metric label="TEST ACCURACY" value={(model.metadata.test_accuracy * 100).toFixed(2) + "%"} accent="var(--accent)" />
              <Metric label="TRAIN ACCURACY" value={(model.metadata.train_accuracy * 100).toFixed(2) + "%"} />
              <Metric label="AUC" value={model.metadata.auc.toFixed(4)} accent="var(--nominal)" />
              <Metric label="TRAIN SAMPLES" value={model.metadata.n_train.toLocaleString()} />
              <Metric label="TEST SAMPLES" value={model.metadata.n_test.toLocaleString()} />
            </div>

            <div className="panel bracket p-6">
              <div className="mono text-[10px] tracking-[0.3em] mb-4" style={{ color: "var(--fg-dimmer)" }}>
                ARCHITECTURE
              </div>
              <Metric label="ALGORITHM" value={model.metadata.algorithm} />
              <Metric label="TREES" value={String(model.metadata.n_estimators)} />
              <Metric label="MAX DEPTH" value={String(model.metadata.max_depth)} />
              <Metric label="LEARNING RATE" value={String(model.metadata.learning_rate)} />
              <Metric label="TRAINED" value={model.metadata.trained_at.slice(0, 16).replace("T", " ")} />
            </div>

            <div className="panel bracket p-6 col-span-2">
              <div className="mono text-[10px] tracking-[0.3em] mb-4" style={{ color: "var(--fg-dimmer)" }}>
                FEATURE IMPORTANCE
              </div>
              {model.metadata.features.map((name, i) => {
                const imp = model.metadata.feature_importance[i] ?? 0;
                return (
                  <div key={name} className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="mono text-[11px]" style={{ color: "var(--fg)" }}>
                        {name}
                      </span>
                      <span className="mono text-[11px]" style={{ color: "var(--fg-dim)" }}>
                        {(imp * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ height: 3, background: "var(--border)" }}>
                      <div
                        style={{
                          height: "100%",
                          width: (imp * 100).toFixed(1) + "%",
                          background: "var(--accent)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Metric({
  label,
  value,
  accent = "var(--fg)",
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="flex justify-between items-baseline mb-4">
      <span className="mono text-[10px] tracking-[0.2em]" style={{ color: "var(--fg-dimmer)" }}>
        {label}
      </span>
      <span className="mono text-[14px]" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}
