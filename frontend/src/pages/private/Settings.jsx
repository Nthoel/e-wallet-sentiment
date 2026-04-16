import { useState, useEffect } from "react";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [settingsData, setSettingsData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        setSettingsData({
          username: "Rifki",
          email: "rifki@example.com",
          theme: "Light Mode",
        });
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
        <h1>Settings Page</h1>
        <p>Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Settings Page</h1>
        <p>Gagal memuat pengaturan.</p>
      </div>
    );
  }

  if (!settingsData) {
    return (
      <div>
        <h1>Settings Page</h1>
        <p>Data pengaturan belum tersedia.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Settings Page</h1>
      <p>Pengaturan akun dan sistem</p>

      <p>
        <strong>Username:</strong> {settingsData.username}
      </p>
      <p>
        <strong>Email:</strong> {settingsData.email}
      </p>
      <p>
        <strong>Theme:</strong> {settingsData.theme}
      </p>
    </div>
  );
};

export default Settings;
