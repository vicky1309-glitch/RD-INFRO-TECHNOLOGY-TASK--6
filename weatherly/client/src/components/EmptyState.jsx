export default function EmptyState({ icon = "🍃", title, message, action }) {
  return (
    <div className="glass-card flex flex-col items-center gap-3 p-10 text-center">
      <span className="text-5xl">{icon}</span>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      {message && <p className="max-w-sm text-sm text-ink/60">{message}</p>}
      {action}
    </div>
  );
}
