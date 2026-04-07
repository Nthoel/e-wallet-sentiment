/**
 * Script untuk convert OpenAPI spec ke Markdown
 * Usage: node generate-docs.js
 * Output: DOCS.md
 */
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const fs = require("fs");

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
    servers: [{ url: API_BASE_URL, description: "Backend Server" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Health", description: "Health check endpoint" },
      { name: "Auth", description: "Autentikasi dan manajemen user" },
      { name: "Reviews", description: "Manajemen review e-wallet" },
      { name: "Profile", description: "Manajemen profil user" },
    ],
  },
  apis: [
    path.join(__dirname, "../backend/src/modules/**/*.routes.js"),
    path.join(__dirname, "../backend/src/modules/**/*.router.js"),
    path.join(__dirname, "../backend/src/app.js"),
    path.join(__dirname, "./schemas/*.yaml"),
  ],
};

const spec = swaggerJsdoc(options);

// --- Helpers ---

function toAnchor(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function refLink(name) {
  return `[${name}](#${name})`;
}

function resolveRef(ref, root) {
  const parts = ref.replace(/^#\//, "").split("/");
  let current = root;
  for (const part of parts) {
    current = current?.[part];
  }
  return current;
}

function schemaToTable(schema, root, indent = 0) {
  if (!schema) return "";
  if (schema.$ref) {
    schema = resolveRef(schema.$ref, root);
    if (!schema) return "*Ref not found*";
  }

  if (schema.type === "object" || schema.properties) {
    const rows = [];
    const props = schema.properties || {};
    const required = schema.required || [];
    for (const [name, prop] of Object.entries(props)) {
      const resolved = prop.$ref ? resolveRef(prop.$ref, root) || prop : prop;
      const type = formatType(resolved, root, true);
      const req = required.includes(name) ? "Ya" : "Tidak";
      const desc = resolved.description || "";
      const example =
        resolved.example !== undefined ? `\`${resolved.example}\`` : "";
      const prefix = indent > 0 ? "&nbsp;".repeat(indent * 2) + "↳ " : "";
      rows.push(
        `| ${prefix}${name} | ${type} | ${req} | ${desc} | ${example} |`,
      );
      // Nested object
      if (resolved.type === "object" && resolved.properties) {
        rows.push(schemaToTable(resolved, root, indent + 1));
      }
      // Array of objects
      if (resolved.type === "array" && resolved.items) {
        const items = resolved.items.$ref
          ? resolveRef(resolved.items.$ref, root)
          : resolved.items;
        if (items?.type === "object" && items.properties) {
          rows.push(schemaToTable(items, root, indent + 1));
        }
      }
    }
    return rows.join("\n");
  }

  return "";
}

function formatType(schema, root, linked = false) {
  if (!schema) return "any";
  if (schema.$ref) {
    const name = schema.$ref.split("/").pop();
    return linked ? refLink(name) : name;
  }
  if (schema.type === "array") {
    if (schema.items?.$ref) {
      const name = schema.items.$ref.split("/").pop();
      return linked ? `${refLink(name)}[]` : `${name}[]`;
    }
    return `${schema.items?.type || "any"}[]`;
  }
  let t = schema.type || "any";
  if (schema.format) t += ` (${schema.format})`;
  if (schema.nullable) t += ", nullable";
  if (schema.enum) t += ` enum: [${schema.enum.join(", ")}]`;
  return t;
}

function renderSchema(name, schema, root) {
  const lines = [];
  lines.push(`#### ${name}\n`);
  if (schema.description) lines.push(`${schema.description}\n`);
  if (schema.properties) {
    lines.push(
      "| Field | Type | Required | Description | Example |",
      "|-------|------|----------|-------------|---------|",
      schemaToTable(schema, root),
    );
  }
  lines.push("");
  return lines.join("\n");
}

function renderRequestBody(body, root) {
  if (!body) return "";

  // Handle $ref on requestBody itself
  if (body.$ref) {
    body = resolveRef(body.$ref, root) || body;
  }

  const content = body.content?.["application/json"];
  if (!content?.schema) return "";

  let schema = content.schema;
  let refName = "";
  if (schema.$ref) {
    refName = schema.$ref.split("/").pop();
    schema = resolveRef(schema.$ref, root) || schema;
  }

  const lines = [];
  lines.push(
    "**Request Body**" + (body.required ? " *(required)*" : "") + "\n",
  );
  if (refName) lines.push(`Schema: ${refLink(refName)}\n`);
  if (schema.properties) {
    lines.push(
      "| Field | Type | Required | Description | Example |",
      "|-------|------|----------|-------------|---------|",
      schemaToTable(schema, root),
    );
  }
  lines.push("");
  return lines.join("\n");
}

function renderResponse(code, resp, root) {
  // Handle $ref on response itself (components/responses/*)
  if (resp.$ref) {
    const refName = resp.$ref.split("/").pop();
    resp = resolveRef(resp.$ref, root) || resp;
    if (!resp) {
      return `- **${code}**: *(ref: ${refName})*`;
    }
  }

  const lines = [];
  lines.push(`- **${code}**: ${resp.description || ""}`);

  const content = resp.content?.["application/json"];
  if (content?.schema) {
    let schema = content.schema;
    let refName = "";
    if (schema.$ref) {
      refName = schema.$ref.split("/").pop();
      schema = resolveRef(schema.$ref, root) || schema;
    }
    if (refName) {
      lines.push(`  - Schema: ${refLink(refName)}`);
    }
  }

  // Handle headers in response
  if (resp.headers) {
    for (const [headerName, headerDef] of Object.entries(resp.headers)) {
      const resolved = headerDef.$ref
        ? resolveRef(headerDef.$ref, root) || headerDef
        : headerDef;
      lines.push(
        `  - Header \`${headerName}\`: ${resolved.description || ""} (${resolved.schema?.type || "string"})`,
      );
    }
  }

  return lines.join("\n");
}

function resolveParameter(param, root) {
  // Handle $ref on parameter itself (components/parameters/*)
  if (param.$ref) {
    return resolveRef(param.$ref, root) || param;
  }
  return param;
}

function renderParameters(params, root) {
  if (!params || params.length === 0) return "";

  // Resolve all $ref parameters first
  const resolved = params.map((p) => resolveParameter(p, root));

  const lines = [];
  lines.push("**Parameters**\n");
  lines.push(
    "| Name | In | Type | Required | Description |",
    "|------|----|------|----------|-------------|",
  );
  for (const param of resolved) {
    const schema = param.schema || {};
    let type = schema.type || "string";
    if (schema.format) type += ` (${schema.format})`;
    if (schema.enum) type += ` enum: [${schema.enum.join(", ")}]`;
    if (schema.default !== undefined) type += ` (default: ${schema.default})`;
    if (schema.minimum !== undefined) type += ` min: ${schema.minimum}`;
    if (schema.maximum !== undefined) type += ` max: ${schema.maximum}`;
    const req = param.required ? "Ya" : "Tidak";
    lines.push(
      `| ${param.name} | ${param.in} | \`${type}\` | ${req} | ${param.description || ""} |`,
    );
  }
  lines.push("");
  return lines.join("\n");
}

// --- Main Generation ---

function generate(spec) {
  const lines = [];

  // Header
  lines.push(`# ${spec.info.title}\n`);
  lines.push(`> Version: ${spec.info.version}\n`);
  if (spec.info.description) lines.push(`${spec.info.description}\n`);

  // Servers
  if (spec.servers?.length) {
    lines.push("## Base URL\n");
    for (const server of spec.servers) {
      lines.push(`- \`${server.url}\` — ${server.description || ""}`);
    }
    lines.push("");
  }

  // Table of Contents
  lines.push("## Table of Contents\n");
  if (spec.tags?.length) {
    for (const tag of spec.tags) {
      const anchor = tag.name.toLowerCase().replace(/\s+/g, "-");
      lines.push(`- [${tag.name}](#${anchor}) — ${tag.description || ""}`);
    }
  }
  lines.push("- [Schemas](#schemas)");
  if (
    spec.components?.responses &&
    Object.keys(spec.components.responses).length > 0
  ) {
    lines.push("- [Reusable Responses](#reusable-responses)");
  }
  if (
    spec.components?.parameters &&
    Object.keys(spec.components.parameters).length > 0
  ) {
    lines.push("- [Reusable Parameters](#reusable-parameters)");
  }
  lines.push("");

  // Group endpoints by tag
  const tagMap = {};
  for (const tag of spec.tags || []) {
    tagMap[tag.name] = { description: tag.description, endpoints: [] };
  }
  tagMap["Other"] = { description: "Ungrouped endpoints", endpoints: [] };

  for (const [pathStr, methods] of Object.entries(spec.paths || {})) {
    for (const [method, op] of Object.entries(methods)) {
      const tags = op.tags?.length ? op.tags : ["Other"];
      for (const tag of tags) {
        if (!tagMap[tag]) tagMap[tag] = { description: "", endpoints: [] };
        tagMap[tag].endpoints.push({ path: pathStr, method, op });
      }
    }
  }

  // Render endpoints per tag
  lines.push("---\n");
  lines.push("## Endpoints\n");

  for (const [tagName, tagData] of Object.entries(tagMap)) {
    if (tagData.endpoints.length === 0) continue;
    const anchor = tagName.toLowerCase().replace(/\s+/g, "-");
    lines.push(`### ${tagName}\n`);
    if (tagData.description) lines.push(`${tagData.description}\n`);

    for (const { path: p, method, op } of tagData.endpoints) {
      const methodUpper = method.toUpperCase();
      lines.push(`#### \`${methodUpper} ${p}\`\n`);
      if (op.summary) lines.push(`**${op.summary}**\n`);
      if (op.description) lines.push(`${op.description}\n`);

      // Parameters
      lines.push(renderParameters(op.parameters, spec));

      // Request body
      lines.push(renderRequestBody(op.requestBody, spec));

      // Responses
      if (op.responses) {
        lines.push("**Responses**\n");
        for (const [code, resp] of Object.entries(op.responses)) {
          lines.push(renderResponse(code, resp, spec));
        }
        lines.push("");
      }
      lines.push("---\n");
    }
  }

  // Schemas
  const schemas = spec.components?.schemas;
  if (schemas) {
    lines.push("## Schemas\n");
    for (const [name, schema] of Object.entries(schemas)) {
      lines.push(renderSchema(name, schema, spec));
    }
  }

  // Reusable Responses
  const responses = spec.components?.responses;
  if (responses && Object.keys(responses).length > 0) {
    lines.push("## Reusable Responses\n");
    for (const [name, resp] of Object.entries(responses)) {
      lines.push(`#### ${name}\n`);
      if (resp.description) lines.push(`${resp.description}\n`);
      const content = resp.content?.["application/json"];
      if (content?.schema) {
        let schema = content.schema;
        let refName = "";
        if (schema.$ref) {
          refName = schema.$ref.split("/").pop();
          schema = resolveRef(schema.$ref, spec) || schema;
        }
        if (refName) lines.push(`Schema: ${refLink(refName)}\n`);
        if (schema?.properties) {
          lines.push(
            "| Field | Type | Required | Description | Example |",
            "|-------|------|----------|-------------|---------|",
            schemaToTable(schema, spec),
          );
        }
      }
      if (resp.headers) {
        lines.push("\n**Headers**\n");
        lines.push(
          "| Header | Type | Description |",
          "|--------|------|-------------|",
        );
        for (const [hName, hDef] of Object.entries(resp.headers)) {
          const resolved = hDef.$ref
            ? resolveRef(hDef.$ref, spec) || hDef
            : hDef;
          lines.push(
            `| ${hName} | \`${resolved.schema?.type || "string"}\` | ${resolved.description || ""} |`,
          );
        }
      }
      lines.push("");
    }
  }

  // Reusable Parameters
  const parameters = spec.components?.parameters;
  if (parameters && Object.keys(parameters).length > 0) {
    lines.push("## Reusable Parameters\n");
    lines.push(
      "| Name | In | Type | Required | Description |",
      "|------|----|------|----------|-------------|",
    );
    for (const [name, param] of Object.entries(parameters)) {
      const schema = param.schema || {};
      let type = schema.type || "string";
      if (schema.format) type += ` (${schema.format})`;
      if (schema.enum) type += ` enum: [${schema.enum.join(", ")}]`;
      if (schema.default !== undefined) type += ` (default: ${schema.default})`;
      const req = param.required ? "Ya" : "Tidak";
      lines.push(
        `| ${param.name || name} | ${param.in || "-"} | \`${type}\` | ${req} | ${param.description || ""} |`,
      );
    }
    lines.push("");
  }

  // Footer
  lines.push("---\n");
  lines.push(
    `*Generated automatically from OpenAPI spec on ${new Date().toISOString().split("T")[0]}*`,
  );

  return lines.join("\n");
}

const markdown = generate(spec);
const outputPath = path.join(__dirname, "DOCS.md");
fs.writeFileSync(outputPath, markdown, "utf-8");
console.log(`Docs generated: ${outputPath}`);
