// @refresh reset
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mouse } from "lucide-react";
import heroImage1 from "../../image1.jpeg";
import heroImage2 from "../../image2.png";
import "./hero-motion.css";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function CharacterReveal({ text, className = "" }) {
  let offset = 0;
  return (
    <span className={`hero-line-text ${className}`.trim()}>
      {text.split(" ").map((word, wordIndex) => {
        const start = offset;
        offset += word.length + 1;
        return (
          <React.Fragment key={`${word}-${wordIndex}`}>
            {wordIndex > 0 && " "}
            <span className="hero-word">
              {Array.from(word).map((character, index) => (
                <span
                  className="hero-char"
                  key={`${character}-${index}`}
                  style={{ "--char-delay": `${(start + index) * 18}ms` }}
                  aria-hidden="true"
                >
                  {character}
                </span>
              ))}
            </span>
          </React.Fragment>
        );
      })}
    </span>
  );
}

export default function Hero({ showWorkCta = true, workHref = "#work" }) {
  const heroRef = useRef(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateReducedMotion = () => setIsReducedMotion(mediaQuery.matches);
    updateReducedMotion();
    mediaQuery.addEventListener?.("change", updateReducedMotion);
    return () =>
      mediaQuery.removeEventListener?.("change", updateReducedMotion);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      setHasEntered(true);
      return undefined;
    }

    let inView = false;
    let enteredBefore = false;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.08;
        const entering = visible && !inView;
        inView = visible;
        setIsVisible(visible);
        if (!entering) return;
        setHasEntered(true);
        if (enteredBefore) {
          // Replay in place: preserve focus, DOM identity, and layout.
          if (frame) cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            frame = 0;
            if (
              !inView ||
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
            )
              return;
            hero.getAnimations({ subtree: true }).forEach(animation => {
              if (animation instanceof CSSAnimation) {
                animation.currentTime = 0;
                animation.play();
              }
            });
          });
        }
        enteredBefore = true;
      },
      { threshold: [0, 0.08], rootMargin: "-76px 0px 0px 0px" }
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || isReducedMotion || typeof window === "undefined")
      return undefined;

    const finePointer = window.matchMedia?.("(pointer: fine)").matches;
    if (!finePointer) return undefined;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const renderParallax = () => {
      frame = 0;
      hero.style.setProperty(
        "--hero-parallax-x",
        `${(pointerX * 18).toFixed(2)}px`
      );
      hero.style.setProperty(
        "--hero-parallax-y",
        `${(pointerY * 14).toFixed(2)}px`
      );
      hero.style.setProperty("--hero-pointer-x", pointerX.toFixed(3));
      hero.style.setProperty("--hero-pointer-y", pointerY.toFixed(3));
    };

    const scheduleParallax = () => {
      if (!frame) frame = window.requestAnimationFrame(renderParallax);
    };

    const updatePointer = event => {
      const rect = hero.getBoundingClientRect();
      pointerX = clamp(
        (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5,
        -0.5,
        0.5
      );
      pointerY = clamp(
        (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5,
        -0.5,
        0.5
      );
      scheduleParallax();
    };

    const resetPointer = () => {
      pointerX = 0;
      pointerY = 0;
      scheduleParallax();
    };

    hero.addEventListener("pointermove", updatePointer, { passive: true });
    hero.addEventListener("pointerleave", resetPointer, { passive: true });
    return () => {
      hero.removeEventListener("pointermove", updatePointer);
      hero.removeEventListener("pointerleave", resetPointer);
      if (frame) window.cancelAnimationFrame(frame);
      hero.style.setProperty("--hero-parallax-x", "0px");
      hero.style.setProperty("--hero-parallax-y", "0px");
      hero.style.setProperty("--hero-pointer-x", "0");
      hero.style.setProperty("--hero-pointer-y", "0");
    };
  }, [isReducedMotion]);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || isReducedMotion || typeof window === "undefined")
      return undefined;

    let frame = 0;
    const updateScrollAway = () => {
      frame = 0;
      const rect = hero.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(rect.height * 0.62, 1), 0, 1);
      hero.style.setProperty("--hero-scroll-progress", progress.toFixed(3));
    };
    const scheduleScrollAway = () => {
      if (!frame) frame = window.requestAnimationFrame(updateScrollAway);
    };

    window.addEventListener("scroll", scheduleScrollAway, { passive: true });
    window.addEventListener("resize", scheduleScrollAway);
    scheduleScrollAway();
    return () => {
      window.removeEventListener("scroll", scheduleScrollAway);
      window.removeEventListener("resize", scheduleScrollAway);
      if (frame) window.cancelAnimationFrame(frame);
      hero.style.setProperty("--hero-scroll-progress", "0");
    };
  }, [isReducedMotion]);

  const heroClassName = [
    "hero",
    "hero-motion",
    hasEntered ? "is-visible" : "",
    hasEntered && !isVisible ? "is-offscreen" : "",
    isReducedMotion ? "is-reduced" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="intro" ref={heroRef} className={`page-shell ${heroClassName}`}>
      <div className="hero-copy">
        <div className="hero-intro hero-reveal hero-reveal-1">
          HI, I'M BLESS
        </div>
        <h1
          className="hero-reveal hero-reveal-2"
          aria-label="I BUILD DIGITAL THINGS THAT MATTER."
        >
          <span className="hero-line-mask" aria-hidden="true">
            <CharacterReveal text="I BUILD DIGITAL" />
          </span>
          <br aria-hidden="true" />
          <span className="hero-line-mask" aria-hidden="true">
            <CharacterReveal text="THINGS THAT " />
            <CharacterReveal text="MATTER." className="hero-emphasis" />
          </span>
        </h1>
        <p className="hero-subtext hero-reveal hero-reveal-3">
          Full-stack developer building web and mobile products, from first
          sketch to shipped experience. I care about thoughtful interfaces,
          reliable systems, and software that solves real problems for real
          people.
        </p>
        {showWorkCta ? (
          <div className="hero-actions hero-reveal hero-reveal-4">
            <a className="hero-work-cta" href={workHref}>
              <span>VIEW WORK</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
        ) : null}
        <div className="hero-meta-row hero-reveal hero-reveal-5">
          <div className="hero-line" />
          <span className="hero-meta-left">01 / INTRO</span>
          <div className="hero-scroll-cue">
            <Mouse size={30} aria-hidden="true" />
            <span>SCROLL TO EXPLORE</span>
          </div>
        </div>
      </div>

      <div
        className="hero-art hero-reveal hero-reveal-3"
        aria-label="Portfolio showcase visual"
      >
        <div className="hero-showcase">
          <div className="showcase" aria-hidden="true">
            <div className="stage">
              <svg className="rings" viewBox="0 0 1066 930" aria-hidden="true">
                <path pathLength="1" d="M800 169 A322 322 0 0 1 1008 580" />
                <path pathLength="1" d="M35 560 A226 226 0 0 0 262 856" />
                <circle
                  className="orbit-dot orbit-dot-one"
                  cx="800"
                  cy="169"
                  r="5"
                />
                <circle
                  className="orbit-dot orbit-dot-two"
                  cx="35"
                  cy="560"
                  r="4"
                />
              </svg>

              <div className="blue-shape" />
              <div className="hero-slice" />

              <div className="hero-callout hero-callout-logic">
                <span>01 / LOGIC</span>
                <i aria-hidden="true" />
              </div>
              <div className="hero-callout hero-callout-experience">
                <span>02 / EXPERIENCE</span>
                <i aria-hidden="true" />
              </div>

              <div className="hero-panel-float code-float">
                <div className="window code-window">
                  <img src={heroImage2} alt="Code editor screenshot" />
                </div>
              </div>

              <div className="hero-panel-float dash-float">
                <div className="window dash-window">
                  <img src={heroImage1} alt="PharmaFinder dashboard preview" />
                </div>
              </div>
              <div className="hero-stage-label">FROM CODE / TO PRODUCT</div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-side-copy hero-reveal hero-reveal-5">
        <div className="side-kicker">FULL-STACK DEVELOPER</div>
        <div className="side-kicker-sub">WEB • AI • PRODUCT</div>
        <div className="side-rule" />
        <p>
          Turning complex ideas into useful, thoughtful digital experiences.
        </p>
      </div>
    </section>
  );
}
