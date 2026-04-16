import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResend = () => {
    setLoading(true);
    setMessage("");
    setError("");

    setTimeout(() => {
      if (email) {
        setMessage(`Verification email sent to ${email}`);
      } else {
        setError("Email address not found");
      }

      setLoading(false);

      setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
    }, 1000);
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        color: "black",
      }}
    >
      <h2>Verify Your Email</h2>

      {email ? (
        <>
          <p>We've sent a verification link to:</p>
          <p>
            <strong>{email}</strong>
          </p>
          <p>
            Please check your inbox and click the verification link to activate
            your account.
          </p>
        </>
      ) : (
        <p>Please register first before verifying your email.</p>
      )}

      {message && (
        <div
          style={{
            background: "#dfd",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          {message}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fee",
            padding: "10px",
            margin: "10px 0",
          }}
        >
          {error}
        </div>
      )}

      <Button
        onClick={() => navigate("/login")}
        style={{ marginBottom: "10px" }}
      >
        I've Verified My Email
      </Button>

      <Button onClick={handleResend} disabled={loading}>
        {loading ? "Sending..." : "Resend Verification Email"}
      </Button>

      <div style={{ marginTop: "20px" }}>
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
