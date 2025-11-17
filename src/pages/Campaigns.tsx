import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCampaignData } from '@/hooks/useCampaignData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DailyData {
  date: string;
  invitations: number;
  connections: number;
  messages: number;
  visits: number;
  likes: number;
  comments: number;
  positiveResponses: number;
}

interface WeeklyData {
  week: string;
  startDate: string;
  endDate: string;
  invitations: number;
  connections: number;
  messages: number;
  visits: number;
  likes: number;
  comments: number;
  positiveResponses: number;
  meetings: number;
}

export default function Campaigns() {
  const { campaignMetrics, getAllLeads, loadFromDatabase, isLoading } = useCampaignData();
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [granularity, setGranularity] = useState<'daily' | 'weekly'>('weekly');

  useEffect(() => {
    loadFromDatabase();
  }, [loadFromDatabase]);

  // Extract unique campaigns
  const allCampaigns = Array.from(new Set(campaignMetrics.map(m => m.campaignName).filter(Boolean)));

  useEffect(() => {
    if (allCampaigns.length > 0 && selectedCampaigns.length === 0) {
      setSelectedCampaigns([allCampaigns[0]]);
    }
  }, [allCampaigns]);

  const toggleCampaign = (campaign: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaign) 
        ? prev.filter(c => c !== campaign)
        : [...prev, campaign]
    );
  };

  const getDailyDataForCampaign = (campaignName: string): DailyData[] => {
    const campaignData = campaignMetrics.filter(m => m.campaignName === campaignName);
    const allDates = new Set<string>();
    
    campaignData.forEach(metric => {
      Object.keys(metric.dailyData || {}).forEach(date => allDates.add(date));
    });

    return Array.from(allDates).sort().map(date => {
      const invitations = campaignData.find(m => m.eventType === 'Connection Requests Sent')?.dailyData?.[date] || 0;
      const connections = campaignData.find(m => m.eventType === 'Connection Requests Accepted')?.dailyData?.[date] || 0;
      const messages = campaignData.find(m => m.eventType === 'Messages Sent')?.dailyData?.[date] || 0;
      const visits = campaignData.find(m => m.eventType === 'Profile Visits')?.dailyData?.[date] || 0;
      const likes = campaignData.find(m => m.eventType === 'Post Likes')?.dailyData?.[date] || 0;
      const comments = campaignData.find(m => m.eventType === 'Comments Done')?.dailyData?.[date] || 0;

      const leads = getAllLeads().filter(l => l.campaign === campaignName);
      const positiveResponses = leads.filter(l => 
        l.status === 'positive' && l.positiveResponseDate === date
      ).length;

      return {
        date,
        invitations,
        connections,
        messages,
        visits,
        likes,
        comments,
        positiveResponses
      };
    });
  };

  const getWeeklyDataForCampaign = (campaignName: string): WeeklyData[] => {
    const dailyData = getDailyDataForCampaign(campaignName);
    const weeklyMap = new Map<string, WeeklyData>();

    dailyData.forEach(day => {
      const date = new Date(day.date);
      const weekStart = startOfWeek(date, { locale: ptBR });
      const weekEnd = endOfWeek(date, { locale: ptBR });
      const weekKey = format(weekStart, 'yyyy-MM-dd');

      if (!weeklyMap.has(weekKey)) {
        weeklyMap.set(weekKey, {
          week: `Semana ${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`,
          startDate: format(weekStart, 'yyyy-MM-dd'),
          endDate: format(weekEnd, 'yyyy-MM-dd'),
          invitations: 0,
          connections: 0,
          messages: 0,
          visits: 0,
          likes: 0,
          comments: 0,
          positiveResponses: 0,
          meetings: 0
        });
      }

      const weekData = weeklyMap.get(weekKey)!;
      weekData.invitations += day.invitations;
      weekData.connections += day.connections;
      weekData.messages += day.messages;
      weekData.visits += day.visits;
      weekData.likes += day.likes;
      weekData.comments += day.comments;
      weekData.positiveResponses += day.positiveResponses;
    });

    const leads = getAllLeads().filter(l => l.campaign === campaignName);
    weeklyMap.forEach(weekData => {
      const weekLeads = leads.filter(l => {
        if (!l.meetingDate) return false;
        const meetingDate = new Date(l.meetingDate);
        return meetingDate >= new Date(weekData.startDate) && meetingDate <= new Date(weekData.endDate);
      });
      weekData.meetings = weekLeads.length;
    });

    return Array.from(weeklyMap.values()).sort((a, b) => a.startDate.localeCompare(b.startDate));
  };

  const getCombinedData = () => {
    if (selectedCampaigns.length === 0) return [];

    if (granularity === 'daily') {
      const allDatesSet = new Set<string>();
      selectedCampaigns.forEach(campaign => {
        getDailyDataForCampaign(campaign).forEach(d => allDatesSet.add(d.date));
      });

      return Array.from(allDatesSet).sort().map(date => {
        const dataPoint: any = { date };
        selectedCampaigns.forEach(campaign => {
          const campaignData = getDailyDataForCampaign(campaign).find(d => d.date === date);
          dataPoint[`${campaign}_invitations`] = campaignData?.invitations || 0;
          dataPoint[`${campaign}_connections`] = campaignData?.connections || 0;
          dataPoint[`${campaign}_messages`] = campaignData?.messages || 0;
          dataPoint[`${campaign}_visits`] = campaignData?.visits || 0;
        });
        return dataPoint;
      });
    } else {
      const allWeeksSet = new Set<string>();
      selectedCampaigns.forEach(campaign => {
        getWeeklyDataForCampaign(campaign).forEach(w => allWeeksSet.add(w.week));
      });

      return Array.from(allWeeksSet).sort().map(week => {
        const dataPoint: any = { week };
        selectedCampaigns.forEach(campaign => {
          const campaignData = getWeeklyDataForCampaign(campaign).find(w => w.week === week);
          dataPoint[`${campaign}_invitations`] = campaignData?.invitations || 0;
          dataPoint[`${campaign}_connections`] = campaignData?.connections || 0;
          dataPoint[`${campaign}_messages`] = campaignData?.messages || 0;
          dataPoint[`${campaign}_visits`] = campaignData?.visits || 0;
        });
        return dataPoint;
      });
    }
  };

  const getCampaignSummary = (campaignName: string) => {
    const weeklyData = getWeeklyDataForCampaign(campaignName);
    const totals = weeklyData.reduce((acc, week) => ({
      invitations: acc.invitations + week.invitations,
      connections: acc.connections + week.connections,
      messages: acc.messages + week.messages,
      visits: acc.visits + week.visits,
      likes: acc.likes + week.likes,
      comments: acc.comments + week.comments,
      positiveResponses: acc.positiveResponses + week.positiveResponses,
      meetings: acc.meetings + week.meetings
    }), {
      invitations: 0,
      connections: 0,
      messages: 0,
      visits: 0,
      likes: 0,
      comments: 0,
      positiveResponses: 0,
      meetings: 0
    });

    const acceptanceRate = totals.invitations > 0 
      ? ((totals.connections / totals.invitations) * 100).toFixed(1)
      : '0.0';

    return { ...totals, acceptanceRate };
  };

  const combinedData = getCombinedData();

  const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Carregando dados...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (allCampaigns.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Sem Dados de Campanhas</CardTitle>
            <CardDescription>
              Nenhuma campanha encontrada. Vá para Configurações e faça upload dos arquivos, depois clique em "Processar Todos os Arquivos".
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Campanhas</h1>
        <p className="text-muted-foreground">Análise detalhada e comparativa de campanhas</p>
      </div>

      {/* Campaign Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Campanhas para Análise</CardTitle>
          <CardDescription>Selecione uma ou mais campanhas para visualizar e comparar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCampaigns.map(campaign => (
              <div key={campaign} className="flex items-center space-x-2">
                <Checkbox
                  id={campaign}
                  checked={selectedCampaigns.includes(campaign)}
                  onCheckedChange={() => toggleCampaign(campaign)}
                />
                <Label htmlFor={campaign} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {campaign}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Granularity Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Granularidade de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={granularity} onValueChange={(v) => setGranularity(v as 'daily' | 'weekly')}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCampaigns.length > 0 && (
        <>
          {/* Campaign Summaries */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedCampaigns.map(campaign => {
              const summary = getCampaignSummary(campaign);
              return (
                <Card key={campaign}>
                  <CardHeader>
                    <CardTitle className="text-lg">{campaign}</CardTitle>
                    <CardDescription>Resumo Geral</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Convites</span>
                      <span className="font-bold">{summary.invitations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Conexões</span>
                      <span className="font-bold">{summary.connections}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mensagens</span>
                      <span className="font-bold">{summary.messages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taxa Aceite</span>
                      <span className="font-bold">{summary.acceptanceRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Respostas +</span>
                      <span className="font-bold text-success">{summary.positiveResponses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reuniões</span>
                      <span className="font-bold text-primary">{summary.meetings}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts */}
          <Tabs defaultValue="invitations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="invitations">Convites</TabsTrigger>
              <TabsTrigger value="connections">Conexões</TabsTrigger>
              <TabsTrigger value="messages">Mensagens</TabsTrigger>
              <TabsTrigger value="visits">Visitas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invitations">
              <Card>
                <CardHeader>
                  <CardTitle>Convites Enviados - {granularity === 'daily' ? 'Diário' : 'Semanal'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey={granularity === 'daily' ? 'date' : 'week'} 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                      {selectedCampaigns.map((campaign, idx) => (
                        <Line
                          key={campaign}
                          type="monotone"
                          dataKey={`${campaign}_invitations`}
                          name={campaign}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={{ fill: colors[idx % colors.length], r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connections">
              <Card>
                <CardHeader>
                  <CardTitle>Conexões Realizadas - {granularity === 'daily' ? 'Diário' : 'Semanal'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey={granularity === 'daily' ? 'date' : 'week'} 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                      {selectedCampaigns.map((campaign, idx) => (
                        <Line
                          key={campaign}
                          type="monotone"
                          dataKey={`${campaign}_connections`}
                          name={campaign}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={{ fill: colors[idx % colors.length], r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Mensagens Enviadas - {granularity === 'daily' ? 'Diário' : 'Semanal'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey={granularity === 'daily' ? 'date' : 'week'} 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                      {selectedCampaigns.map((campaign, idx) => (
                        <Line
                          key={campaign}
                          type="monotone"
                          dataKey={`${campaign}_messages`}
                          name={campaign}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={{ fill: colors[idx % colors.length], r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visits">
              <Card>
                <CardHeader>
                  <CardTitle>Visitas ao Perfil - {granularity === 'daily' ? 'Diário' : 'Semanal'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={combinedData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey={granularity === 'daily' ? 'date' : 'week'} 
                        stroke="hsl(var(--muted-foreground))"
                        tick={{ fill: 'hsl(var(--foreground))' }}
                      />
                      <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--foreground))' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          color: 'hsl(var(--foreground))'
                        }} 
                      />
                      <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                      {selectedCampaigns.map((campaign, idx) => (
                        <Line
                          key={campaign}
                          type="monotone"
                          dataKey={`${campaign}_visits`}
                          name={campaign}
                          stroke={colors[idx % colors.length]}
                          strokeWidth={2}
                          dot={{ fill: colors[idx % colors.length], r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Detailed Calendar/Table View */}
          <Card>
            <CardHeader>
              <CardTitle>Calendário Detalhado - {granularity === 'daily' ? 'Dados Diários' : 'Dados Semanais'}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCampaigns.map(campaign => {
                const data = granularity === 'daily' 
                  ? getDailyDataForCampaign(campaign)
                  : getWeeklyDataForCampaign(campaign);
                
                return (
                  <div key={campaign} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">{campaign}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-2 text-sm font-medium">{granularity === 'daily' ? 'Data' : 'Semana'}</th>
                            <th className="text-left p-2 text-sm font-medium">Convites</th>
                            <th className="text-left p-2 text-sm font-medium">Conexões</th>
                            <th className="text-left p-2 text-sm font-medium">Mensagens</th>
                            <th className="text-left p-2 text-sm font-medium">Visitas</th>
                            <th className="text-left p-2 text-sm font-medium">Likes</th>
                            <th className="text-left p-2 text-sm font-medium">Comentários</th>
                            <th className="text-left p-2 text-sm font-medium">Resp. +</th>
                            {granularity === 'weekly' && <th className="text-left p-2 text-sm font-medium">Reuniões</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {data.map((row, idx) => (
                            <tr key={idx} className="border-b border-border/50 hover:bg-muted/50">
                              <td className="p-2 text-sm">{granularity === 'daily' ? row.date : (row as WeeklyData).week}</td>
                              <td className="p-2 text-sm">{row.invitations}</td>
                              <td className="p-2 text-sm">{row.connections}</td>
                              <td className="p-2 text-sm">{row.messages}</td>
                              <td className="p-2 text-sm">{row.visits}</td>
                              <td className="p-2 text-sm">{row.likes}</td>
                              <td className="p-2 text-sm">{row.comments}</td>
                              <td className="p-2 text-sm">{row.positiveResponses}</td>
                              {granularity === 'weekly' && <td className="p-2 text-sm">{(row as WeeklyData).meetings}</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
