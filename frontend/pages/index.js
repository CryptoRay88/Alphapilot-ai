import { useEffect, useState } from "react";

export default function Home() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSignals();
  }, []);

  const fetchSignals = async () => {
    const res = await fetch("http://localhost:5000/signals");
    const data = await res.json();
    setSignals(data);
  };

  const explainSignal = async (signal) => {
    setLoading(true);

    const res = await fetch("http://localhost:5000/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signal })
    });

    const data = await res.json();
    alert(data.explanation);

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>🚀 AlphaPilot AI</h1>
      <p>AI-powered trading signal engine</p>

      {signals.map((s, i) => (
        <div key={i} style={{ margin: 20, padding: 20, border: "1px solid #ccc" }}>
          <h3>{s.symbol}</h3>
          <p>{s.signal}</p>
          <p>Volume Change: {s.volume_change}%</p>

          <button onClick={() => explainSignal(s)}>
            Explain Signal
          </button>
        </div>
      ))}

      {loading && <p>Thinking...</p>}
    </div>
  );
}