import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle } from "lucide-react";

const scheduleSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  documentType: z.enum(["CAC", "RG"]),
  documentNumber: z.string().min(5, "Documento inválido"),
  requestedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  requestedTime: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  numberOfPeople: z.number().int().min(1).max(10).optional().default(1),
  experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  observations: z.string().optional(),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

export default function Schedule() {
  const [submitted, setSubmitted] = useState(false);
  const createSchedule = trpc.schedule.create.useMutation();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<any>({
    defaultValues: {
      numberOfPeople: 1,
      experience: "beginner",
    },
  });

  const documentType = watch("documentType");

  const onSubmit = async (data: any) => {
    try {
      await createSchedule.mutateAsync(data);
      setSubmitted(true);
      toast.success("Agendamento solicitado com sucesso!");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Erro ao agendar");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <Card className="bg-slate-700 border-slate-600 p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Agendamento Confirmado!</h2>
          <p className="text-slate-300 mb-6">
            Sua solicitação foi registrada com sucesso. Nossa equipe entrará em contato em breve para confirmar.
          </p>
          <Link href="/">
            <Button className="w-full">Voltar à Página Inicial</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <Card className="bg-slate-700 border-slate-600 p-8">
          <h1 className="text-3xl font-bold text-white mb-2">Agendar Horário no Estande</h1>
          <p className="text-slate-300 mb-8">
            Preencha o formulário abaixo para solicitar seu agendamento. Identificação qualificada obrigatória.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Informações Pessoais</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName" className="text-slate-300">Nome Completo *</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    placeholder="João Silva"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{String(errors.fullName?.message)}</p>}
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-300">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    placeholder="joao@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{String(errors.email?.message)}</p>}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-slate-300">Telefone *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    placeholder="(11) 98765-4321"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{String(errors.phone?.message)}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Identificação Qualificada *</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documentType" className="text-slate-300">Tipo de Documento *</Label>
                  <Select onValueChange={(value) => setValue("documentType", value as "CAC" | "RG")}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-600 border-slate-500">
                      <SelectItem value="CAC" className="text-white">CAC (Colecionador, Atirador e Caçador)</SelectItem>
                      <SelectItem value="RG" className="text-white">RG (Registro Geral)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.documentType && <p className="text-red-400 text-sm mt-1">{String(errors.documentType?.message)}</p>}
                </div>

                <div>
                  <Label htmlFor="documentNumber" className="text-slate-300">
                    Número do {documentType || "Documento"} *
                  </Label>
                  <Input
                    id="documentNumber"
                    {...register("documentNumber")}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    placeholder={documentType === "CAC" ? "123456-AB" : "1234567"}
                  />
                  {documentType === "CAC" && <p className="text-slate-400 text-xs mt-1">Formato: 123456-XX</p>}
                  {documentType === "RG" && <p className="text-slate-400 text-xs mt-1">Apenas números</p>}
                  {errors.documentNumber && <p className="text-red-400 text-sm mt-1">{String(errors.documentNumber?.message)}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Agendamento</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requestedDate" className="text-slate-300">Data *</Label>
                    <Input
                      id="requestedDate"
                      type="date"
                      {...register("requestedDate")}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                    {errors.requestedDate && <p className="text-red-400 text-sm mt-1">{String(errors.requestedDate?.message)}</p>}
                  </div>

                  <div>
                    <Label htmlFor="requestedTime" className="text-slate-300">Horário *</Label>
                    <Input
                      id="requestedTime"
                      type="time"
                      {...register("requestedTime")}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                    {errors.requestedTime && <p className="text-red-400 text-sm mt-1">{String(errors.requestedTime?.message)}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="numberOfPeople" className="text-slate-300">Número de Pessoas *</Label>
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min="1"
                    max="10"
                    {...register("numberOfPeople", { valueAsNumber: true })}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                  {errors.numberOfPeople && <p className="text-red-400 text-sm mt-1">{String(errors.numberOfPeople?.message)}</p>}
                </div>

                <div>
                  <Label htmlFor="experience" className="text-slate-300">Nível de Experiência</Label>
                  <Select onValueChange={(value) => setValue("experience", value as any)}>
                    <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-600 border-slate-500">
                      <SelectItem value="beginner" className="text-white">Iniciante</SelectItem>
                      <SelectItem value="intermediate" className="text-white">Intermediário</SelectItem>
                      <SelectItem value="advanced" className="text-white">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="observations" className="text-slate-300">Observações</Label>
                  <Textarea
                    id="observations"
                    {...register("observations")}
                    className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
                    placeholder="Informações adicionais..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createSchedule.isPending}
                className="flex-1 bg-amber-600 hover:bg-amber-700"
              >
                {createSchedule.isPending ? "Enviando..." : "Solicitar Agendamento"}
              </Button>
              <Link href="/" className="flex-1">
                <Button type="button" variant="outline" className="w-full">Cancelar</Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
