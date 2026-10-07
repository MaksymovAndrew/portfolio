import "@testing-library/jest-dom";
import "test/shims/dialog";

// the build inlines it from package.json; tests run without a build
Object.assign(process.env, { APP_VERSION: "0.0.0-test" });

afterEach(() => {
    // route handler tests run in the node environment, which has no storage
    if (typeof window === "undefined") {
        return;
    }

    localStorage.clear();
    sessionStorage.clear();
});
