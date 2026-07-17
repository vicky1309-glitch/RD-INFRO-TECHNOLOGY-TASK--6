import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../redux/authSlice";
import ThemeSwitcher from "./ThemeSwitcher";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/compare", label: "Compare" },
  { to: "/planner", label: "Planner" },
];

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 px-4 pt-4">
      <nav className="glass-card mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-dark-green">
          <span className="text-2xl">🌿</span> Weatherly
        </NavLink>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? "bg-mantis text-white" : "text-ink/70 hover:bg-white/50"
                }`
              }
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          {isAuthenticated ? (
            <div className="hidden items-center gap-2 md:flex">
              <NavLink to="/profile" className="btn-secondary !px-4 !py-2 text-sm">
                {user?.name?.split(" ")[0] || "Profile"}
              </NavLink>
              <button onClick={handleLogout} className="btn-primary !px-4 !py-2 text-sm">
                Sign out
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="btn-primary hidden !px-4 !py-2 text-sm md:inline-flex">
              Sign in
            </NavLink>
          )}
          <button
            className="rounded-full p-2 text-xl md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-card mx-auto mt-2 max-w-6xl overflow-hidden px-5 py-3 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-ink/80 hover:bg-white/50"
                  end={link.to === "/"}
                >
                  {link.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-ink/80 hover:bg-white/50">
                    Profile
                  </NavLink>
                  <button onClick={handleLogout} className="rounded-xl px-4 py-2 text-left text-sm font-semibold text-ink/80 hover:bg-white/50">
                    Sign out
                  </button>
                </>
              ) : (
                <NavLink to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-ink/80 hover:bg-white/50">
                  Sign in
                </NavLink>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
