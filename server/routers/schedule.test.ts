import { describe, expect, it } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@alvo-certo.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("schedule.create", () => {
  it("should create a schedule request with valid CAC", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const result = await caller.schedule.create({
      fullName: "João Silva",
      email: "joao@example.com",
      phone: "(11) 98765-4321",
      documentType: "CAC",
      documentNumber: "123456-AB",
      requestedDate: dateStr,
      requestedTime: "14:00",
      numberOfPeople: 2,
      experience: "intermediate",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("should reject invalid CAC format", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    try {
      await caller.schedule.create({
        fullName: "João Silva",
        email: "joao@example.com",
        phone: "(11) 98765-4321",
        documentType: "CAC",
        documentNumber: "invalid-cac",
        requestedDate: dateStr,
        requestedTime: "14:00",
        numberOfPeople: 1,
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("inválido");
    }
  });

  it("should reject past dates", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    try {
      await caller.schedule.create({
        fullName: "João Silva",
        email: "joao@example.com",
        phone: "(11) 98765-4321",
        documentType: "RG",
        documentNumber: "1234567",
        requestedDate: dateStr,
        requestedTime: "14:00",
        numberOfPeople: 1,
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("passado");
    }
  });
});

describe("schedule.list", () => {
  it("should require admin role", async () => {
    const user: AuthenticatedUser = {
      id: 2,
      openId: "regular-user",
      email: "user@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    const ctx: TrpcContext = {
      user,
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);

    try {
      await caller.schedule.list();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Acesso restrito");
    }
  });
});
