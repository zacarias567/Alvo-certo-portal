import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ArrowLeft, Search, Calendar, User, Phone, FileText, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CompletedSchedules() {
  const { data: schedules, isLoading } = trpc.schedule.listCompleted.useQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  const completedSchedules = schedules?.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm) ||
      s.documentNumber.includes(searchTerm);

    const matchesStatus = filterStatus === "all" || s.status === filterStatus;

    return matchesSearch && matchesStatus;
  }) || [];

  const sortedSchedules = [...completedSchedules].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime();
    } else if (sortBy === "date-asc") {
      return new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime();
    } else if (sortBy === "name") {
      return a.fullName.localeCompare(b.fullName);
    }
    return 0;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      completed: { bg: "bg-blue-900", text: "text-blue-200", label: "Concluído" },
      approved: { bg: "bg-green-900", text: "text-green-200", label: "Aprovado" },
      pending: { bg: "bg-yellow-900", text: "text-yellow-200", label: "Pendente" },
      rejected: { bg: "bg-red-900", text: "text-red-200", label: "Rejeitado" }
    };
    const s = statusMap[status] || statusMap.pending;
    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${s.bg} ${s.text}`}>{s.label}</span>;
  };

  const getExperienceBadge = (experience: string | undefined | null) => {
    const expMap: Record<string, string> = {
      beginner: "Iniciante",
      intermediate: "Intermediário",
      advanced: "Avançado"
    };
    return expMap[experience || "beginner"] || "Não informado";
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
          <h1 className="text-4xl font-bold text-white mb-2">Agendamentos Realizados</h1>
          <p className="text-slate-300">Visualize todos os agendamentos já realizados no clube</p>
        </div>

        <Card className="bg-slate-700 border-slate-600 p-6 mb-6">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Buscar por nome, email, telefone ou documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white placeholder-slate-400 pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48 bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-600 border-slate-500">
                  <SelectItem value="all" className="text-white">Todos os Status</SelectItem>
                  <SelectItem value="completed" className="text-white">Concluído</SelectItem>
                  <SelectItem value="approved" className="text-white">Aprovado</SelectItem>
                  <SelectItem value="pending" className="text-white">Pendente</SelectItem>
                  <SelectItem value="rejected" className="text-white">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-slate-600 border-slate-500 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-600 border-slate-500">
                  <SelectItem value="date-desc" className="text-white">Mais Recentes</SelectItem>
                  <SelectItem value="date-asc" className="text-white">Mais Antigos</SelectItem>
                  <SelectItem value="name" className="text-white">Nome (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="bg-slate-700 border-slate-600 p-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
          ) : sortedSchedules.length > 0 ? (
            <div className="space-y-4">
              <div className="text-slate-300 text-sm mb-4">
                Mostrando {sortedSchedules.length} agendamento(s)
              </div>
              {sortedSchedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="bg-slate-600 border border-slate-500 rounded-lg p-5 hover:border-amber-600 transition hover:shadow-lg"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-5 h-5 text-amber-600" />
                        <h3 className="text-xl font-bold text-white">{schedule.fullName}</h3>
                      </div>
                      <div className="space-y-1 text-slate-300 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="text-slate-400">Email:</span>
                          <a href={`mailto:${schedule.email}`} className="text-amber-400 hover:underline">
                            {schedule.email}
                          </a>
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {schedule.phone}
                        </p>
                        <p>
                          <span className="text-slate-400">Documento:</span> {schedule.documentType} - {schedule.documentNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(schedule.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 pb-4 border-b border-slate-500">
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide">Data</p>
                      <p className="text-white font-semibold flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        {new Date(schedule.requestedDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide">Horário</p>
                      <p className="text-white font-semibold">{schedule.requestedTime}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide">Pessoas</p>
                      <p className="text-white font-semibold">{schedule.numberOfPeople}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide">Experiência</p>
                      <p className="text-white font-semibold">{getExperienceBadge(schedule.experience)}</p>
                    </div>
                  </div>

                  {schedule.observations && (
                    <div className="bg-slate-500 rounded p-3">
                      <p className="text-slate-300 text-sm flex items-start gap-2">
                        <FileText className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                        <span>
                          <span className="text-slate-400">Observações:</span> {schedule.observations}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-300 text-lg mb-4">Nenhum agendamento encontrado</p>
              <p className="text-slate-400">Tente ajustar seus filtros ou termos de busca</p>
            </div>
          )}
        </Card>

        <div className="mt-8 text-center">
          <Link href="/agendamento">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Fazer Novo Agendamento
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
