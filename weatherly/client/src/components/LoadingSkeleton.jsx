export function WeatherCardSkeleton() {
  return (
    <div className="glass-card p-8">
      <div className="skeleton mb-4 h-6 w-32" />
      <div className="skeleton mb-6 h-16 w-48" />
      <div className="flex gap-4">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-20" />
      </div>
    </div>
  );
}

export function ForecastRowSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton h-24 w-20 flex-shrink-0 rounded-2xl" />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "" }) {
  return <div className={`skeleton h-40 w-full rounded-xl2 ${className}`} />;
}
