"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="product-page" style={{ placeItems: "center" }}>
      <div className="fatal-card" style={{ maxWidth: "380px" }}>
        <h1>Something went wrong</h1>
        <p style={{ margin: "0 0 16px", color: "var(--muted)", fontSize: "10px" }}>
          {error.message || "An unexpected error occurred while loading the assessment."}
        </p>
        <button
          className="btn btn--ghost"
          onClick={() => reset()}
          style={{ cursor: "pointer" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
