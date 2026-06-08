export const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "Primetrade Intern Assignment API",
    version: "1.0.0",
    description: "Versioned REST API with JWT authentication, RBAC, and product CRUD."
  },
  servers: [{ url: "http://localhost:4000/api/v1" }],
  tags: [
    { name: "Health" },
    { name: "Auth" },
    { name: "Products" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Yash Sharma" },
          email: { type: "string", example: "yash@example.com" },
          password: { type: "string", example: "StrongPass@123" }
        }
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "admin@primetrade.ai" },
          password: { type: "string", example: "Admin@12345" }
        }
      },
      ProductRequest: {
        type: "object",
        required: ["name", "description", "price", "stock"],
        properties: {
          name: { type: "string", example: "SOL Market Scanner" },
          description: { type: "string", example: "Signal product for Solana spot and derivatives markets." },
          price: { type: "number", example: 29.99 },
          stock: { type: "integer", example: 50 },
          isActive: { type: "boolean", example: true }
        }
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        responses: {
          "200": { description: "API is healthy" }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } }
        },
        responses: {
          "201": { description: "User registered" },
          "409": { description: "Email already exists" }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } }
        },
        responses: {
          "200": { description: "Authenticated successfully" },
          "401": { description: "Invalid credentials" }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user profile" },
          "401": { description: "Missing or invalid token" }
        }
      }
    },
    "/products": {
      get: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "List products" } }
      },
      post: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductRequest" } } }
        },
        responses: {
          "201": { description: "Product created" },
          "403": { description: "Admin role required" }
        }
      }
    },
    "/products/{id}": {
      get: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Product found" }, "404": { description: "Product not found" } }
      },
      patch: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductRequest" } } }
        },
        responses: { "200": { description: "Product updated" }, "403": { description: "Admin role required" } }
      },
      delete: {
        tags: ["Products"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "204": { description: "Product deleted" }, "403": { description: "Admin role required" } }
      }
    }
  }
};
