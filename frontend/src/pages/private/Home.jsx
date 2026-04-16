import { useState, useEffect } from "react";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setTimeout(() => {
      try {
        setUserName("Rifki");
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    }, 1500);
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Home Page</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Home Page</h1>
        <p>Terjadi kesalahan saat memuat data.</p>
      </div>
    );
  }

  if (!userName) {
    return (
      <div>
        <h1>Home Page</h1>
        <p>Data pengguna belum tersedia.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Home Page</h1>
      <p>Selamat datang di dashboard, {userName} 👋</p>
    </div>
  );
};

export default Home;
