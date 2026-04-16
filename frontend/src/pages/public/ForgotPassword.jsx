import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // reset error
    setError("");

    // validasi email kosong
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    // simulasi API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  // Success State
  if (success) {
    return (
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>Check Your Email</h2>
        <p>We've sent password reset instructions to:</p>
        <p>
          <strong>{email}</strong>
        </p>

        <div
          style={{
            background: "#dfd",
            padding: "10px",
            margin: "15px 0",
          }}
        >
          Reset link sent successfully
        </div>

        <Link to="/login">Back to Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Forgot Password?</h2>
      <p>Enter your email to reset your password</p>

      {error && (
        <div
          style={{
            background: "#fee",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
