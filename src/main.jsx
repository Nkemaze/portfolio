import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Menu, X,
  Mail, MoveUpRight, Code2, Layers3, Smartphone, Sparkles, Mouse
} from "lucide-react";
import meImage from "../me.jpeg";
import heroImage1 from "../image1.jpeg";
import heroImage2 from "../image2.png";
import "./styles.css";
import Hero from "./components/Hero";
import ProjectBook from "./components/ProjectBook";
import TechnologySection from "./components/TechnologySection";
import Header from "./components/Header";
import useTheme from "./hooks/useTheme";
import useSiteMotion from "./hooks/useSiteMotion";
import "./site-motion.css";
import "./theme.css";

function Github({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3.01-.4c1.02 0 2.05.14 3.01.4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

function Linkedin({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const projects = [
  {
    number: "01",
    name: "PharmaFinder",
    category: "HEALTHTECH · FLUTTER",
    description:
      "A pharmacy availability platform concept designed to help people find pharmacies and discover drug availability in Cameroon.",
    tags: ["Flutter", "Maps", "Inventory"],
    theme: "pharma",
    href: "https://github.com/Nkemaze/pharmafinder",
    label: "Explore project",
  },
  {
    number: "02",
    name: "DEVBUG",
    category: "DEVELOPER COMMUNITY · MERN",
    description:
      "A developer-focused space for asking questions, sharing knowledge, and working through technical problems together.",
    tags: ["React", "Node.js", "MongoDB"],
    theme: "devbug",
    href: "https://github.com/Nkemaze",
    label: "Explore project",
  },
  {
    number: "03",
    name: "MarketMemo",
    category: "FINTECH · PRODUCT CONCEPT",
    description:
      "An FX journaling experience for organizing trade notes, reviewing decisions, and learning from trading history.",
    tags: ["Product design", "Analytics", "Journal"],
    theme: "market",
    href: "https://github.com/Nkemaze",
    label: "Explore project",
  },
];

const experiments = [
  {
    number: "01",
    name: "PulseBoard",
    kind: "REAL-TIME ANALYTICS",
    accent: "#315cff",
    description:
      "A streaming dashboard that turns live events into readable, decision-ready signals for small teams.",
    tags: ["React", "Node.js", "WebSocket"],
    href: "https://github.com/Nkemaze",
    label: "View experiment",
  },
  {
    number: "02",
    name: "Nkemaze UI",
    kind: "DESIGN SYSTEM",
    accent: "#22a06b",
    description:
      "A small, opinionated component library built to keep interfaces consistent and quick to ship.",
    tags: ["React", "CSS", "Storybook"],
    href: "https://github.com/Nkemaze",
    label: "View experiment",
  },
  {
    number: "03",
    name: "Trailhead",
    kind: "MOBILE · FLUTTER",
    accent: "#e0a53c",
    description:
      "A lightweight habit tracker focused on momentum over streaks, designed for daily, honest use.",
    tags: ["Flutter", "Dart", "SQLite"],
    href: "https://github.com/Nkemaze",
    label: "View experiment",
  },
  {
    number: "04",
    name: "Orbit CLI",
    kind: "DEVELOPER TOOL",
    accent: "#8b6cff",
    description:
      "A command-line helper that scaffolds projects and automates the boring parts of setup.",
    tags: ["Node.js", "CLI", "DX"],
    href: "https://github.com/Nkemaze",
    label: "View experiment",
  },
];



function ProjectVisual({ theme }) {
  if (theme === "pharma") {
    return (
      <div className="visual visual-pharma" aria-label="Illustrative pharmacy dashboard preview">
        <div className="mock-sidebar">
          <div className="mock-brand"><span className="mock-brand-icon">+</span><span>pharma<span className="muted-word">finder</span></span></div>
          <div className="mock-nav active"><span>▦</span> Overview</div>
          <div className="mock-nav"><span>▤</span> Inventory</div>
          <div className="mock-nav"><span>⌖</span> Locations</div>
          <div className="mock-nav"><span>⚙</span> Settings</div>
          <div className="mock-sidebar-bottom"><span className="tiny-avatar">NB</span><span><b>Pharmacy admin</b><small>Workspace</small></span></div>
        </div>
        <div className="mock-main">
          <div className="mock-topline"><span>Overview</span><span className="mock-pill"><i /> Pharmacy open</span></div>
          <div className="mock-greeting">Good morning 👋<small>Here’s what’s happening at your pharmacy.</small></div>
          <div className="mock-stats">
            <div><small>Total medicines</small><b>1,284</b><em>In your inventory</em></div>
            <div><small>Available</small><b>1,106</b><em className="positive">↑ Stock overview</em></div>
            <div><small>Low stock</small><b>12</b><em>Needs attention</em></div>
          </div>
          <div className="mock-table">
            <div className="mock-table-head"><b>Recently updated</b><small>View all ↗</small></div>
            {["Paracetamol 500mg", "Amoxicillin 250mg", "Vitamin C"].map((item, i) => (
              <div className="mock-row" key={item}><span className={`drug-dot drug-${i}`} /> <span>{item}<small>{["Pain relief", "Antibiotic", "Supplement"][i]}</small></span><b>{["In stock", "In stock", "Low stock"][i]}</b></div>
            ))}
          </div>
        </div>
        <div className="visual-caption">PRODUCT INTERFACE / CONCEPT PREVIEW</div>
      </div>
    );
  }
  if (theme === "devbug") {
    return (
      <div className="visual visual-devbug" aria-label="Illustrative developer community interface preview">
        <div className="dev-window-top"><span className="window-dots"><i /><i /><i /></span><span>devbug.zone</span><span className="dev-top-right">⌘ K</span></div>
        <div className="dev-layout">
          <aside className="dev-side"><div className="dev-logo">DEV<span>BUG</span><b>⌁</b></div><small>MENU</small><p className="chosen">◈ &nbsp; All questions</p><p>♧ &nbsp; Tags</p><p>♙ &nbsp; Users</p><p>↗ &nbsp; Bookmarks</p><div className="dev-side-bottom">BUILD BETTER, TOGETHER.</div></aside>
          <div className="dev-content"><div className="dev-heading">Explore questions <span>＋ Ask question</span></div><p className="dev-subtitle">Find answers. Share what you know.</p>
            <div className="dev-question"><div className="vote"><b>18</b><small>votes</small></div><div><b>How do I structure a scalable Express API?</b><p>I'm organizing routes, controllers and services...</p><div className="dev-tags"><i>node.js</i><i>express</i><i>architecture</i></div><small>asked 2 hours ago · 6 answers</small></div></div>
            <div className="dev-question"><div className="vote"><b>12</b><small>votes</small></div><div><b>Understanding state updates in React</b><p>What is the best way to keep related state in sync?</p><div className="dev-tags"><i>react</i><i>javascript</i></div><small>asked yesterday · 4 answers</small></div></div>
            <div className="dev-question"><div className="vote"><b>9</b><small>votes</small></div><div><b>MongoDB indexing best practices</b><p>Choosing the right index for frequently used queries...</p><div className="dev-tags"><i>mongodb</i><i>database</i></div><small>asked 1 day ago · 3 answers</small></div></div>
          </div>
        </div>
        <div className="visual-caption">COMMUNITY PLATFORM / CONCEPT PREVIEW</div>
      </div>
    );
  }
  return (
    <div className="visual visual-market" aria-label="Illustrative FX journal interface preview">
      <div className="market-top"><div className="market-brand"><span>m.</span> marketmemo</div><span className="market-avatar">B</span></div>
      <div className="market-intro"><small>YOUR TRADING JOURNAL</small><h3>Make every trade<br />a lesson.</h3><p>Review your process. Not just your profit.</p></div>
      <div className="market-metrics"><div><small>Journal entries</small><b>24</b><span>This month</span></div><div><small>Tracked pairs</small><b>06</b><span>Across sessions</span></div></div>
      <div className="market-chart"><div className="chart-title">Performance review <small>LAST 7 SESSIONS</small></div><div className="chart-bars">{[32, 46, 39, 63, 50, 78, 66, 90, 73, 84, 61, 96].map((h, i) => <span key={i} style={{height:`${h}%`}} />)}</div><div className="chart-axis"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span></div></div>
      <div className="visual-caption">FX JOURNAL / CONCEPT PREVIEW</div>
    </div>
  );
}


function Reveal({ children, className = "" }) {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <div className={`reveal ${className}`}>{children}</div>;
}

function ProjectGallery() {
  const galleryRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const gallery = galleryRef.current;
    const track = trackRef.current;
    if (!gallery || !track) return;

    const total = projects.length;
    let frame = 0;

    const render = () => {
      frame = 0;
      const rect = gallery.getBoundingClientRect();
      const scrollable = gallery.offsetHeight - window.innerHeight;
      const raw = scrollable > 0 ? -rect.top / scrollable : 0;
      const progress = Math.min(1, Math.max(0, raw));
      const offset = progress * (total - 1);
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const o = i - offset;
        const ao = Math.abs(o);
        card.style.setProperty("--o", o.toFixed(4));
        card.style.setProperty("--ao", ao.toFixed(4));
        card.style.setProperty("--z", String(Math.round(100 - ao * 10)));
      });
      setActive(Math.round(offset));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === "touch") return;
      track.style.setProperty("--mx", (event.clientX / window.innerWidth - 0.5).toFixed(3));
      track.style.setProperty("--my", (event.clientY / window.innerHeight - 0.5).toFixed(3));
    };

    const onPointerLeave = () => {
      track.style.setProperty("--mx", "0");
      track.style.setProperty("--my", "0");
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    gallery.addEventListener("pointermove", onPointerMove);
    gallery.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      gallery.removeEventListener("pointermove", onPointerMove);
      gallery.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  const goTo = (index) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const clamped = Math.max(0, Math.min(projects.length - 1, index));
    const top = window.scrollY + gallery.getBoundingClientRect().top;
    const scrollable = gallery.offsetHeight - window.innerHeight;
    const progress = projects.length > 1 ? clamped / (projects.length - 1) : 0;
    window.scrollTo({ top: top + progress * scrollable, behavior: "smooth" });
  };

  const current = projects[active];

  return (
    <div className="gallery" ref={galleryRef}>
      <div className="gallery-sticky">
        <div className="gallery-stage">
          <div className="gallery-track" ref={trackRef}>
            {projects.map((project, i) => (
              <article
                key={project.name}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`gallery-card project-${project.theme}${i === active ? " is-active" : ""}`}
              >
                <div className="gallery-card-visual"><ProjectVisual theme={project.theme} /></div>
              </article>
            ))}
          </div>
        </div>

        <div className="gallery-readout" key={current.name}>
          <div className="gallery-readout-main">
            <div className="gallery-kicker">{current.category}</div>
            <h3>{current.name}</h3>
            <p>{current.description}</p>
            <div className="gallery-tags">{current.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <a className="gallery-link" href={current.href} target="_blank" rel="noreferrer">{current.label} <ArrowUpRight size={15} /></a>
          </div>
          <div className="gallery-side">
            <div className="gallery-index"><b>{current.number}</b><span>/ 03</span></div>
            <div className="gallery-controls">
              <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous project"><ArrowRight size={18} /></button>
              <button type="button" onClick={() => goTo(active + 1)} disabled={active === projects.length - 1} aria-label="Next project"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>

        <div className="gallery-progress">
          {projects.map((project, i) => (
            <button key={project.name} type="button" className={i === active ? "active" : ""} onClick={() => goTo(i)} aria-label={`Go to ${project.name}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectLab() {
  const labRef = useRef(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lab = labRef.current;
    if (!lab) return;

    const count = experiments.length;
    let frame = 0;

    const render = () => {
      frame = 0;
      const rect = lab.getBoundingClientRect();
      const scrollable = lab.offsetHeight - window.innerHeight;
      const raw = scrollable > 0 ? -rect.top / scrollable : 0;
      const p = Math.min(1, Math.max(0, raw));
      setProgress(p);
      setActive(Math.min(count - 1, Math.round(p * (count - 1))));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (index) => {
    const lab = labRef.current;
    if (!lab) return;
    const clamped = Math.max(0, Math.min(experiments.length - 1, index));
    const top = window.scrollY + lab.getBoundingClientRect().top;
    const scrollable = lab.offsetHeight - window.innerHeight;
    const p = experiments.length > 1 ? clamped / (experiments.length - 1) : 0;
    window.scrollTo({ top: top + p * scrollable, behavior: "smooth" });
  };

  const onMove = (event) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    el.style.setProperty("--tx", `${(x * -16).toFixed(1)}px`);
    el.style.setProperty("--ty", `${(y * -12).toFixed(1)}px`);
  };

  const onLeave = (event) => {
    event.currentTarget.style.setProperty("--tx", "0px");
    event.currentTarget.style.setProperty("--ty", "0px");
  };

  return (
    <section className="lab-section" id="lab">
      <div className="lab" ref={labRef}>
        <div className="lab-sticky" onMouseMove={onMove} onMouseLeave={onLeave} style={{ "--lab-accent": experiments[active].accent }}>
          <div className="lab-bg" aria-hidden="true">
            <span className="lab-blob lab-blob-a" />
            <span className="lab-blob lab-blob-b" />
            <span className="lab-blob lab-blob-c" />
          </div>
          <div className="lab-grain" aria-hidden="true" />

          <div className="lab-head">
            <div>
              <span className="section-kicker lab-kicker">03 / EXPERIMENTS &amp; EXTRAS</span>
              <h2 tabIndex={-1}>Built for the <em>joy</em> of building.</h2>
            </div>
            <div className="lab-head-right">
              <p>Smaller tools, side projects and experiments that keep the craft sharp.</p>
              <div className="lab-count"><b>{String(active + 1).padStart(2, "0")}</b><span>/ {String(experiments.length).padStart(2, "0")}</span></div>
            </div>
          </div>

          <div className="lab-stage">
            <div className="lab-ghost" aria-hidden="true">
              {experiments.map((item, i) => <span key={item.name} className={i === active ? "is-active" : ""}>{item.number}</span>)}
            </div>

            {experiments.map((item, i) => (
              <article className={`lab-slide ${i === active ? "is-active" : ""}`} key={item.name}>
                <div className="lab-slide-info">
                  <span className="lab-kind">{item.kind}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="lab-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <a className="lab-cta" href={item.href} target="_blank" rel="noreferrer">{item.label} <ArrowUpRight size={15} /></a>
                </div>

                <div className="lab-artifact">
                  <div className="lab-frame">
                    <div className="art-bar"><i /><i /><i /></div>
                    <div className="art-body">
                      <span className="art-line art-line-lg" />
                      <span className="art-line" />
                      <div className="art-tiles"><i /><i /><i /></div>
                      <span className="art-line art-line-sm" />
                      <span className="art-line" />
                    </div>
                  </div>
                  <span className="art-ring" aria-hidden="true" />
                  <span className="art-orb" aria-hidden="true" />
                  <span className="art-chip art-chip-a">{item.name}</span>
                  <span className="art-chip art-chip-b">{item.kind}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="lab-rail">
            {experiments.map((item, i) => (
              <button key={item.name} type="button" className={`lab-rail-item ${i === active ? "is-active" : ""} ${i < active ? "is-past" : ""}`} onClick={() => goTo(i)}>
                <span className="lab-rail-top"><b>{item.number}</b><span>{item.name}</span></span>
                <span className="lab-rail-bar" />
              </button>
            ))}
          </div>

          <div className="lab-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></div>
        </div>
      </div>
    </section>
  );
}

function App() {
  const theme = useTheme();
  useSiteMotion();
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!window.location.hash) return;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <Header {...theme} />
      <main id="top">
        <Hero workHref="#project-journal" />

        {/* <section className="work-section section-shell" id="work">
          <Reveal className="section-heading">
            <div><span className="section-kicker">01 / SELECTED WORK</span><h2>Built with purpose.<br /><em>Made to be useful.</em></h2></div>
            <p>A selection of products and experiments shaped by curiosity, practical thinking, and a love for solving problems.</p>
          </Reveal>
          <ProjectGallery />
          <div className="work-endnote"><span>MORE EXPERIMENTS ARE ALWAYS IN PROGRESS.</span><a href="https://github.com/Nkemaze" target="_blank" rel="noreferrer">Explore GitHub <ArrowUpRight size={15} /></a></div>
        </section> */}

        <ProjectBook projects={projects} renderVisual={(theme) => <ProjectVisual theme={theme} />} />

        {/* <ProjectLab /> */}

        <section className="about-section" id="about">
          <div className="section-shell about-grid">
            <Reveal className="about-heading"><span className="section-kicker">03 / A LITTLE ABOUT ME</span><h2>Good software<br />starts with<br /><em>good questions.</em></h2><div className="about-mark">B<span>.</span></div></Reveal>
            <Reveal className="about-content">
              <p className="about-lead">I'm Nkemaze Junio Bless, a software developer interested in building practical digital solutions to real-world problems.</p>
              <p>I enjoy taking an idea from its earliest stages through planning, interface design, development, and refinement. My work spans web applications, mobile experiences, backend systems, and emerging technologies.</p>
              <p>I'm continually learning, experimenting, and looking for better ways to turn complex problems into useful products.</p>
              <a className="underlined-link" href="#contact">A little more about working together <ArrowUpRight size={16} /></a>
              <div className="about-facts"><div><small>BASED IN</small><b>Cameroon</b></div><div><small>FOCUSED ON</small><b>Useful digital products</b></div><div><small>MINDSET</small><b>Always learning</b></div></div>
            </Reveal>
          </div>
        </section>

        <TechnologySection />

        <section className="contact-section" id="contact">
          <div className="contact-orbit orbit-one" /><div className="contact-orbit orbit-two" />
          <div className="section-shell contact-inner">
            <Reveal><span className="section-kicker">05 / YOUR TURN</span><h2>Have an idea<br />worth <em>building?</em></h2><p>Have a project, an interesting problem, or an opportunity to collaborate? Let's talk.</p><a className="contact-cta" href="mailto:hello@nkemazebless.com">Start a conversation <ArrowUpRight size={18} /></a></Reveal>
            <div className="contact-side"><span>OPEN TO GOOD IDEAS<br />AND MEANINGFUL WORK.</span><div className="contact-star">✳</div><small>YAOUNDÉ / CAMEROON<br />WORKING EVERYWHERE</small></div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <a href="#top" className="footer-logo">NB<span>.</span></a>
        <div className="footer-note">DESIGNED WITH INTENTION.<br />BUILT WITH CODE.</div>
        <div className="footer-socials"><a href="https://github.com/Nkemaze" target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a><a href="mailto:hello@nkemazebless.com"><Mail size={16} /> Email</a></div>
        <div className="footer-copy">© {year} BLESS. ALL RIGHTS RESERVED.</div>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
