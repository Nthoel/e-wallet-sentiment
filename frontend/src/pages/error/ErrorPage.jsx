import { Link, useNavigate } from "react-router-dom";

const ErrorPage = ({
  code = "404",
  title = "Page Not Found",
  message = "Sorry, we couldn't find the page you're looking for.",
  icon = "🔍",
  actionText = "Go Home",
  actionLink = "/",
  secondaryAction = true,
  secondaryActionText = "Go Back",
  onSecondaryAction = null,
  showReload = false,
}) => {
  const navigate = useNavigate();

  const handleSecondaryAction = () => {
    if (onSecondaryAction) {
      onSecondaryAction();
    } else {
      navigate(-1);
    }
  };

  const getCodeColor = () => {
    switch (String(code)) {
      case "404":
        return "#374151";
      case "500":
        return "#dc2626";
      case "403":
        return "#f59e0b";
      case "401":
        return "#ef4444";
      case "503":
        return "#8b5cf6";
      default:
        return "#6b7280";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          maxWidth: "500px",
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: "80px", marginBottom: "1rem" }}>{icon}</div>

        {/* Status Code */}
        <h1
          style={{
            fontSize: "120px",
            margin: "0",
            color: getCodeColor(),
            fontWeight: "bold",
          }}
        >
          {code}
        </h1>

        {/* Title */}
        <h2
          style={{
            fontSize: "24px",
            margin: "1rem 0",
            color: "#111827",
          }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          style={{
            color: "#6b7280",
            marginBottom: "2rem",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          {showReload && (
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#374151",
              }}
            >
              Try Again
            </button>
          )}

          {secondaryAction && (
            <button
              onClick={handleSecondaryAction}
              style={{
                padding: "10px 20px",
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#374151",
              }}
            >
              {secondaryActionText}
            </button>
          )}

          <Link to={actionLink}>
            <button
              style={{
                padding: "10px 20px",
                background: "#3b82f6",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                color: "white",
              }}
            >
              {actionText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
