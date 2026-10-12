// @refresh reset
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Layers3,
  Smartphone,
  Sparkles,
} from "lucide-react";
import TechnologyIcon from "./TechnologyIcon";
import { technologyGroups, tools } from "../lib/technology.mjs";
import "./technology-section.css";

const groupSymbols = [Code2, Layers3, Smartphone, Sparkles];
export default function TechnologySection() {
  const sectionRef = useRef(null);
  const tabsRef = useRef([]);
  const [category, setCategory] = useState(0);
  const [selected, setSelected] = useState("React");
  const [entered, setEntered] = useState(false);
  const [visible, setVisible] = useState(false);
  const group = technologyGroups[category];
  const tool = tools[selected];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setEntered(true);
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setEntered(true);
      },
      { threshold: 0.08 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!section || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const move = event => {
      if (query.matches) return;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        section.style.setProperty(
          "--workshop-x",
          `${((event.clientX - rect.left) / rect.width - 0.5) * 10}deg`
        );
        section.style.setProperty(
          "--workshop-y",
          `${((event.clientY - rect.top) / rect.height - 0.5) * -7}deg`
        );
      });
    };
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      section.style.setProperty("--workshop-x", "0deg");
      section.style.setProperty("--workshop-y", "0deg");
    };
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", reset);
    query.addEventListener("change", reset);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", reset);
      query.removeEventListener("change", reset);
      reset();
    };
  }, []);

  const chooseCategory = index => {
    setCategory(index);
    setSelected(technologyGroups[index].items[0]);
  };
  const select = (name, index = category) => {
    setCategory(index);
    setSelected(name);
  };
  function tabKey(event, index) {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % 4;
    if (event.key === "ArrowLeft") next = (index + 3) % 4;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 3;
    if (next !== undefined) {
      event.preventDefault();
      chooseCategory(next);
      tabsRef.current[next]?.focus();
    }
  }

  return (
    <section
      className={`stack-section section-shell technology-section ${entered ? "workshop-entered" : ""} ${visible ? "workshop-visible" : ""}`}
      id="stack"
      ref={sectionRef}
      aria-labelledby="stack-heading"
    >
      <div className="section-heading stack-heading">
        <div>
          <span className="section-kicker">04 / TOOLS & TECHNOLOGY</span>
          <h2 id="stack-heading">
            The tools are different.
            <br />
            <em>The intention stays.</em>
          </h2>
        </div>
        <p>
          I choose technologies around the problem, the people using the
          product, and the needs of the system.
        </p>
      </div>
      <div
        className="workshop-category-tabs"
        role="tablist"
        aria-label="Technology categories"
      >
        {technologyGroups.map((item, index) => {
          const Symbol = groupSymbols[index];
          return (
            <button
              type="button"
              key={item.title}
              ref={el => {
                tabsRef.current[index] = el;
              }}
              role="tab"
              id={`workshop-tab-${index}`}
              aria-selected={category === index}
              aria-controls="workshop-panel"
              tabIndex={category === index ? 0 : -1}
              className={category === index ? "is-active" : ""}
              onClick={() => chooseCategory(index)}
              onKeyDown={event => tabKey(event, index)}
            >
              <span className="workshop-tab-number">0{index + 1}</span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.short}</small>
              </span>
              <Symbol size={19} />
            </button>
          );
        })}
      </div>
      <div
        className="workshop-panel"
        id="workshop-panel"
        role="tabpanel"
        aria-labelledby={`workshop-tab-${category}`}
      >
        <div className="workshop-scene" key={category}>
          <span className="workshop-coordinate coordinate-top">
            DIGITAL CRAFT / SYSTEM 0{category + 1}
          </span>
          <span className="workshop-scene-index" aria-hidden="true">
            0{category + 1}
          </span>
          <div className="workshop-lattice" aria-hidden="true" />
          <div className="workshop-network" aria-hidden="true">
            <svg viewBox="0 0 600 430" fill="none">
              <path
                d="M115 86Q210 86 300 215M480 86Q390 86 300 215M115 338Q210 338 300 215M480 338Q390 338 300 215"
                pathLength="1"
              />
              <path
                className="workshop-signal"
                d="M115 86Q210 86 300 215M480 86Q390 86 300 215M115 338Q210 338 300 215M480 338Q390 338 300 215"
                pathLength="1"
              />
              <circle cx="300" cy="215" r="112" />
              <circle
                className="workshop-orbit"
                cx="300"
                cy="215"
                r="125"
                strokeDasharray="3 22"
              />
            </svg>
          </div>
          <div className="workshop-nodes">
            {group.items.map((name, index) => (
              <button
                type="button"
                key={name}
                className={`workshop-node node-${index} ${name === selected ? "is-selected" : ""}`}
                style={{ "--node-delay": `${index * 90}ms` }}
                onClick={() => select(name)}
                aria-label={`Inspect ${name}`}
                aria-pressed={name === selected}
              >
                <span
                  className="workshop-node-icon"
                  style={{ color: tools[name].color }}
                >
                  <TechnologyIcon name={name} size={29} />
                </span>
                <span>{name}</span>
                <small>0{index + 1}</small>
              </button>
            ))}
          </div>
          <div className="workshop-core" key={selected}>
            <div className="workshop-core-logo" style={{ color: tool.color }}>
              <TechnologyIcon name={selected} size={59} />
            </div>
            <span>{selected}</span>
            <small>
              THE RIGHT TOOL.
              <br />
              THE RIGHT PURPOSE.
            </small>
          </div>
          <span className="workshop-coordinate coordinate-bottom">
            SELECT A TOOL TO EXPLORE <ArrowUpRight size={10} />
          </span>
        </div>
        <div className="workshop-detail" key={`${category}-${selected}`}>
          <div className="workshop-detail-top">
            <span className="workshop-status-dot" /> IN THE TOOLKIT{" "}
            <span>
              0{category + 1} / {group.title.toUpperCase()}
            </span>
          </div>
          <div className="workshop-detail-main">
            <span className="workshop-detail-name">{selected}</span>
            <h3>
              {tool.kind}
              <span>.</span>
            </h3>
            <p>{tool.detail}</p>
            <span className="workshop-detail-note">{tool.note}</span>
          </div>
          <div className="workshop-detail-bottom">
            <span>{group.detail}</span>
            <button
              type="button"
              onClick={() => {
                const next =
                  (group.items.indexOf(selected) + 1) % group.items.length;
                select(group.items[next]);
              }}
              aria-label="Inspect next technology"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      <div
        className="workshop-tool-index"
        aria-label="All tools and technologies"
      >
        {technologyGroups.map((item, index) => (
          <div className="workshop-index-group" key={item.title}>
            <h3>
              <span>0{index + 1}</span>
              {item.title}
            </h3>
            {item.items.map(name => (
              <button
                type="button"
                key={name}
                onClick={() => select(name, index)}
                className={name === selected ? "is-selected" : ""}
                aria-pressed={name === selected}
              >
                <TechnologyIcon name={name} size={18} />
                <span>{name}</span>
                <ArrowUpRight size={11} />
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="process-strip workshop-process">
        <span>HOW I APPROACH A PROBLEM</span>
        {["Understand", "Design", "Build", "Refine"].map((step, index) => (
          <React.Fragment key={step}>
            {index > 0 && <ArrowRight />}
            <div style={{ "--step-delay": `${index * 0.25}s` }}>
              <b>0{index + 1}</b>
              {step}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
