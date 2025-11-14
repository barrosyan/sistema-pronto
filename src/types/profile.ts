// Tipos para representar dados de perfil e campanhas

export interface ProfileInfo {
  empresa: string;
  perfil: string;
  campanha: string;
  objetivoDaCampanha: string;
  cadencia: string;
  cargosNaPesquisa: string;
}

export interface ConsolidatedMetrics {
  inicioDoPeriodo: string;
  fimDoPeriodo: string;
  campanhasAtivas: number;
  diasAtivos: number;
  convitesEnviados: number;
  conexoesRealizadas: number;
  taxaDeAceiteDeConexao: number;
  mensagensEnviadas: number;
  visitas: number;
  likes: number;
  comentarios: number;
  totalDeAtividades: number;
  respostasPositivas: number;
  leadsProcessados: number;
  reunioes: number;
  propostas: number;
  vendas: number;
}

export interface ConversionRates {
  respostasPositivasConvitesEnviados: number;
  respostasPositivasConexoesRealizadas: number;
  respostasPositivasMensagensEnviadas: number;
  numeroDeReunioesRespostasPositivas: number;
  numeroDeReunioesConvitesEnviados: number;
}

export interface ProfileObservations {
  observacoes: string;
  problemasTecnicos: string;
  ajustesNaPesquisa: string;
  analiseComparativa: string;
}

export interface WeeklyActivityCalendar {
  semana: string; // Data de início da semana
  segundaFeira: 'Ativo' | 'Inativo';
  tercaFeira: 'Ativo' | 'Inativo';
  quartaFeira: 'Ativo' | 'Inativo';
  quintaFeira: 'Ativo' | 'Inativo';
  sextaFeira: 'Ativo' | 'Inativo';
  sabado: 'Ativo' | 'Inativo';
  domingo: 'Ativo' | 'Inativo';
  diasAtivos: number;
}

export interface CampaignComparison {
  campaignName: string;
  inicioDoPeriodo: string;
  fimDoPeriodo: string;
  diasAtivos: number;
  convitesEnviados: number;
  conexoesRealizadas: number;
  taxaDeAceiteDeConexao: number;
  mensagensEnviadas: number;
  visitas: number;
  likes: number;
  comentarios: number;
  totalDeAtividades: number;
  respostasPositivas: number;
  leadsProcessados: number;
  reunioes: number;
  propostas: number;
  vendas: number;
  // Taxas de conversão
  respostasPositivasConvitesEnviados: number;
  respostasPositivasConexoesRealizadas: number;
  respostasPositivasMensagensEnviadas: number;
  numeroDeReunioesRespostasPositivas: number;
  numeroDeReunioesConvitesEnviados: number;
  // Observações
  observacoes: string;
  problemasTecnicos: string;
  ajustesNaPesquisa: string;
  analiseComparativa: string;
}

export interface ProfileData {
  profileInfo: ProfileInfo;
  consolidatedMetrics: ConsolidatedMetrics;
  conversionRates: ConversionRates;
  observations: ProfileObservations;
  weeklyActivityCalendar: WeeklyActivityCalendar[];
  campaignComparisons: CampaignComparison[];
}
