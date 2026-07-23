export default function Loading() {
  return (
    <div className="product-page" style={{ placeItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: "320px" }}>
        <div className="q-progress-track" style={{ marginBottom: "20px" }}>
          <div className="q-progress-fill" style={{ width: "30%" }} />
        </div>
        <h2 style={{ font: "500 24px/1.2 var(--font-serif), serif", margin: "0 0 6px" }}>
          Loading investment data…
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "9px", margin: 0 }}>
          Computing your allocation
        </p>
      </div>
    </div>
  );
}
