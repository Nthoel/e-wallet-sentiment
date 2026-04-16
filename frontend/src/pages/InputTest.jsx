// src/pages/InputTest.jsx
import { useState } from "react";
import Input from "../components/ui/Input";

const InputTest = () => {
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const validateEmail = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val && !/\S+@\S+\.\S+/.test(val)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Input Component Demo</h1>

      {/* Default Variant */}
      <div style={{ marginBottom: "32px" }}>
        <h3>Default Variant</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input variant="default" placeholder="Default input" fullWidth />
          <Input
            variant="default"
            placeholder="Default with label"
            label="Username"
            fullWidth
          />
        </div>
      </div>

      {/* Dengan Icon */}
      <div style={{ marginBottom: "32px" }}>
        <h3>With Icons</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input placeholder="Left icon" iconLeft="🔒" fullWidth />
          <Input placeholder="Right icon" iconRight="✓" fullWidth />
          <Input
            placeholder="Both icons"
            iconLeft="🔍"
            iconRight="⌘"
            fullWidth
          />
        </div>
      </div>

      {/* Error State */}
      <div style={{ marginBottom: "32px" }}>
        <h3>Error State</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input
            placeholder="Email"
            value={email}
            onChange={validateEmail}
            error={error}
            errorMessage={error ? "Please enter a valid email" : ""}
            helperText="Enter your email address"
            fullWidth
          />
          <Input
            placeholder="Required field"
            error
            label="Error"
            errorMessage="This field is required"
            fullWidth
          />
        </div>
      </div>

      {/* Disabled State */}
      <div style={{ marginBottom: "32px" }}>
        <h3>Disabled State</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Input placeholder="Disabled input" disabled fullWidth />
          <Input
            label="Disabled with label"
            placeholder="Can't edit"
            disabled
            fullWidth
          />
          <Input
            placeholder="Disabled with icon"
            iconLeft="🔒"
            disabled
            fullWidth
          />
        </div>
      </div>

      {/* Form Example */}
      <div style={{ marginBottom: "32px" }}>
        <h3>Form Example</h3>
        <div
          style={{
            border: "1px solid #e5e7eb",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <Input
              label="Full Name"
              placeholder="John Doe"
              iconLeft="👤"
              fullWidth
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              iconLeft="📧"
              required
              fullWidth
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              iconLeft="🔒"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputTest;
