// Thresholds of `npm run lighthouse` on the median of the runs: "error" fails the run, "warn" is only reported.
export default {
    runs: 3,
    scores: {
        accessibility: { min: 0.95, level: "error" },
        performance: { min: 0.95, level: "warn" },
    },
    metrics: {
        "cumulative-layout-shift": { max: 0.02, level: "error" },
    },
    // transfer sizes in KB
    budgets: {
        script: { maxKb: 180, level: "error" },
    },
};
