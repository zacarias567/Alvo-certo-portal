import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { createScheduleRequest, getScheduleRequests, getScheduleRequestById, updateScheduleRequest } from "../db";
import { notifyOwner } from "../_core/notification";
import { TRPCError } from "@trpc/server";

// Validação de CAC/RG
const validateDocument = (type: string, number: string): boolean => {
  if (type === "CAC") {
    // CAC tem formato: 123456-XX (6 dígitos, hífen, 2 letras)
    return /^\d{6}-[A-Z]{2}$/.test(number);
  } else if (type === "RG") {
    // RG simplificado: aceita números com até 12 dígitos
    return /^\d{5,12}$/.test(number);
  }
  return false;
};

export const scheduleRouter = router({
  create: publicProcedure
    .input(
      z.object({
        fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
        email: z.string().email("Email inválido"),
        phone: z.string().min(10, "Telefone inválido"),
        documentType: z.enum(["CAC", "RG"]),
        documentNumber: z.string().min(5, "Documento inválido"),
        requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (YYYY-MM-DD)"),
        requestedTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida (HH:MM)"),
        numberOfPeople: z.number().int().min(1).max(10).default(1),
        experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        observations: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Validar documento
      if (!validateDocument(input.documentType, input.documentNumber)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${input.documentType} inválido. ${input.documentType === "CAC" ? "Formato esperado: 123456-XX" : "Apenas números"}`,
        });
      }

      // Validar data (não pode ser no passado)
      const requestedDate = new Date(input.requestedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (requestedDate < today) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A data solicitada não pode ser no passado",
        });
      }

      // Criar solicitação
      const result = await createScheduleRequest({
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        documentType: input.documentType,
        documentNumber: input.documentNumber,
        requestedDate: new Date(input.requestedDate),
        requestedTime: input.requestedTime,
        numberOfPeople: input.numberOfPeople,
        experience: input.experience,
        observations: input.observations,
        status: "pending",
      });

      // Notificar administrador
      try {
        await notifyOwner({
          title: "Nova Solicitação de Agendamento",
          content: `${input.fullName} solicitou agendamento para ${input.requestedDate} às ${input.requestedTime}. Documento: ${input.documentType} ${input.documentNumber}`,
        });
      } catch (error) {
        console.error("Erro ao notificar administrador:", error);
      }

      return {
        success: true,
        message: "Solicitação de agendamento registrada com sucesso",
      };
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Acesso restrito a administradores",
      });
    }
    return getScheduleRequests();
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso restrito a administradores",
        });
      }
      return getScheduleRequestById(input.id);
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "rejected", "completed"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Acesso restrito a administradores",
        });
      }
      await updateScheduleRequest(input.id, { status: input.status });
      return { success: true };
    }),

  listCompleted: publicProcedure.query(async () => {
    const allSchedules = await getScheduleRequests();
    return allSchedules;
  }),
});
