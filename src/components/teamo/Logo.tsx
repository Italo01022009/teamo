export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-9 w-9 rounded-2xl gradient-hero flex items-center justify-center shadow-md">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
          <path d="M12 2C7 2 3 6 3 11c0 4 3 7 7 8v3l3-2c5-1 8-5 8-9 0-5-4-9-9-9zm0 4a3 3 0 110 6 3 3 0 010-6z" />
        </svg>
      </div>
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-primary">TEA</span>mo
      </span>
    </div>
  );
}
