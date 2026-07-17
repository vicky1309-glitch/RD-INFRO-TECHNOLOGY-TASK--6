import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import GlassCard from "../components/GlassCard";
import { registerUser, clearAuthError } from "../redux/authSlice";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    if (form.password.length < 6) {
      setValidationError("Password must be at least 6 characters");
      return;
    }
    if (form.password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    dispatch(registerUser(form));
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard solid className="w-full max-w-md p-8">
          <div className="mb-6 text-center">
            <span className="text-4xl">🌿</span>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-ink">Create your account</h1>
            <p className="text-sm text-ink/60">Save favorites, personalize preferences and more</p>
          </div>

          {(error || validationError) && (
            <div className="mb-4 rounded-2xl bg-red-100 px-4 py-2 text-sm text-red-600">
              {validationError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              required
              placeholder="Full name"
              className="input-field"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
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
              placeholder="Password (min. 6 characters)"
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              type="password"
              required
              placeholder="Confirm password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit" disabled={loading} className="btn-primary mt-2 w-full">
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-dark-green hover:underline">
              Sign in
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
