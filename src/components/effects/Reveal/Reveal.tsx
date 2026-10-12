"use client";

import { useEffect } from "react";

import { REVEAL } from "constants/motion";

import { useReducedMotion } from "hooks/useReducedMotion";

const FLAG = "data-reveal";
const WAITING = `[${FLAG}=""]`;
// the blocks of every section and the footer after the main column
const TARGETS = "main section > *, main ~ footer";

const handBack = (event: Event) => {
    const { currentTarget, target } = event;

    // a transition of something inside the block bubbles up here too
    if (currentTarget === target && currentTarget instanceof Element) {
        currentTarget.removeAttribute(FLAG);
        currentTarget.removeEventListener("transitionend", handBack);
    }
};

const rise = (block: Element) => {
    block.addEventListener("transitionend", handBack);
    block.setAttribute(FLAG, "in");
};

// focus or a find-in-page landing inside a waiting block shows it at once
const riseAroundFocus = (event: FocusEvent) => {
    const block =
        event.target instanceof Element ? event.target.closest(WAITING) : null;

    if (block !== null) {
        rise(block);
    }
};

// blocks out of view at load wait below their place and rise once they enter; without the js class nothing is hidden
export const Reveal = () => {
    const reduced = useReducedMotion();

    useEffect(() => {
        if (reduced || !document.documentElement.classList.contains("js")) {
            return undefined;
        }

        const targets = [...document.querySelectorAll(TARGETS)];
        const reported = new WeakSet<Element>();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(
                ({ target, isIntersecting, boundingClientRect }) => {
                    const first = !reported.has(target);

                    reported.add(target);

                    if (first) {
                        // anything already on screen at load stays as the server drew it
                        if (boundingClientRect.top < window.innerHeight) {
                            observer.unobserve(target);
                        } else {
                            target.setAttribute(FLAG, "");
                        }

                        return;
                    }

                    if (isIntersecting) {
                        observer.unobserve(target);
                        rise(target);
                    }
                },
            );
        }, REVEAL);

        targets.forEach((target) => {
            observer.observe(target);
        });
        document.addEventListener("focusin", riseAroundFocus);

        return () => {
            observer.disconnect();
            document.removeEventListener("focusin", riseAroundFocus);
            targets.forEach((target) => {
                target.removeEventListener("transitionend", handBack);
                target.removeAttribute(FLAG);
            });
        };
    }, [reduced]);

    return null;
};
