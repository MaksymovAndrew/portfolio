import { activeSectionStore } from "utils/activeSectionStore";

import { intersect, isObserved } from "test/shims/intersectionObserver";

// the sections a navigation lists
const IDS = ["skills", "about", "experience", "education", "contact"] as const;

// a tall section crossing the band shows only in part
const PARTLY = 0.5;

const section = (id: string) => {
    const element = document.createElement("section");

    element.id = id;
    document.body.append(element);

    return element;
};

describe("activeSectionStore", () => {
    afterEach(() => {
        document.body.innerHTML = "";
    });

    it("should report the section that enters the band", () => {
        const about = section("about");
        const contact = section("contact");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(about, true);
        intersect(contact, true);
        const current = activeSectionStore.getSnapshot();

        unsubscribe();

        expect(current).toBe("contact");
        expect(activeSectionStore.getServerSnapshot()).toBeNull();
    });

    it("should keep the last section when none is inside", () => {
        const experience = section("experience");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(experience, true);
        intersect(experience, false);
        const current = activeSectionStore.getSnapshot();

        unsubscribe();

        expect(current).toBe("experience");
    });

    it("should clear the section when the reader goes back to the first screen", () => {
        const about = section("about");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(about, true, 0, PARTLY);
        // the section drops below the band: the window moved up past its top
        intersect(about, false, 400);
        const current = activeSectionStore.getSnapshot();

        unsubscribe();

        expect(current).toBeNull();
    });

    it("should move to the section above when the current one drops below the band", () => {
        const about = section("about");
        const skills = section("skills");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(about, true);
        intersect(about, false, 400);
        intersect(skills, true);
        const current = activeSectionStore.getSnapshot();

        unsubscribe();

        expect(current).toBe("skills");
    });

    it("should forget the section once nobody listens", () => {
        const contact = section("contact");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(contact, true);
        unsubscribe();

        expect(activeSectionStore.getSnapshot()).toBeNull();
    });

    it("should observe only while someone listens", () => {
        const education = section("education");
        const first = activeSectionStore.subscribe(() => undefined, IDS);
        const second = activeSectionStore.subscribe(() => undefined, IDS);

        first();
        const observedWithOneLeft = isObserved(education);

        second();

        expect(observedWithOneLeft).toBe(true);
        expect(isObserved(education)).toBe(false);
    });

    it("should watch only the sections a navigation lists", () => {
        const skills = section("skills");
        const about = section("about");
        const unsubscribe = activeSectionStore.subscribe(
            () => undefined,
            ["about"],
        );
        const observed = [isObserved(skills), isObserved(about)];

        unsubscribe();

        expect(observed).toEqual([false, true]);
    });

    it("should mark the topmost of two sections in the band", () => {
        const education = section("education");
        const contact = section("contact");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(education, true, 0, PARTLY);
        intersect(contact, true, 0, PARTLY);
        const current = activeSectionStore.getSnapshot();

        unsubscribe();

        expect(current).toBe("education");
    });

    it("should mark the last section once it is in full view", () => {
        const education = section("education");
        const contact = section("contact");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(education, true, 0, PARTLY);
        intersect(contact, true, 0, 1);
        const current = activeSectionStore.getSnapshot();

        unsubscribe();

        expect(current).toBe("contact");
    });

    it("should keep a chosen section until the reader scrolls", () => {
        const education = section("education");
        const contact = section("contact");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        activeSectionStore.hold("education");
        intersect(education, true, 0, PARTLY);
        intersect(contact, true, 0, 1);
        const held = activeSectionStore.getSnapshot();

        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab" }));
        const afterTab = activeSectionStore.getSnapshot();

        window.dispatchEvent(new WheelEvent("wheel"));
        const afterWheel = activeSectionStore.getSnapshot();

        unsubscribe();

        expect([held, afterTab, afterWheel]).toEqual([
            "education",
            "education",
            "contact",
        ]);
    });

    it("should let a scrolling key end the hold", () => {
        const about = section("about");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(about, true, 0, PARTLY);
        activeSectionStore.hold("contact");
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "PageDown" }));
        const current = activeSectionStore.getSnapshot();

        unsubscribe();

        expect(current).toBe("about");
    });

    it("should end the hold on the first scroll after the link's own", () => {
        const about = section("about");
        const unsubscribe = activeSectionStore.subscribe(() => undefined, IDS);

        intersect(about, true, 0, PARTLY);
        activeSectionStore.hold("contact");
        // the scroll the link started is still going
        window.dispatchEvent(new Event("scroll"));
        const whileScrolling = activeSectionStore.getSnapshot();

        window.dispatchEvent(new Event("scrollend"));
        window.dispatchEvent(new Event("scroll"));
        const afterReaderScroll = activeSectionStore.getSnapshot();

        unsubscribe();

        expect([whileScrolling, afterReaderScroll]).toEqual([
            "contact",
            "about",
        ]);
    });
});
