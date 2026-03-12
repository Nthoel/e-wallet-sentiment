const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const app = express();
const PORT = process.env.DOCS_PORT || 3002;
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "E-Wallet Sentiment API",
      version: "0.1.0",
      description:
        "API dokumentasi untuk E-Wallet Sentiment Analysis Platform. " +
        "Platform ini menyediakan fitur analisis sentimen review e-wallet dari Google Play Store.",
    },
    servers: [
      {
        url: API_BASE_URL,
        description: "Backend Server",
      },
    ],
    tags: [
      { name: "Health", description: "Health check endpoint" },
      { name: "Auth", description: "Autentikasi dan manajemen user" },
      { name: "Reviews", description: "Manajemen review e-wallet" },
    ],
  },
  apis: [
    // Route files di backend dengan JSDoc annotations
    path.join(__dirname, "../backend/src/modules/**/*.routes.js"),
    path.join(__dirname, "../backend/src/modules/**/*.router.js"),
    path.join(__dirname, "../backend/src/app.js"),
    // Schema YAML files di folder docs
    path.join(__dirname, "./schemas/*.yaml"),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger UI
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JSON spec endpoint
app.get("/spec.json", (req, res) => {
  res.json(swaggerSpec);
});

app.listen(PORT, () => {
  console.log(`API Docs server running at http://localhost:${PORT}`);
  console.log(`JSON spec available at http://localhost:${PORT}/spec.json`);
  console.log(`Pointing to backend: ${API_BASE_URL}`);
});
