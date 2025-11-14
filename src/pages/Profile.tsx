import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import type { ProfileInfo, ConsolidatedMetrics, ConversionRates, ProfileObservations, WeeklyActivityCalendar, CampaignComparison } from '@/types/profile';

export default function Profile() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    empresa: 'Presto',
    perfil: 'Ursula Aleixo',
    campanha: 'Ursula Sebrae 100 Startups',
    objetivoDaCampanha: 'Conectar com as startups classificadas para o Prêmio Sebrae do Startp Summit 2025',
    cadencia: 'https://docs.google.com/document/d/...',
    cargosNaPesquisa: 'Founder, CEO, CTO'
  });

  const [metrics] = useState<ConsolidatedMetrics>({
    inicioDoPeriodo: '21/07/2025',
    fimDoPeriodo: '24/08/2025',
    campanhasAtivas: 1,
    diasAtivos: 14,
    convitesEnviados: 74,
    conexoesRealizadas: 43,
    taxaDeAceiteDeConexao: 58,
    mensagensEnviadas: 42,
    visitas: 80,
    likes: 39,
    comentarios: 0,
    totalDeAtividades: 235,
    respostasPositivas: 5,
    leadsProcessados: 0,
    reunioes: 0,
    propostas: 0,
    vendas: 0
  });

  const [conversionRates] = useState<ConversionRates>({
    respostasPositivasConvitesEnviados: 6.8,
    respostasPositivasConexoesRealizadas: 11.6,
    respostasPositivasMensagensEnviadas: 11.9,
    numeroDeReunioesRespostasPositivas: 0,
    numeroDeReunioesConvitesEnviados: 0
  });

  const [observations] = useState<ProfileObservations>({
    observacoes: '',
    problemasTecnicos: '',
    ajustesNaPesquisa: '',
    analiseComparativa: ''
  });

  const [weeklyCalendar] = useState<WeeklyActivityCalendar[]>([
    { semana: '21/07/2025', segundaFeira: 'Inativo', tercaFeira: 'Inativo', quartaFeira: 'Inativo', quintaFeira: 'Inativo', sextaFeira: 'Ativo', sabado: 'Ativo', domingo: 'Inativo', diasAtivos: 2 },
    { semana: '28/07/2025', segundaFeira: 'Ativo', tercaFeira: 'Ativo', quartaFeira: 'Ativo', quintaFeira: 'Ativo', sextaFeira: 'Ativo', sabado: 'Inativo', domingo: 'Ativo', diasAtivos: 6 },
    { semana: '04/08/2025', segundaFeira: 'Ativo', tercaFeira: 'Inativo', quartaFeira: 'Ativo', quintaFeira: 'Ativo', sextaFeira: 'Inativo', sabado: 'Inativo', domingo: 'Inativo', diasAtivos: 3 },
    { semana: '11/08/2025', segundaFeira: 'Inativo', tercaFeira: 'Inativo', quartaFeira: 'Inativo', quintaFeira: 'Ativo', sextaFeira: 'Inativo', sabado: 'Inativo', domingo: 'Ativo', diasAtivos: 2 },
    { semana: '18/08/2025', segundaFeira: 'Inativo', tercaFeira: 'Inativo', quartaFeira: 'Inativo', quintaFeira: 'Ativo', sextaFeira: 'Inativo', sabado: 'Inativo', domingo: 'Inativo', diasAtivos: 1 }
  ]);

  const [campaignComparisons] = useState<CampaignComparison[]>([
    {
      campaignName: 'Ursula Sebrae 100 Startups',
      inicioDoPeriodo: '21/07/2025',
      fimDoPeriodo: '24/08/2025',
      diasAtivos: 14,
      convitesEnviados: 74,
      conexoesRealizadas: 43,
      taxaDeAceiteDeConexao: 58,
      mensagensEnviadas: 42,
      visitas: 80,
      likes: 39,
      comentarios: 0,
      totalDeAtividades: 235,
      respostasPositivas: 5,
      leadsProcessados: 0,
      reunioes: 0,
      propostas: 0,
      vendas: 0,
      respostasPositivasConvitesEnviados: 6.8,
      respostasPositivasConexoesRealizadas: 11.6,
      respostasPositivasMensagensEnviadas: 11.9,
      numeroDeReunioesRespostasPositivas: 0,
      numeroDeReunioesConvitesEnviados: 0,
      observacoes: '',
      problemasTecnicos: '',
      ajustesNaPesquisa: '',
      analiseComparativa: ''
    }
  ]);

  const handleSaveProfileInfo = () => {
    setIsEditingInfo(false);
    toast.success('Informações do perfil atualizadas com sucesso!');
  };

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Perfil: {profileInfo.perfil}</h1>
            <p className="text-muted-foreground">{profileInfo.empresa}</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="calendar">Calendário de Atividades</TabsTrigger>
            <TabsTrigger value="comparison">Comparação de Campanhas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Informações do Perfil - Editável */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Informações do Perfil</CardTitle>
                    <CardDescription>Dados principais da campanha</CardDescription>
                  </div>
                  {!isEditingInfo ? (
                    <Button onClick={() => setIsEditingInfo(true)} variant="outline" size="sm">
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfileInfo} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input
                    id="empresa"
                    value={profileInfo.empresa}
                    onChange={(e) => setProfileInfo({ ...profileInfo, empresa: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil</Label>
                  <Input
                    id="perfil"
                    value={profileInfo.perfil}
                    onChange={(e) => setProfileInfo({ ...profileInfo, perfil: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="campanha">Campanha</Label>
                  <Input
                    id="campanha"
                    value={profileInfo.campanha}
                    onChange={(e) => setProfileInfo({ ...profileInfo, campanha: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="objetivo">Objetivo da Campanha</Label>
                  <Textarea
                    id="objetivo"
                    value={profileInfo.objetivoDaCampanha}
                    onChange={(e) => setProfileInfo({ ...profileInfo, objetivoDaCampanha: e.target.value })}
                    disabled={!isEditingInfo}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cadencia">Cadência</Label>
                  <Input
                    id="cadencia"
                    value={profileInfo.cadencia}
                    onChange={(e) => setProfileInfo({ ...profileInfo, cadencia: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargos">Cargos de Pesquisa</Label>
                  <Input
                    id="cargos"
                    value={profileInfo.cargosNaPesquisa}
                    onChange={(e) => setProfileInfo({ ...profileInfo, cargosNaPesquisa: e.target.value })}
                    disabled={!isEditingInfo}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Métricas Consolidadas */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Consolidadas</CardTitle>
                <CardDescription>Período: {metrics.inicioDoPeriodo} - {metrics.fimDoPeriodo}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Dias Ativos</p>
                    <p className="text-2xl font-bold">{metrics.diasAtivos}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Convites Enviados</p>
                    <p className="text-2xl font-bold">{metrics.convitesEnviados}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Conexões Realizadas</p>
                    <p className="text-2xl font-bold">{metrics.conexoesRealizadas}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Taxa de Aceite</p>
                    <p className="text-2xl font-bold">{metrics.taxaDeAceiteDeConexao}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                    <p className="text-2xl font-bold">{metrics.mensagensEnviadas}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Visitas</p>
                    <p className="text-2xl font-bold">{metrics.visitas}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Likes</p>
                    <p className="text-2xl font-bold">{metrics.likes}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Comentários</p>
                    <p className="text-2xl font-bold">{metrics.comentarios}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total de Atividades</p>
                    <p className="text-2xl font-bold">{metrics.totalDeAtividades}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Respostas Positivas</p>
                    <p className="text-2xl font-bold">{metrics.respostasPositivas}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Reuniões</p>
                    <p className="text-2xl font-bold">{metrics.reunioes}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Propostas</p>
                    <p className="text-2xl font-bold">{metrics.propostas}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Vendas</p>
                    <p className="text-2xl font-bold">{metrics.vendas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Taxas de Conversão */}
            <Card>
              <CardHeader>
                <CardTitle>Taxas de Conversão</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Respostas Positivas / Convites Enviados</p>
                    <p className="text-2xl font-bold">{conversionRates.respostasPositivasConvitesEnviados}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Respostas Positivas / Conexões Realizadas</p>
                    <p className="text-2xl font-bold">{conversionRates.respostasPositivasConexoesRealizadas}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Respostas Positivas / Mensagens Enviadas</p>
                    <p className="text-2xl font-bold">{conversionRates.respostasPositivasMensagensEnviadas}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Reuniões / Respostas Positivas</p>
                    <p className="text-2xl font-bold">{conversionRates.numeroDeReunioesRespostasPositivas}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Reuniões / Convites Enviados</p>
                    <p className="text-2xl font-bold">{conversionRates.numeroDeReunioesConvitesEnviados}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Observações */}
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Observações Gerais</Label>
                  <Textarea value={observations.observacoes} rows={3} placeholder="Nenhuma observação registrada" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Problemas Técnicos</Label>
                  <Textarea value={observations.problemasTecnicos} rows={3} placeholder="Nenhum problema reportado" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Ajustes na Pesquisa</Label>
                  <Textarea value={observations.ajustesNaPesquisa} rows={3} placeholder="Nenhum ajuste registrado" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Análise Comparativa</Label>
                  <Textarea value={observations.analiseComparativa} rows={3} placeholder="Nenhuma análise disponível" disabled />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendário Semanal de Atividades</CardTitle>
                <CardDescription>Status de atividade por dia da semana</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semana</TableHead>
                      <TableHead className="text-center">Segunda</TableHead>
                      <TableHead className="text-center">Terça</TableHead>
                      <TableHead className="text-center">Quarta</TableHead>
                      <TableHead className="text-center">Quinta</TableHead>
                      <TableHead className="text-center">Sexta</TableHead>
                      <TableHead className="text-center">Sábado</TableHead>
                      <TableHead className="text-center">Domingo</TableHead>
                      <TableHead className="text-center">Dias Ativos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyCalendar.map((week, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{week.semana}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={week.segundaFeira === 'Ativo' ? 'default' : 'secondary'}>
                            {week.segundaFeira}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={week.tercaFeira === 'Ativo' ? 'default' : 'secondary'}>
                            {week.tercaFeira}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={week.quartaFeira === 'Ativo' ? 'default' : 'secondary'}>
                            {week.quartaFeira}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={week.quintaFeira === 'Ativo' ? 'default' : 'secondary'}>
                            {week.quintaFeira}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={week.sextaFeira === 'Ativo' ? 'default' : 'secondary'}>
                            {week.sextaFeira}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={week.sabado === 'Ativo' ? 'default' : 'secondary'}>
                            {week.sabado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={week.domingo === 'Ativo' ? 'default' : 'secondary'}>
                            {week.domingo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-bold">{week.diasAtivos}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Comparação entre Campanhas</CardTitle>
                <CardDescription>Métricas lado a lado de todas as campanhas</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Métrica</TableHead>
                      {campaignComparisons.map((campaign, index) => (
                        <TableHead key={index} className="text-center min-w-[150px]">{campaign.campaignName}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Início do Período</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.inicioDoPeriodo}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Fim do Período</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.fimDoPeriodo}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Dias Ativos</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center font-bold">{c.diasAtivos}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Convites Enviados</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.convitesEnviados}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Conexões Realizadas</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.conexoesRealizadas}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Taxa de Aceite (%)</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.taxaDeAceiteDeConexao}%</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Mensagens Enviadas</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.mensagensEnviadas}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Visitas</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.visitas}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Likes</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.likes}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Comentários</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.comentarios}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Total de Atividades</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.totalDeAtividades}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Respostas Positivas</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center font-bold">{c.respostasPositivas}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Leads Processados</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.leadsProcessados}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Reuniões</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.reunioes}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Propostas</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.propostas}</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Vendas</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.vendas}</TableCell>)}
                    </TableRow>
                    <TableRow className="bg-muted/50">
                      <TableCell className="font-bold" colSpan={campaignComparisons.length + 1}>Taxas de Conversão</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Respostas Positivas / Convites Enviados (%)</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.respostasPositivasConvitesEnviados}%</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Respostas Positivas / Conexões Realizadas (%)</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.respostasPositivasConexoesRealizadas}%</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Respostas Positivas / Mensagens Enviadas (%)</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.respostasPositivasMensagensEnviadas}%</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Reuniões / Respostas Positivas (%)</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.numeroDeReunioesRespostasPositivas}%</TableCell>)}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Reuniões / Convites Enviados (%)</TableCell>
                      {campaignComparisons.map((c, i) => <TableCell key={i} className="text-center">{c.numeroDeReunioesConvitesEnviados}%</TableCell>)}
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
