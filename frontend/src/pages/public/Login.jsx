import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email && password) {
        localStorage.setItem("token", "dummy-token");
        navigate("/dashboard");
      } else {
        setError("Email and password are required");
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h2>Login</h2>

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
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/forgot-password">Forgot Password?</Link>
        <br />
        <Link to="/register">Create Account</Link>
        <br />
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Login;
