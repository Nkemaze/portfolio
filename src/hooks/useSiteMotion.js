import { useEffect } from "react";

const MOTION_TARGETS = ".contact-cta, .underlined-link, .hero-work-cta";
const SECTION_TARGETS = "main section[id], #about, #contact";

function listenToMediaQuery(query, callback) {
  if (query.addEventListener) {
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
  }
  // Safari < 14 uses the deprecated MediaQueryList API.
  query.addListener(callback);
  return () => query.removeListener(callback);
}

function isInViewport(section) {
  const rect = section.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

/**
 * Adds DOM-only motion state. It intentionally never updates React state, so
 * scrolling and pointer movement do not cause an App render.
 */
export default function useSiteMotion() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return undefined;

    const root = document.documentElement;
    const sections = Array.from(document.querySelectorAll(SECTION_TARGETS));
    const targets = Array.from(document.querySelectorAll(MOTION_TARGETS));
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let reduced = motionQuery.matches;
    let observer;
    let pointerFrame = 0;
    let latestPointer = null;

    root.classList.add("site-motion-ready");
    root.classList.toggle("site-motion-reduced", reduced);

    const setSectionVisibility = (section, visible) => {
      section.classList.toggle("section-in-view", visible);
      if (visible) section.classList.add("section-entered");
    };

    const syncSectionVisibility = () => {
      sections.forEach(section => {
        // A reduced-motion change can happen without a new observer callback.
        setSectionVisibility(section, isInViewport(section));
      });
    };

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            setSectionVisibility(entry.target, entry.isIntersecting);
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
      );
      sections.forEach(section => observer.observe(section));
    } else {
      // CSS remains visible when JavaScript/IO is unavailable. Endless motion
      // is disabled by the companion stylesheet because visibility is unknown.
      root.classList.add("site-motion-no-observer");
      sections.forEach(section => setSectionVisibility(section, true));
    }

    const resetMagnetic = target => {
      target.style.setProperty("--magnetic-x", "0px");
      target.style.setProperty("--magnetic-y", "0px");
    };

    const renderMagnetic = () => {
      pointerFrame = 0;
      const sample = latestPointer;
      latestPointer = null;
      if (!sample || reduced) return;

      const { target, clientX, clientY } = sample;
      const rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const strength = target.matches(".contact-cta")
        ? 7
        : target.matches(".hero-work-cta")
          ? 5
          : 4;
      const x = ((clientX - rect.left) / rect.width - 0.5) * strength;
      const y = ((clientY - rect.top) / rect.height - 0.5) * strength * 0.72;
      target.style.setProperty("--magnetic-x", `${x.toFixed(2)}px`);
      target.style.setProperty("--magnetic-y", `${y.toFixed(2)}px`);
    };

    const onPointerMove = event => {
      if (reduced || event.pointerType === "touch") return;
      latestPointer = {
        target: event.currentTarget,
        clientX: event.clientX,
        clientY: event.clientY,
      };
      if (!pointerFrame)
        pointerFrame = window.requestAnimationFrame(renderMagnetic);
    };

    const onPointerLeave = event => {
      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
      }
      if (latestPointer?.target === event.currentTarget) latestPointer = null;
      resetMagnetic(event.currentTarget);
    };

    if (finePointer) {
      targets.forEach(target => {
        target.addEventListener("pointermove", onPointerMove, {
          passive: true,
        });
        target.addEventListener("pointerleave", onPointerLeave, {
          passive: true,
        });
        target.addEventListener("pointercancel", onPointerLeave, {
          passive: true,
        });
        resetMagnetic(target);
      });
    }

    const removeMotionListener = listenToMediaQuery(motionQuery, event => {
      reduced = event.matches;
      root.classList.toggle("site-motion-reduced", reduced);
      targets.forEach(resetMagnetic);
      if (pointerFrame) {
        window.cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
      }
      latestPointer = null;
      syncSectionVisibility();
    });

    return () => {
      removeMotionListener();
      if (observer) observer.disconnect();
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      targets.forEach(target => {
        target.removeEventListener("pointermove", onPointerMove);
        target.removeEventListener("pointerleave", onPointerLeave);
        target.removeEventListener("pointercancel", onPointerLeave);
        resetMagnetic(target);
      });
      sections.forEach(section => {
        section.classList.remove("section-in-view", "section-entered");
      });
      root.classList.remove(
        "site-motion-ready",
        "site-motion-reduced",
        "site-motion-no-observer"
      );
    };
  }, []);
}
