import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { ProfileInfo, ConsolidatedMetrics, ConversionRates, WeeklyActivityCalendar, CampaignComparison } from '@/types/profile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WeeklyComparison } from '@/components/WeeklyComparison';

export default function Profile() {
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('Todas');
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    empresa: 'Presto',
    perfil: 'Ursula Aleixo',
    campanhas: [
      'Ursula Sebrae 100 Startups',
      'Ursula Sebrae 1000 Startups',
      'Ursula NEON 2025',
      'Ursula Web Summit Lisboa 2025'
    ],
    objetivoDasCampanhas: 'Conectar com startups e ampliar network em eventos estratégicos',
    cadencia: 'https://docs.google.com/document/d/...',
    cargosNaPesquisa: 'Founder, CEO, CTO'
  });

  const [metrics] = useState<ConsolidatedMetrics>({
    inicioDoPeriodo: '02/06/2025',
    fimDoPeriodo: '02/11/2025',
    campanhasAtivas: 28,
    diasAtivos: 120,
    convitesEnviados: 1020,
    conexoesRealizadas: 578,
    taxaDeAceiteDeConexao: 57,
    mensagensEnviadas: 1212,
    visitas: 1165,
    likes: 464,
    comentarios: 0,
    totalDeAtividades: 3861,
    respostasPositivas: 149,
    leadsProcessados: 1373,
    reunioes: 47,
    propostas: 7,
    vendas: 1
  });

  const [conversionRates] = useState<ConversionRates>({
    respostasPositivasConvitesEnviados: 14.6,
    respostasPositivasConexoesRealizadas: 25.8,
    respostasPositivasMensagensEnviadas: 12.3,
    numeroDeReunioesRespostasPositivas: 31.5,
    numeroDeReunioesConvitesEnviados: 4.6
  });

  const [weeklyCalendar] = useState<WeeklyActivityCalendar[]>([
    { semana: '02/06/2025', segundaFeira: 'Ativo', tercaFeira: 'Ativo', quartaFeira: 'Ativo', quintaFeira: 'Ativo', sextaFeira: 'Ativo', sabado: 'Inativo', domingo: 'Inativo', diasAtivos: 5 },
    { semana: '09/06/2025', segundaFeira: 'Ativo', tercaFeira: 'Ativo', quartaFeira: 'Inativo', quintaFeira: 'Ativo', sextaFeira: 'Ativo', sabado: 'Inativo', domingo: 'Inativo', diasAtivos: 4 },
    { semana: '16/06/2025', segundaFeira: 'Ativo', tercaFeira: 'Ativo', quartaFeira: 'Ativo', quintaFeira: 'Ativo', sextaFeira: 'Ativo', sabado: 'Ativo', domingo: 'Inativo', diasAtivos: 6 },
  ]);

  const [campaignComparisons] = useState<CampaignComparison[]>([
    {
      campaignName: 'Ursula Sebrae 100 Startups',
      inicioDoPeriodo: '02/06/2025',
      fimDoPeriodo: '16/06/2025',
      diasAtivos: 12,
      convitesEnviados: 120,
      conexoesRealizadas: 72,
      taxaDeAceiteDeConexao: 60,
      mensagensEnviadas: 144,
      visitas: 132,
      likes: 52,
      comentarios: 2,
      totalDeAtividades: 462,
      respostasPositivas: 18,
      leadsProcessados: 132,
      reunioes: 6,
      propostas: 2,
      vendas: 0,
      respostasPositivasConvitesEnviados: 15,
      respostasPositivasConexoesRealizadas: 25,
      respostasPositivasMensagensEnviadas: 12.5,
      numeroDeReunioesRespostasPositivas: 33.3,
      numeroDeReunioesConvitesEnviados: 5,
      observacoes: 'Campanha com bom engajamento inicial',
      problemasTecnicos: '',
      ajustesNaPesquisa: '',
      analiseComparativa: ''
    }
  ]);

  const handleSaveInfo = () => {
    setIsEditingInfo(false);
    toast.success('Informações do perfil atualizadas!');
  };

  const filteredComparisons = selectedCampaign === 'Todas' 
    ? campaignComparisons 
    : campaignComparisons.filter(c => c.campaignName === selectedCampaign);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Perfil de Campanhas</h1>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="metrics">Métricas Gerais</TabsTrigger>
          <TabsTrigger value="conversion">Conversão</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
          <TabsTrigger value="comparison">Comparação</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>Dados gerais sobre o perfil e campanhas</CardDescription>
              </div>
              <Button
                variant={isEditingInfo ? "default" : "outline"}
                size="sm"
                onClick={() => isEditingInfo ? handleSaveInfo() : setIsEditingInfo(true)}
              >
                {isEditingInfo ? <><Save className="h-4 w-4 mr-2" /> Salvar</> : <><Pencil className="h-4 w-4 mr-2" /> Editar</>}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Empresa</Label>
                  {isEditingInfo ? (
                    <Input
                      value={profileInfo.empresa}
                      onChange={(e) => setProfileInfo({...profileInfo, empresa: e.target.value})}
                    />
                  ) : (
                    <p className="text-lg font-medium mt-1">{profileInfo.empresa}</p>
                  )}
                </div>
                <div>
                  <Label>Perfil</Label>
                  {isEditingInfo ? (
                    <Input
                      value={profileInfo.perfil}
                      onChange={(e) => setProfileInfo({...profileInfo, perfil: e.target.value})}
                    />
                  ) : (
                    <p className="text-lg font-medium mt-1">{profileInfo.perfil}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Campanhas Ativas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileInfo.campanhas.map((campaign) => (
                    <Badge key={campaign} variant="secondary">{campaign}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Objetivo das Campanhas</Label>
                {isEditingInfo ? (
                  <Textarea
                    value={profileInfo.objetivoDasCampanhas}
                    onChange={(e) => setProfileInfo({...profileInfo, objetivoDasCampanhas: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="mt-1">{profileInfo.objetivoDasCampanhas}</p>
                )}
              </div>

              <div>
                <Label>Cadência</Label>
                {isEditingInfo ? (
                  <Input
                    value={profileInfo.cadencia}
                    onChange={(e) => setProfileInfo({...profileInfo, cadencia: e.target.value})}
                  />
                ) : (
                  <p className="mt-1 text-primary underline">{profileInfo.cadencia}</p>
                )}
              </div>

              <div>
                <Label>Cargos na Pesquisa</Label>
                {isEditingInfo ? (
                  <Input
                    value={profileInfo.cargosNaPesquisa}
                    onChange={(e) => setProfileInfo({...profileInfo, cargosNaPesquisa: e.target.value})}
                  />
                ) : (
                  <p className="mt-1">{profileInfo.cargosNaPesquisa}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Métricas Consolidadas</CardTitle>
              <CardDescription>Período: {metrics.inicioDoPeriodo} - {metrics.fimDoPeriodo}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
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
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total de Atividades</p>
                  <p className="text-2xl font-bold">{metrics.totalDeAtividades}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Taxas de Conversão</CardTitle>
              <CardDescription>Análise de performance do funil de vendas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Respostas Positivas / Convites Enviados</span>
                  <span className="text-xl font-bold">{conversionRates.respostasPositivasConvitesEnviados}%</span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Respostas Positivas / Conexões Realizadas</span>
                  <span className="text-xl font-bold">{conversionRates.respostasPositivasConexoesRealizadas}%</span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Respostas Positivas / Mensagens Enviadas</span>
                  <span className="text-xl font-bold">{conversionRates.respostasPositivasMensagensEnviadas}%</span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Reuniões / Respostas Positivas</span>
                  <span className="text-xl font-bold">{conversionRates.numeroDeReunioesRespostasPositivas}%</span>
                </div>
                <div className="flex justify-between items-center p-4 border rounded-lg">
                  <span>Reuniões / Convites Enviados</span>
                  <span className="text-xl font-bold">{conversionRates.numeroDeReunioesConvitesEnviados}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendário de Atividades Semanais</CardTitle>
              <CardDescription>Visualização da atividade por dia da semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Semana</TableHead>
                      <TableHead>Seg</TableHead>
                      <TableHead>Ter</TableHead>
                      <TableHead>Qua</TableHead>
                      <TableHead>Qui</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>Sáb</TableHead>
                      <TableHead>Dom</TableHead>
                      <TableHead>Dias Ativos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyCalendar.map((week) => (
                      <TableRow key={week.semana}>
                        <TableCell className="font-medium">{week.semana}</TableCell>
                        <TableCell><Badge variant={week.segundaFeira === 'Ativo' ? 'default' : 'secondary'}>{week.segundaFeira}</Badge></TableCell>
                        <TableCell><Badge variant={week.tercaFeira === 'Ativo' ? 'default' : 'secondary'}>{week.tercaFeira}</Badge></TableCell>
                        <TableCell><Badge variant={week.quartaFeira === 'Ativo' ? 'default' : 'secondary'}>{week.quartaFeira}</Badge></TableCell>
                        <TableCell><Badge variant={week.quintaFeira === 'Ativo' ? 'default' : 'secondary'}>{week.quintaFeira}</Badge></TableCell>
                        <TableCell><Badge variant={week.sextaFeira === 'Ativo' ? 'default' : 'secondary'}>{week.sextaFeira}</Badge></TableCell>
                        <TableCell><Badge variant={week.sabado === 'Ativo' ? 'default' : 'secondary'}>{week.sabado}</Badge></TableCell>
                        <TableCell><Badge variant={week.domingo === 'Ativo' ? 'default' : 'secondary'}>{week.domingo}</Badge></TableCell>
                        <TableCell className="font-bold">{week.diasAtivos}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Comparação de Campanhas</h2>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todas">Todas as Campanhas</SelectItem>
                {profileInfo.campanhas.map((campaign) => (
                  <SelectItem key={campaign} value={campaign}>{campaign}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <WeeklyComparison 
            weeklyData={campaignComparisons}
            availableCampaigns={profileInfo.campanhas}
          />

          {filteredComparisons.map((comparison) => (
            <Card key={comparison.campaignName}>
              <CardHeader>
                <CardTitle>{comparison.campaignName}</CardTitle>
                <CardDescription>
                  Período: {comparison.inicioDoPeriodo} - {comparison.fimDoPeriodo} | Dias Ativos: {comparison.diasAtivos}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Convites</p>
                    <p className="text-xl font-bold">{comparison.convitesEnviados}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conexões</p>
                    <p className="text-xl font-bold">{comparison.conexoesRealizadas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taxa Aceite</p>
                    <p className="text-xl font-bold">{comparison.taxaDeAceiteDeConexao}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mensagens</p>
                    <p className="text-xl font-bold">{comparison.mensagensEnviadas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Respostas Positivas</p>
                    <p className="text-xl font-bold">{comparison.respostasPositivas}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Reuniões</p>
                    <p className="text-xl font-bold">{comparison.reunioes}</p>
                  </div>
                </div>

                {comparison.observacoes && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Observações:</p>
                    <p className="text-sm">{comparison.observacoes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
