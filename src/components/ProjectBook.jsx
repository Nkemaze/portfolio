// @refresh reset
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Images,
  MoveDown,
  RotateCcw,
} from "lucide-react";
import {
  bookState,
  clamp,
  pageScrollTarget,
  scrollProgress,
} from "../lib/bookProgress.mjs";
import ProjectGalleryModal from "./ProjectGalleryModal";
import "./project-book.css";

function JournalPage({ page, side, projects, openGallery, goTo }) {
  const last = projects.length + 2;
  const project = projects[page - 2];
  return (
    <div className={`journal-page journal-page-${side}`}>
      <div className="journal-page-top">
        <span>NB / DIGITAL CRAFT</span>
        <span>SELECTED WORK · VOL. 01</span>
      </div>
      {page === 1 && side === "left" && (
        <div className="journal-contents">
          <span className="journal-eyebrow">
            A collection of considered work
          </span>
          <h3>
            Ideas become
            <br />
            <em>something real.</em>
          </h3>
          <p>A few chapters in an ongoing story of building useful things.</p>
          <div className="journal-contents-list">
            {projects.map((item, index) => (
              <button
                type="button"
                key={item.name}
                onClick={() => goTo(index + 2)}
              >
                <span>{item.number}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>{item.category}</small>
                </div>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <span className="journal-note">SCROLL TO TURN THE PAGE</span>
        </div>
      )}
      {page === 1 && side === "right" && (
        <div className="journal-manifesto">
          <span className="journal-mark">
            B<span>.</span>
          </span>
          <div>
            <span className="journal-eyebrow">The intention stays</span>
            <h3>
              Built with purpose.
              <br />
              Made to be <em>useful.</em>
            </h3>
            <p>
              From first sketch to shipped experience. Thoughtful interfaces.
              Reliable systems. Real problems.
            </p>
            <button
              type="button"
              className="journal-text-link"
              onClick={() => goTo(2)}
            >
              Explore the chapters <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      {project && side === "left" && (
        <div className={`journal-project journal-project-${project.theme}`}>
          <span className="journal-eyebrow">
            {project.number} / {project.category}
          </span>
          <h3>
            {project.name}
            <span>.</span>
          </h3>
          <p>{project.description}</p>
          <div className="journal-project-tags">
            {project.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="journal-mobile-visual">
            <button
              type="button"
              className="journal-image-button"
              onClick={() => openGallery(project)}
              aria-label={`Open ${project.name} image gallery`}
            >
              <img
                src={project.images[0]}
                alt={`${project.name} preview`}
                loading="lazy"
                decoding="async"
              />
              <span className="journal-visual-badge">
                <Images size={12} />
                {project.images.length} images
              </span>
            </button>
          </div>
          <div className="journal-project-bottom">
            <span>PRODUCT / CONCEPT STUDY</span>
            <a href={project.href} target="_blank" rel="noreferrer">
              {project.label} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}
      {project && side === "right" && (
        <div className="journal-project-preview">
          <div className="journal-preview-label">
            <span>{project.name}</span>
            <span>INTERFACE EXPLORATION ↗</span>
          </div>
          <button
            type="button"
            className="journal-visual"
            onClick={() => openGallery(project)}
            aria-label={`Open ${project.name} image gallery`}
          >
            <img
              src={project.images[0]}
              alt={`${project.name} preview`}
              loading="lazy"
              decoding="async"
            />
            <span className="journal-visual-badge">
              <Images size={12} />
              {project.images.length} images
            </span>
          </button>
          <div className="journal-preview-footer">
            <span>
              Thoughtful by design.
              <br />
              Useful by intention.
            </span>
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Explore ${project.name} on GitHub`}
            >
              <ArrowUpRight size={22} />
            </a>
          </div>
        </div>
      )}
      {page === last && side === "left" && (
        <div className="journal-finish">
          <span className="journal-eyebrow">The next chapter</span>
          <h3>
            There's more
            <br />
            to <em>build.</em>
          </h3>
          <p>
            Every project starts with a good question.
            <br />
            What could we make together?
          </p>
          <a href="#contact" className="journal-text-link">
            Start a conversation <ArrowUpRight size={16} />
          </a>
          <span className="journal-note">
            ALWAYS LEARNING. ALWAYS BUILDING.
          </span>
        </div>
      )}
      {page === last && side === "right" && (
        <div className="journal-endmark">
          <span className="journal-mark">
            NB<span>.</span>
          </span>
          <p>
            DESIGNED WITH INTENTION.
            <br />
            BUILT WITH CODE.
          </p>
          <button
            type="button"
            className="journal-text-link"
            onClick={() => goTo(0)}
          >
            Back to the cover <RotateCcw size={14} />
          </button>
        </div>
      )}
      <div className="journal-page-bottom">
        <span>NKEMAZE BLESS / CAMEROON</span>
        <span>
          {String(
            Math.max(0, (page - 1) * 2 + (side === "left" ? 1 : 2))
          ).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function ProjectBook({ projects }) {
  const sectionRef = useRef(null);
  const shellRef = useRef(null);
  const dragRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [galleryProject, setGalleryProject] = useState(null);
  const [mobile, setMobile] = useState(
    () => window.matchMedia("(max-width:720px)").matches
  );
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const last = projects.length + 2;
  const state = bookState(progress, last);
  const labels = [
    "The cover",
    "Contents",
    ...projects.map(project => project.name),
    "The next chapter",
  ];
  const headerHeight = () =>
    document.querySelector(".site-header")?.offsetHeight || 76;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width:720px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setMobile(mobileQuery.matches);
      setReduced(motionQuery.matches);
    };
    mobileQuery.addEventListener("change", update);
    motionQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      motionQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const render = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      setProgress(
        scrollProgress(
          section.getBoundingClientRect().top,
          section.offsetHeight,
          window.innerHeight,
          headerHeight()
        )
      );
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    render();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduced]);

  const goTo = useCallback(
    page => {
      page = clamp(page, 0, last);
      if (reduced) {
        setProgress(page / last);
        return;
      }
      const section = sectionRef.current;
      if (!section) return;
      const top = window.scrollY + section.getBoundingClientRect().top;
      window.scrollTo({
        top: pageScrollTarget(
          top,
          section.offsetHeight,
          window.innerHeight,
          headerHeight(),
          page,
          last
        ),
        behavior: "smooth",
      });
    },
    [last, reduced]
  );

  useEffect(() => {
    const key = event => {
      const section = sectionRef.current;
      if (
        !section ||
        event.defaultPrevented ||
        document.querySelector('[role="dialog"]') ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey
      )
        return;
      const rect = section.getBoundingClientRect();
      if (
        rect.top > headerHeight() + 35 ||
        rect.bottom < window.innerHeight - 35
      )
        return;
      if (
        event.target instanceof Element &&
        event.target.closest("input,textarea,select,[role=dialog]")
      )
        return;
      const mapping = {
        ArrowRight: state.active + 1,
        ArrowLeft: state.active - 1,
        Home: 0,
        End: last,
      };
      if (event.key in mapping) {
        event.preventDefault();
        goTo(mapping[event.key]);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [state.active, goTo, last]);

  function dragStart(event) {
    if (event.button !== 0 || event.target.closest("a,button")) return;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      progress,
      latest: progress,
      horizontal: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function dragMove(event) {
    const start = dragRef.current;
    if (!start) return;
    const dx = start.x - event.clientX;
    const dy = start.y - event.clientY;
    if (!start.horizontal && Math.abs(dy) > Math.abs(dx) + 10) {
      dragRef.current = null;
      return;
    }
    if (Math.abs(dx) > 8) start.horizontal = true;
    if (!start.horizontal) return;
    const next = clamp(
      start.progress +
        dx / Math.max(1, shellRef.current.clientWidth * 0.45) / last
    );
    start.latest = next;
    if (reduced) setProgress(next);
    else {
      const section = sectionRef.current;
      window.scrollTo({
        top: pageScrollTarget(
          window.scrollY + section.getBoundingClientRect().top,
          section.offsetHeight,
          window.innerHeight,
          headerHeight(),
          next * last,
          last
        ),
        behavior: "instant",
      });
    }
  }
  function dragEnd(event) {
    const start = dragRef.current;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (start?.horizontal) goTo(Math.round(start.latest * last));
  }
  const page = (number, side) => (
    <JournalPage
      page={number}
      side={side}
      projects={projects}
      openGallery={setGalleryProject}
      goTo={goTo}
    />
  );
  const coverProgress = clamp(state.position);
  const turning = state.from >= 1 && state.from < last && state.turn > 0.001;
  const left = turning && mobile ? state.to : Math.max(1, state.from);
  const right = turning ? state.to : Math.max(1, state.from);
  const skip = () => {
    const section = sectionRef.current;
    const heading = document.getElementById("about")?.querySelector("h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    window.scrollTo({
      top:
        window.scrollY +
        section.getBoundingClientRect().bottom -
        headerHeight(),
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section
      className={`project-journal ${reduced ? "journal-reduced" : ""}`}
      id="project-journal"
      ref={sectionRef}
      aria-labelledby="journal-heading"
    >
      <div className="journal-sticky section-shell">
        <div className="journal-heading">
          <div>
            <span className="section-kicker">02 / THE PROJECT JOURNAL</span>
            <h2 id="journal-heading">
              A different way
              <br />
              to <em>explore the work.</em>
            </h2>
          </div>
          <div className="journal-heading-aside">
            <p>
              One collection. A few good chapters.
              <br />
              Scroll down to turn the pages.
            </p>
            <button type="button" onClick={skip}>
              Continue to about <MoveDown size={13} />
            </button>
          </div>
        </div>
        <div className="journal-stage">
          <div className="journal-stage-grid" aria-hidden="true" />
          <div
            className="journal-book-shadow"
            style={{
              transform: `translate(-50%, -50%) scaleX(${0.5 + coverProgress * 0.5})`,
            }}
          />
          <div
            className={`journal-book ${state.position < 0.01 ? "journal-closed" : ""}`}
            ref={shellRef}
            style={{ "--journal-open": coverProgress }}
            role="group"
            aria-label="Scroll-driven project book"
            onPointerDown={dragStart}
            onPointerMove={dragMove}
            onPointerUp={dragEnd}
            onPointerCancel={() => {
              dragRef.current = null;
            }}
          >
            <div className="journal-backboard" />
            <div className="journal-stack" />
            <div
              className="journal-static journal-static-left"
              inert={state.position < 0.97 || undefined}
            >
              {page(left, "left")}
            </div>
            <div
              className="journal-static journal-static-right"
              inert={state.position < 0.97 || undefined}
            >
              {page(right, "right")}
            </div>
            <div className="journal-spine" aria-hidden="true" />
            {turning && (
              <div
                className="journal-leaf"
                inert
                style={{ transform: `rotateY(${-180 * state.turn}deg)` }}
              >
                <div className="journal-leaf-face journal-leaf-front">
                  {page(state.from, mobile ? "left" : "right")}
                  <div
                    className="journal-leaf-light"
                    style={{ opacity: Math.sin(state.turn * Math.PI) * 0.5 }}
                  />
                </div>
                <div className="journal-leaf-face journal-leaf-back">
                  {page(state.to, "left")}
                  <div
                    className="journal-leaf-light"
                    style={{ opacity: Math.sin(state.turn * Math.PI) * 0.4 }}
                  />
                </div>
              </div>
            )}
            {state.position < 1 && (
              <button
                type="button"
                className="journal-cover"
                onClick={() => goTo(1)}
                aria-label="Open project journal"
                style={{ transform: `rotateY(${-180 * coverProgress}deg)` }}
              >
                <div className="journal-cover-top">
                  <span>THE WORK OF</span>
                  <span>VOL. 01 / 2026</span>
                </div>
                <div className="journal-cover-title">
                  <span>
                    NB<span>.</span>
                  </span>
                  <h3>
                    The project
                    <br />
                    journal.
                  </h3>
                  <p>USEFUL THINGS. THOUGHTFULLY BUILT.</p>
                </div>
                <div className="journal-cover-bottom">
                  <span>
                    NKEMAZE BLESS
                    <br />
                    FULL-STACK DEVELOPER
                  </span>
                  <span>
                    SCROLL TO OPEN <ArrowUpRight size={15} />
                  </span>
                </div>
                <div className="journal-cover-back" aria-hidden="true" />
              </button>
            )}
          </div>
          <span className="journal-desk-note">
            DESIGNED WITH INTENTION / BUILT WITH CODE
          </span>
        </div>
        <div className="journal-controls">
          <div className="journal-scroll-hint">
            <BookOpen size={16} />
            <span>
              {reduced
                ? "USE THE CONTROLS TO EXPLORE"
                : "SCROLL TO TURN THE PAGES"}
            </span>
          </div>
          <div className="journal-page-navigation">
            <button
              type="button"
              aria-label="Previous journal page"
              disabled={state.active === 0}
              onClick={() => goTo(state.active - 1)}
            >
              <ArrowLeft size={17} />
            </button>
            <span>
              {String(state.active + 1).padStart(2, "0")}{" "}
              <small>/ {String(last + 1).padStart(2, "0")}</small>
            </span>
            <button
              type="button"
              aria-label="Next journal page"
              disabled={state.active === last}
              onClick={() => goTo(state.active + 1)}
            >
              <ArrowRight size={17} />
            </button>
          </div>
          <button
            className="journal-contents-toggle"
            type="button"
            onClick={() => goTo(1)}
          >
            Contents <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="journal-progress">
          {labels.map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => goTo(index)}
              className={state.active === index ? "active" : ""}
              aria-label={`Journal: ${label}`}
              aria-current={state.active === index ? "step" : undefined}
            >
              <span />
            </button>
          ))}
        </div>
        <span className="journal-live" role="status" aria-live="polite">
          {labels[state.active]} — chapter {state.active + 1} of {last + 1}
        </span>
      </div>
      {galleryProject && (
        <ProjectGalleryModal
          project={galleryProject}
          onClose={() => setGalleryProject(null)}
        />
      )}
    </section>
  );
}
