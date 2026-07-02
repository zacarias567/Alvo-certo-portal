import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: schedules, isLoading, refetch } = trpc.schedule.list.useQuery(undefined, {
    enabled: isAuthenticated && user?.role === "admin",
  });
  const updateStatus = trpc.schedule.updateStatus.useMutation();
  const [filter, setFilter] = useState<string>("all");

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="bg-slate-700 border-slate-600 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Acesso Negado</h2>
          <p className="text-slate-300 mb-6">Você não tem permissão para acessar esta página.</p>
          <Link href="/">
            <Button>Voltar à Página Inicial</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const filteredSchedules = schedules?.filter((s) => {
    if (filter === "all") return true;
    return s.status === filter;
  });

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        id,
        status: newStatus as "pending" | "approved" | "rejected" | "completed",
      });
      toast.success("Status atualizado com sucesso!");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "approved":
        return "Aprovado";
      case "rejected":
        return "Rejeitado";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/">
          <Button variant="ghost" className="mb-6 text-slate-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-slate-300">Gerencie as solicitações de agendamento do clube</p>
        </div>

        <Card className="bg-slate-700 border-slate-600 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-300 text-sm">Total de Solicitações</p>
              <p className="text-3xl font-bold text-white">{schedules?.length || 0}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-slate-300 text-sm">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {schedules?.filter((s) => s.status === "pending").length || 0}
                </p>
              </div>
              <div>
                <p className="text-slate-300 text-sm">Aprovados</p>
                <p className="text-2xl font-bold text-green-500">
                  {schedules?.filter((s) => s.status === "approved").length || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-700 border-slate-600 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Solicitações de Agendamento</h2>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48 bg-slate-600 border-slate-500 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-600 border-slate-500">
                <SelectItem value="all" className="text-white">Todas</SelectItem>
                <SelectItem value="pending" className="text-white">Pendentes</SelectItem>
                <SelectItem value="approved" className="text-white">Aprovadas</SelectItem>
                <SelectItem value="rejected" className="text-white">Rejeitadas</SelectItem>
                <SelectItem value="completed" className="text-white">Concluídas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
          ) : filteredSchedules && filteredSchedules.length > 0 ? (
            <div className="space-y-4">
              {filteredSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-slate-600 border border-slate-500 rounded-lg p-4 hover:border-amber-600 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-slate-400 text-sm">Nome</p>
                      <p className="text-white font-semibold">{schedule.fullName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Email</p>
                      <p className="text-white">{schedule.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Telefone</p>
                      <p className="text-white">{schedule.phone}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Documento</p>
                      <p className="text-white">
                        {schedule.documentType} - {schedule.documentNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Data e Hora</p>
                      <p className="text-white">
                        {new Date(schedule.requestedDate).toLocaleDateString("pt-BR")} às{" "}
                        {schedule.requestedTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Número de Pessoas</p>
                      <p className="text-white">{schedule.numberOfPeople}</p>
                    </div>
                  </div>

                  {schedule.observations && (
                    <div className="mb-4 p-3 bg-slate-500 rounded">
                      <p className="text-slate-400 text-sm">Observações</p>
                      <p className="text-white">{schedule.observations}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(schedule.status)}
                      <span className="text-white font-semibold">{getStatusLabel(schedule.status)}</span>
                    </div>
                    <Select
                      value={schedule.status}
                      onValueChange={(value) => handleStatusChange(schedule.id, value)}
                      disabled={updateStatus.isPending}
                    >
                      <SelectTrigger className="w-40 bg-slate-500 border-slate-400 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-600 border-slate-500">
                        <SelectItem value="pending" className="text-white">Pendente</SelectItem>
                        <SelectItem value="approved" className="text-white">Aprovar</SelectItem>
                        <SelectItem value="rejected" className="text-white">Rejeitar</SelectItem>
                        <SelectItem value="completed" className="text-white">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-300 text-lg">Nenhuma solicitação encontrada</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
