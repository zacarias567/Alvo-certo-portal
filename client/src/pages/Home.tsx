import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Target, BookOpen, Calendar, Shield, Phone, MapPin } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-950 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Target className="w-8 h-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-white">Alvo Certo</h1>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#servicos" className="text-slate-300 hover:text-white transition">
              Serviços
            </a>
            <a href="#catalogo" className="text-slate-300 hover:text-white transition">
              Catálogo
            </a>
            <a href="#agendamento" className="text-slate-300 hover:text-white transition">
              Agendamento
            </a>
            {isAuthenticated && user?.role === "admin" ? (
              <Link href="/admin">
                <Button variant="default">Painel Admin</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="outline">Entrar</Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Bem-vindo ao Clube de Tiro Alvo Certo</h2>
          <p className="text-xl text-slate-300 mb-8">
            Excelência em treinamento, segurança e precisão. Desde 1995, desenvolvemos atletas e profissionais.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#agendamento">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">Agendar Horário</Button>
            </a>
            <a href="#servicos">
              <Button size="lg" variant="outline">Conhecer Serviços</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-white mb-12 text-center">Nossos Serviços</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-700 border-slate-600 p-6 hover:border-amber-600 transition">
              <Target className="w-12 h-12 text-amber-600 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">Estande de Tiro</h4>
              <p className="text-slate-300">
                Instalações modernas com 10 posições de tiro, equipadas com os melhores padrões de segurança.
              </p>
            </Card>
            <Card className="bg-slate-700 border-slate-600 p-6 hover:border-amber-600 transition">
              <BookOpen className="w-12 h-12 text-amber-600 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">Cursos Especializados</h4>
              <p className="text-slate-300">
                Programas de treinamento desde iniciantes até profissionais, com instrutores certificados.
              </p>
            </Card>
            <Card className="bg-slate-700 border-slate-600 p-6 hover:border-amber-600 transition">
              <Shield className="w-12 h-12 text-amber-600 mb-4" />
              <h4 className="text-xl font-bold text-white mb-3">Segurança Garantida</h4>
              <p className="text-slate-300">
                Protocolos rigorosos de segurança, equipamentos de proteção e monitoramento contínuo.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Catalog Preview */}
      <section id="catalogo" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-white mb-12 text-center">Catálogos Disponíveis</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/catalogo/armamentos">
              <Card className="bg-slate-700 border-slate-600 p-8 hover:border-amber-600 transition cursor-pointer h-full">
                <Target className="w-16 h-16 text-amber-600 mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">Armamentos</h4>
                <p className="text-slate-300 mb-4">Conheça nossa seleção de armamentos de qualidade superior</p>
                <Button variant="outline" size="sm">Ver Catálogo</Button>
              </Card>
            </Link>
            <Link href="/catalogo/cursos">
              <Card className="bg-slate-700 border-slate-600 p-8 hover:border-amber-600 transition cursor-pointer h-full">
                <BookOpen className="w-16 h-16 text-amber-600 mb-4" />
                <h4 className="text-2xl font-bold text-white mb-2">Cursos</h4>
                <p className="text-slate-300 mb-4">Explore nossos programas de treinamento especializados</p>
                <Button variant="outline" size="sm">Ver Cursos</Button>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Scheduling Section */}
      <section id="agendamento" className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Agende seu Horário</h3>
          <p className="text-lg text-slate-300 mb-8">
            Reserve seu espaço no estande de tiro. Identificação qualificada obrigatória (CAC ou RG).
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/agendamento">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                <Calendar className="w-5 h-5 mr-2" />
                Fazer Agendamento
              </Button>
            </Link>
            <Link href="/agendamentos-realizados">
              <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white">
                <Calendar className="w-5 h-5 mr-2" />
                Ver Agendamentos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-white mb-12 text-center">Entre em Contato</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Phone className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Telefone</h4>
              <p className="text-slate-300">(11) 3456-7890</p>
            </div>
            <div className="text-center">
              <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Localização</h4>
              <p className="text-slate-300">Av. Principal, 1000 - São Paulo, SP</p>
            </div>
            <div className="text-center">
              <Calendar className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-white mb-2">Horário</h4>
              <p className="text-slate-300">Seg-Sex: 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-700 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>&copy; 2026 Clube de Tiro Alvo Certo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
