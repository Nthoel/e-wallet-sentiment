require("dotenv/config");
const { defineConfig, env } = require("prisma/config");

module.exports = defineConfig({
  schema: "schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "./migrations",
    seed: "node ./seeds/index.js",
  },
  views: {
    path: "/views",
  },
});
