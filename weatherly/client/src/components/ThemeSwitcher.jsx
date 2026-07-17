import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { setTheme } from "../redux/themeSlice";

const THEMES = [
  { id: "default", label: "Default", swatch: "linear-gradient(135deg, #FFDFD1, #59C749)" },
  { id: "dark", label: "Dark Mode", swatch: "linear-gradient(135deg, #10240F, #59C749)" },
  { id: "ocean", label: "Ocean", swatch: "linear-gradient(135deg, #D1EEFF, #237A20)" },
  { id: "sunset", label: "Sunset", swatch: "linear-gradient(135deg, #FFD6B8, #F2994A)" },
];

export default function ThemeSwitcher() {
  const dispatch = useDispatch();
  const current = useSelector((state) => state.theme.current);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    document.body.classList.remove("theme-default", "theme-dark", "theme-ocean", "theme-sunset");
    document.body.classList.add(`theme-${current}`);
  }, [current]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/50 text-lg"
        aria-label="Switch theme"
        title="Switch theme"
      >
        🎨
      </button>
      {open && (
        <div className="glass-card-solid absolute right-0 top-12 z-50 w-48 p-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                dispatch(setTheme(t.id));
                setOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-white/60 ${
                current === t.id ? "bg-white/70" : ""
              }`}
            >
              <span
                className="h-5 w-5 flex-shrink-0 rounded-full border border-white/60"
                style={{ background: t.swatch }}
              />
              {t.label}
              {current === t.id && <span className="ml-auto text-mantis">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
