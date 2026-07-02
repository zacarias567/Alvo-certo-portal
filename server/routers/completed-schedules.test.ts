import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("schedule.listCompleted", () => {
  it("should return all schedules without authentication", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.schedule.listCompleted();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should include all schedule statuses including pending", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.schedule.listCompleted();

    const hasPending = result.some((s) => s.status === "pending");
    expect(hasPending).toBe(true);
  });

  it("should include schedule details", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.schedule.listCompleted();

    if (result.length > 0) {
      const schedule = result[0];
      expect(schedule).toHaveProperty("id");
      expect(schedule).toHaveProperty("fullName");
      expect(schedule).toHaveProperty("email");
      expect(schedule).toHaveProperty("phone");
      expect(schedule).toHaveProperty("documentType");
      expect(schedule).toHaveProperty("documentNumber");
      expect(schedule).toHaveProperty("requestedDate");
      expect(schedule).toHaveProperty("requestedTime");
      expect(schedule).toHaveProperty("numberOfPeople");
      expect(schedule).toHaveProperty("status");
    }
  });
});
