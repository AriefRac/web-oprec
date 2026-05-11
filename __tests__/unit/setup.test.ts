import { describe, it, expect } from "vitest";

describe("Project Setup", () => {
  it("should have vitest configured correctly", () => {
    expect(true).toBe(true);
  });

  it("should resolve @ path alias", async () => {
    // Verify that the path alias works by importing package.json
    const pkg = await import("@/package.json");
    expect(pkg.name).toBe("web-oprec");
  });
});
