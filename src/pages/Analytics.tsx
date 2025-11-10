import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Users, Mail, Calendar, Activity } from 'lucide-react';
import { useCampaignData } from '@/hooks/useCampaignData';
import { useEffect, useMemo, useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const Analytics = () => {
  const { campaignMetrics, positiveLeads, negativeLeads, loadFromDatabase } = useCampaignData();
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  useEffect(() => {
    loadFromDatabase();
  }, [loadFromDatabase]);

  const availableCampaigns = useMemo(() => {
    const campaigns = new Set(campaignMetrics.map(m => m.campaignName).filter(Boolean));
    return Array.from(campaigns);
  }, [campaignMetrics]);

  const filteredMetrics = useMemo(() => {
    if (selectedCampaign === 'all') return campaignMetrics;
    return campaignMetrics.filter(m => m.campaignName === selectedCampaign);
  }, [campaignMetrics, selectedCampaign]);

  const filteredPositiveLeads = useMemo(() => {
    if (selectedCampaign === 'all') return positiveLeads;
    return positiveLeads.filter(l => l.campaign === selectedCampaign);
  }, [positiveLeads, selectedCampaign]);

  const filteredNegativeLeads = useMemo(() => {
    if (selectedCampaign === 'all') return negativeLeads;
    return negativeLeads.filter(l => l.campaign === selectedCampaign);
  }, [negativeLeads, selectedCampaign]);

  const totalMetrics = useMemo(() => {
    const invitationsSent = filteredMetrics
      .filter(m => m.eventType === 'Connection Requests Sent')
      .reduce((sum, m) => sum + m.totalCount, 0);

    const connectionsAccepted = filteredMetrics
      .filter(m => m.eventType === 'Connection Requests Accepted')
      .reduce((sum, m) => sum + m.totalCount, 0);

    const messagesSent = filteredMetrics
      .filter(m => m.eventType === 'Messages Sent')
      .reduce((sum, m) => sum + m.totalCount, 0);

    const positiveResponses = filteredPositiveLeads.length;
    const meetings = filteredPositiveLeads.filter(l => l.meetingDate).length;
    const acceptanceRate = invitationsSent > 0 ? ((connectionsAccepted / invitationsSent) * 100).toFixed(1) : '0';
    const conversionRate = messagesSent > 0 ? ((positiveResponses / messagesSent) * 100).toFixed(1) : '0';
    const meetingRate = positiveResponses > 0 ? ((meetings / positiveResponses) * 100).toFixed(1) : '0';

    return {
      invitationsSent,
      connectionsAccepted,
      messagesSent,
      positiveResponses,
      meetings,
      acceptanceRate,
      conversionRate,
      meetingRate,
    };
  }, [filteredMetrics, filteredPositiveLeads]);

  const timelineData = useMemo(() => {
    const dailyData: Record<string, any> = {};

    filteredMetrics.forEach(metric => {
      Object.entries(metric.dailyData || {}).forEach(([date, count]) => {
        if (!dailyData[date]) {
          dailyData[date] = { date };
        }
        
        switch (metric.eventType) {
          case 'Connection Requests Sent':
            dailyData[date].invitations = (dailyData[date].invitations || 0) + (count as number);
            break;
          case 'Connection Requests Accepted':
            dailyData[date].connections = (dailyData[date].connections || 0) + (count as number);
            break;
          case 'Messages Sent':
            dailyData[date].messages = (dailyData[date].messages || 0) + (count as number);
            break;
          case 'Profile Visits':
            dailyData[date].visits = (dailyData[date].visits || 0) + (count as number);
            break;
        }
      });
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredMetrics]);

  const funnelData = useMemo(() => [
    { label: 'Convites Enviados', value: totalMetrics.invitationsSent, width: '100%' },
    { label: 'Conexões Realizadas', value: totalMetrics.connectionsAccepted, width: `${totalMetrics.invitationsSent > 0 ? (totalMetrics.connectionsAccepted / totalMetrics.invitationsSent) * 100 : 0}%` },
    { label: 'Mensagens Enviadas', value: totalMetrics.messagesSent, width: `${totalMetrics.invitationsSent > 0 ? (totalMetrics.messagesSent / totalMetrics.invitationsSent) * 100 : 0}%` },
    { label: 'Respostas Positivas', value: totalMetrics.positiveResponses, width: `${totalMetrics.invitationsSent > 0 ? (totalMetrics.positiveResponses / totalMetrics.invitationsSent) * 100 : 0}%` },
    { label: 'Reuniões Marcadas', value: totalMetrics.meetings, width: `${totalMetrics.invitationsSent > 0 ? (totalMetrics.meetings / totalMetrics.invitationsSent) * 100 : 0}%` },
    { label: 'Propostas', value: filteredPositiveLeads.filter(l => l.proposalDate).length, width: `${totalMetrics.invitationsSent > 0 ? (filteredPositiveLeads.filter(l => l.proposalDate).length / totalMetrics.invitationsSent) * 100 : 0}%` },
    { label: 'Vendas', value: filteredPositiveLeads.filter(l => l.saleDate).length, width: `${totalMetrics.invitationsSent > 0 ? (filteredPositiveLeads.filter(l => l.saleDate).length / totalMetrics.invitationsSent) * 100 : 0}%` },
  ], [totalMetrics, filteredPositiveLeads]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-1">
          Visualize métricas e análises comparativas de campanhas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="campaign-filter">Campanha</Label>
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger id="campaign-filter" className="w-full max-w-md">
                <SelectValue placeholder="Selecione uma campanha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Campanhas</SelectItem>
                {availableCampaigns.map(campaign => (
                  <SelectItem key={campaign} value={campaign}>
                    {campaign}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Convites Enviados</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.invitationsSent}</div>
            <p className="text-xs text-muted-foreground">Total de todas as campanhas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conexões Realizadas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.connectionsAccepted}</div>
            <p className="text-xs text-muted-foreground">Taxa de aceite: {totalMetrics.acceptanceRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Respostas Positivas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.positiveResponses}</div>
            <p className="text-xs text-muted-foreground">Taxa de conversão: {totalMetrics.conversionRate}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reuniões Marcadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMetrics.meetings}</div>
            <p className="text-xs text-muted-foreground">Taxa de conversão: {totalMetrics.meetingRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Funil de Conversão</CardTitle>
          <CardDescription>Acompanhe a jornada dos leads desde o primeiro contato até a venda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelData.map((stage, index) => {
              const percentage = totalMetrics.invitationsSent > 0 
                ? (stage.value / totalMetrics.invitationsSent) * 100 
                : 0;
              
              return (
                <div key={index} className="relative">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium">{stage.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {stage.value} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div 
                    className="relative h-12 bg-muted/30 rounded-lg overflow-hidden"
                    style={{ 
                      width: `${100 - (index * 8)}%`,
                      margin: '0 auto'
                    }}
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-lg flex items-center justify-center transition-all duration-500"
                      style={{ width: stage.width }}
                    >
                      {percentage > 5 && (
                        <span className="text-xs font-semibold text-primary-foreground">
                          {stage.value}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline Charts */}
      {timelineData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Atividades</CardTitle>
              <CardDescription>Acompanhe a evolução diária de convites, conexões e mensagens</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  invitations: {
                    label: 'Convites',
                    color: 'hsl(var(--chart-1))',
                  },
                  connections: {
                    label: 'Conexões',
                    color: 'hsl(var(--chart-2))',
                  },
                  messages: {
                    label: 'Mensagens',
                    color: 'hsl(var(--chart-3))',
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="invitations" 
                    stackId="1"
                    stroke="hsl(var(--chart-1))" 
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="connections" 
                    stackId="2"
                    stroke="hsl(var(--chart-2))" 
                    fill="hsl(var(--chart-2))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="messages" 
                    stackId="3"
                    stroke="hsl(var(--chart-3))" 
                    fill="hsl(var(--chart-3))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Convites vs Conexões</CardTitle>
                <CardDescription>Compare convites enviados com conexões aceitas</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    invitations: {
                      label: 'Convites',
                      color: 'hsl(var(--chart-1))',
                    },
                    connections: {
                      label: 'Conexões',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className="h-[250px]"
                >
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="invitations" 
                      stroke="hsl(var(--chart-1))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-1))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="connections" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--chart-2))' }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade Diária</CardTitle>
                <CardDescription>Volume de atividades por dia</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    visits: {
                      label: 'Visitas',
                      color: 'hsl(var(--chart-4))',
                    },
                  }}
                  className="h-[250px]"
                >
                  <BarChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis className="text-xs" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar 
                      dataKey="visits" 
                      fill="hsl(var(--chart-4))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {timelineData.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Métricas por Período</CardTitle>
            <CardDescription>Visualize o desempenho diário e semanal das campanhas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              Importe dados de campanhas para visualizar métricas detalhadas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Analytics;
