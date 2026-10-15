import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Images, X } from "lucide-react";
import "./project-gallery-modal.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ProjectGalleryModal({ project, onClose }) {
  const [index, setIndex] = useState(0);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const images = project.images;

  const step = useCallback(
    delta => {
      setIndex(current => (current + delta + images.length) % images.length);
    },
    [images.length]
  );

  useEffect(() => {
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKeyDown = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll(FOCUSABLE)
      ).filter(node => node.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!panelRef.current.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, step]);

  const multiple = images.length > 1;

  return createPortal(
    <div
      className="project-gallery-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} image gallery`}
    >
      <button
        type="button"
        className="project-gallery-backdrop"
        onClick={onClose}
        aria-label="Close gallery"
        tabIndex={-1}
      />
      <div className="project-gallery-panel" ref={panelRef}>
        <div className="project-gallery-main">
          <div className="project-gallery-stage">
            <img
              key={images[index]}
              src={images[index]}
              alt={`${project.name} screenshot ${index + 1} of ${images.length}`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            {multiple && (
              <>
                <button
                  type="button"
                  className="project-gallery-arrow is-prev"
                  onClick={() => step(-1)}
                  aria-label="Previous image"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="button"
                  className="project-gallery-arrow is-next"
                  onClick={() => step(1)}
                  aria-label="Next image"
                >
                  <ArrowRight size={20} />
                </button>
              </>
            )}
            <span className="project-gallery-counter" aria-hidden="true">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </span>
          </div>
          {multiple && (
            <div className="project-gallery-thumbs" role="tablist" aria-label="Project images">
              {images.map((src, i) => (
                <button
                  type="button"
                  key={src}
                  role="tab"
                  aria-selected={i === index}
                  className={i === index ? "is-active" : ""}
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                >
                  <img src={src} alt="" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>
        <aside className="project-gallery-info">
          <div className="project-gallery-info-top">
            <span className="project-gallery-kicker">
              {project.number} / {project.category}
            </span>
            <button
              type="button"
              className="project-gallery-close"
              onClick={onClose}
              ref={closeRef}
              aria-label="Close gallery"
            >
              <X size={18} />
            </button>
          </div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <div className="project-gallery-tags">
            {project.tags.map(tag => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <a
            className="project-gallery-link"
            href={project.href}
            target="_blank"
            rel="noreferrer"
          >
            {project.label} <ArrowUpRight size={15} />
          </a>
          <span className="project-gallery-count">
            <Images size={13} />
            {images.length} {images.length === 1 ? "image" : "images"} in this
            gallery
          </span>
        </aside>
      </div>
    </div>,
    document.body
  );
}
