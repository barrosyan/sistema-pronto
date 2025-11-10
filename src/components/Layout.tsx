import { ReactNode } from 'react';
import { NavLink } from './NavLink';
import { Merge, BarChart3, Users, TrendingUp, Calendar, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-foreground">Sistema Pronto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão Inteligente de Campanhas e Leads
          </p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <NavLink to="/" icon={<TrendingUp className="h-4 w-4" />}>
              Campanhas
            </NavLink>
            <NavLink to="/events" icon={<Calendar className="h-4 w-4" />}>
              Eventos
            </NavLink>
            <NavLink to="/leads" icon={<Users className="h-4 w-4" />}>
              Leads
            </NavLink>
            <NavLink to="/analytics" icon={<BarChart3 className="h-4 w-4" />}>
              Analytics
            </NavLink>
            <NavLink to="/content-generation" icon={<Sparkles className="h-4 w-4" />}>
              Geração de Conteúdo
            </NavLink>
            <NavLink to="/merge" icon={<Merge className="h-4 w-4" />}>
              Merge de Dados
            </NavLink>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
