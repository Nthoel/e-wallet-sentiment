import Button from "../components/ui/Button";

const LoginButtons = () => {
  return (
    <div style={{ display: "flex", gap: "16px", flexDirection: "column", alignItems: "flex-start" }}>
      {/* Primary */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Button variant="primary" onClick={() => console.log("Test button primary")}>
          Text Only Button
        </Button>
        <Button variant="primary" onClick={() => console.log("Test button primary")} disabled>
          Text Only Button
        </Button>
      </div>

      {/* Transparent */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Button variant="transparent" onClick={() => console.log("Test button transparent")}>
          Text Only Button
        </Button>
        <Button variant="transparent" onClick={() => console.log("Test Test button transparent")} disabled>
          Text Only Button
        </Button>
      </div>

      {/* Outline */}
      <div style={{ display: "flex", gap: "16px" }}>
        <Button variant="outline" onClick={() => console.log("Test button transparent")}>
          Text Only Button
        </Button>
        <Button variant="outline" onClick={() => console.log("Test Test button transparent")} disabled>
          Text Only Button
        </Button>
      </div>

      {/* Icon kiri dan kanan */}
      <Button
        variant="primary"
        iconLeft="🔒"
        iconRight="🔒"
        onClick={() => console.log("Login")}
      >
        Submit
      </Button>
    </div>
  );
};

export default LoginButtons;
