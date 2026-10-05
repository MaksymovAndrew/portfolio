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
    // transfer sizes in KB; a per-page limit names the page, `other` covers the rest
    budgets: {
        script: { maxKb: 180, level: "error" },
        // "/" fetches the Latin files of three fonts; Polish and Ukrainian add the files of their letters
        font: { maxKb: { "/": 160, other: 280 }, level: "error" },
        total: { maxKb: { "/": 400, other: 600 }, level: "error" },
    },
};
