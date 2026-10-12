import { useCallback, useEffect, useRef, useState } from "react";

const storageKey = "bless-theme";
function readPreference() {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "dark" || saved === "light" ? saved : null;
  } catch {
    return null;
  }
}
function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#10131b" : "#f5f3ed");
}

export default function useTheme() {
  const [theme, setTheme] = useState(
    () =>
      document.documentElement.dataset.theme ||
      readPreference() ||
        "light"
  );
  const [switching, setSwitching] = useState(false);
  const busy = useRef(false);
  const cleanup = useRef(null);

  useEffect(() => {
    applyTheme(theme);
    const storage = event => {
      if (event.key !== storageKey) return;
      const next = readPreference() || "light";
      applyTheme(next);
      setTheme(next);
    };
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener("storage", storage);
    };
  }, [theme]);
  useEffect(() => () => cleanup.current?.(), []);

  const toggle = useCallback(
    event => {
      if (busy.current) return;
      busy.current = true;
      setSwitching(true);
      const next = theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* Theme still works with storage blocked. */
      }
      const root = document.documentElement;
      const rect = event?.currentTarget?.getBoundingClientRect();
      const x = rect ? rect.left + rect.width / 2 : innerWidth / 2;
      const y = rect ? rect.top + rect.height / 2 : 40;
      root.style.setProperty("--theme-x", `${x}px`);
      root.style.setProperty("--theme-y", `${y}px`);
      root.style.setProperty(
        "--theme-radius",
        `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`
      );
      const update = () => {
        applyTheme(next);
        setTheme(next);
      };
      const done = () => {
        root.classList.remove("theme-transitioning", "theme-view-transition");
        busy.current = false;
        setSwitching(false);
      };
      cleanup.current?.();
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        update();
        done();
        return;
      }
      if (document.startViewTransition) {
        root.classList.add("theme-view-transition");
        try {
          const transition = document.startViewTransition(update);
          transition.finished.catch(() => {}).finally(done);
          cleanup.current = () => transition.skipTransition();
          return;
        } catch {
          root.classList.remove("theme-view-transition");
        }
      }
      root.classList.add("theme-transitioning");
      update();
      const timer = setTimeout(done, 750);
      cleanup.current = () => {
        clearTimeout(timer);
        root.classList.remove("theme-transitioning");
      };
    },
    [theme]
  );
  return { theme, toggle, switching };
}
