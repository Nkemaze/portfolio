import React from "react";
import { Moon, Sun } from "lucide-react";
import "./theme-toggle.css";

export default function ThemeToggle({ theme, toggle, switching }) {
  const dark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Dark theme"
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className={`theme-toggle ${dark ? "is-dark" : ""} ${switching ? "is-switching" : ""}`}
      onClick={toggle}
      disabled={switching}
    >
      <span className="theme-toggle-sky" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="theme-toggle-thumb" aria-hidden="true">
        <Sun className="theme-sun" size={15} />
        <Moon className="theme-moon" size={14} />
      </span>
      <span className="theme-toggle-label" aria-hidden="true">
        {dark ? "NIGHT" : "DAY"}
      </span>
    </button>
  );
}
