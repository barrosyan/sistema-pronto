import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WeeklyData {
  week: string;
  invitations: number;
  connections: number;
  messages: number;
  positiveResponses: number;
  meetings: number;
  proposals: number;
  sales: number;
}

interface WeeklyPerformanceChartProps {
  data: WeeklyData[];
  campaignName: string;
}

export function WeeklyPerformanceChart({ data, campaignName }: WeeklyPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Desempenho Semanal - {campaignName}</CardTitle>
        <CardDescription>Análise detalhada por semana</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="week" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              tick={{ fill: 'hsl(var(--foreground))' }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="invitations" fill="#8b5cf6" name="Convites" />
            <Bar dataKey="connections" fill="#ec4899" name="Conexões" />
            <Bar dataKey="messages" fill="#f59e0b" name="Mensagens" />
            <Bar dataKey="positiveResponses" fill="#10b981" name="Resp. +" />
            <Bar dataKey="meetings" fill="#3b82f6" name="Reuniões" />
            <Bar dataKey="proposals" fill="#f97316" name="Propostas" />
            <Bar dataKey="sales" fill="#22c55e" name="Vendas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
