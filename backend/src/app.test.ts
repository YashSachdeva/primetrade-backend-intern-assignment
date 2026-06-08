import { describe, expect, it } from "vitest";
import request from "supertest";

describe("health endpoint", () => {
  it("returns service status", async () => {
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
    process.env.JWT_SECRET = "test-secret-that-is-long-enough";
    process.env.FRONTEND_ORIGIN = "http://localhost:5173";
    const { createApp } = await import("./app.js");

    const response = await request(createApp()).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
