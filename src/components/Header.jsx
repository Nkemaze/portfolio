// @refresh reset
import React, { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  House,
  Layers3,
  Mail,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import meImage from "../../me.jpeg";
import { activeSection, navigation } from "../lib/navigation.mjs";
import ThemeToggle from "./ThemeToggle";
import "./header.css";

const icons = {
  home: House,
  book: BookOpen,
  person: UserRound,
  stack: Layers3,
  mail: Mail,
};
export default function Header({ theme, toggle, switching }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("intro");
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const linkRefs = useRef({});
  const close = (restore = false) => {
    setOpen(false);
    if (restore) toggleRef.current?.focus();
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = headerRef.current;
      if (!header) return;
      const sections = navigation
        .map(item => ({ id: item.id, node: document.getElementById(item.id) }))
        .filter(item => item.node)
        .map(item => ({
          id: item.id,
          top: item.node.getBoundingClientRect().top,
        }));
      const max = Math.max(
        1,
        document.documentElement.scrollHeight - innerHeight
      );
      setActive(
        activeSection(
          sections,
          innerHeight,
          header.offsetHeight,
          scrollY >= max - 3
        )
      );
      setScrolled(scrollY > 20);
      header.style.setProperty(
        "--reading-progress",
        Math.min(1, Math.max(0, scrollY / max))
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.querySelector("main"));
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const nav = menuRef.current;
    const link = linkRefs.current[active];
    if (!nav || !link) return;
    const position = () => {
      nav.style.setProperty("--nav-marker-left", `${link.offsetLeft}px`);
      nav.style.setProperty("--nav-marker-width", `${link.offsetWidth}px`);
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [active, open]);
  useEffect(() => {
    if (!open) return;
    const onKey = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };
    const onPointer = event => {
      if (!headerRef.current?.contains(event.target)) close();
    };
    const query = matchMedia("(min-width:1101px)");
    const onResize = () => {
      if (query.matches) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    query.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      query.removeEventListener("change", onResize);
    };
  }, [open]);

  const navigate = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    close();
    setActive(id);
    history.pushState(null, "", `#${id}`);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = Math.max(
      0,
      scrollY +
        target.getBoundingClientRect().top -
        (headerRef.current?.offsetHeight || 76)
    );
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    const heading = target.querySelector("h1,h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  };
  return (
    <header
      className={`site-header header-enhanced ${scrolled ? "header-scrolled" : ""} ${open ? "header-menu-open" : ""}`}
      ref={headerRef}
    >
      <a
        href="#intro"
        className="wordmark"
        aria-label="Bless home"
        onClick={event => navigate(event, "intro")}
      >
        <span className="wordmark-portrait">
          <img src={meImage} alt="" className="wordmark-avatar" />
        </span>
        <span className="wordmark-slash">/</span>
        <span className="wordmark-role">NKEMAZE BLESS</span>
      </a>
      <nav
        id="primary-nav"
        aria-label="Main navigation"
        ref={menuRef}
        className={`nav-links ${open ? "nav-open" : ""}`}
      >
        <span className="nav-mobile-caption">EXPLORE THE PORTFOLIO</span>
        {navigation.map(item => {
          const Icon = icons[item.icon];
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              ref={el => {
                linkRefs.current[item.id] = el;
              }}
              className={`nav-link ${active === item.id ? "active" : ""}`}
              aria-current={active === item.id ? "location" : undefined}
              onClick={event => navigate(event, item.id)}
            >
              <Icon size={14} aria-hidden="true" />
              <span>{item.label}</span>
              <small>{item.number}</small>
            </a>
          );
        })}
        <span className="nav-active-marker" aria-hidden="true" />
        <a className="nav-mobile-contact" href="mailto:hello@nkemazebless.com">
          LET'S BUILD SOMETHING <ArrowUpRight size={15} />
        </a>
      </nav>
      <div className="header-actions">
        <a
          className="header-availability"
          href="#contact"
          onClick={event => navigate(event, "contact")}
          title="Available for new projects"
        >
          <span className="status-dot" aria-hidden="true" />
          <span>Let's talk</span>
          <ArrowUpRight size={12} />
        </a>
        <ThemeToggle theme={theme} toggle={toggle} switching={switching} />
        <button
          type="button"
          ref={toggleRef}
          className={`menu-toggle ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-nav"
          onClick={() => setOpen(value => !value)}
        >
          <span />
          <span />
        </button>
      </div>
      <span className="header-reading-progress" aria-hidden="true" />
    </header>
  );
}
