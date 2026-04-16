import { useState, useEffect } from "react";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        setData({
          totalReviews: 120,
          positiveSentiment: 85,
        });
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }, 1500);
  }, []);

  if (loading) return <p style={{ color: "black" }}>Loading analytics...</p>;
  if (error) return <p style={{ color: "black" }}>Gagal memuat analytics</p>;

  return (
    <div style={{ color: "black" }}>
      <h1>Analytics Page</h1>
      <p>Total Review: {data.totalReviews}</p>
      <p>Sentimen Positif: {data.positiveSentiment}%</p>
    </div>
  );
};

export default Analytics;
