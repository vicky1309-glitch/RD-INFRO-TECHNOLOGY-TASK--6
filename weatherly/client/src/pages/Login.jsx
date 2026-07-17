import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import { loginUser, clearAuthError } from "../redux/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from?.pathname || "/", { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard solid className="w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <span className="text-4xl">🌿</span>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Welcome back</h1>
            <p className="text-sm text-ink/60">Sign in to your Weatherly account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-100 px-4 py-2 text-sm text-red-600">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              required
              placeholder="Email address"
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-dark-green hover:underline">
              Create one
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
