import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CampaignComparisonProps {
  campaign1: {
    name: string;
    profile: string;
    invitations: number;
    connections: number;
    messages: number;
    positiveLeads: number;
    acceptanceRate: number;
  };
  campaign2: {
    name: string;
    profile: string;
    invitations: number;
    connections: number;
    messages: number;
    positiveLeads: number;
    acceptanceRate: number;
  };
}

export const CampaignComparison = ({ campaign1, campaign2 }: CampaignComparisonProps) => {
  const getComparisonIcon = (val1: number, val2: number) => {
    if (val1 > val2) return <TrendingUp className="h-4 w-4 text-success" />;
    if (val1 < val2) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getPercentageDiff = (val1: number, val2: number) => {
    if (val2 === 0) return 'N/A';
    const diff = ((val1 - val2) / val2) * 100;
    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
  };

  const metrics = [
    { label: 'Convites Enviados', key: 'invitations' },
    { label: 'Conexões Realizadas', key: 'connections' },
    { label: 'Mensagens Enviadas', key: 'messages' },
    { label: 'Respostas Positivas', key: 'positiveLeads' },
    { label: 'Taxa de Aceite (%)', key: 'acceptanceRate' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparação de Campanhas</CardTitle>
        <CardDescription>
          Análise comparativa entre {campaign1.profile === campaign2.profile ? 'mesma pessoa em ' : ''}diferentes campanhas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Campaign Headers */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm font-medium text-muted-foreground">Métrica</div>
            <div className="text-center">
              <div className="font-semibold text-sm">{campaign1.name}</div>
              <div className="text-xs text-muted-foreground">{campaign1.profile}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-sm">{campaign2.name}</div>
              <div className="text-xs text-muted-foreground">{campaign2.profile}</div>
            </div>
          </div>

          {/* Metrics Comparison */}
          {metrics.map((metric) => {
            const val1 = campaign1[metric.key as keyof typeof campaign1] as number;
            const val2 = campaign2[metric.key as keyof typeof campaign2] as number;
            const diff = getPercentageDiff(val1, val2);

            return (
              <div key={metric.key} className="grid grid-cols-3 gap-4 items-center py-2 border-b border-border last:border-0">
                <div className="text-sm font-medium">{metric.label}</div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-semibold">{val1}</span>
                    {getComparisonIcon(val1, val2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="font-semibold">{val2}</span>
                    <Badge variant="outline" className="text-xs">
                      {diff}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Summary */}
          <div className="bg-muted/50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold mb-2">Análise Comparativa:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {campaign1.profile === campaign2.profile && (
                <li>• Mesmo perfil ({campaign1.profile}) em eventos diferentes</li>
              )}
              {campaign1.acceptanceRate > campaign2.acceptanceRate ? (
                <li>• {campaign1.name} teve melhor taxa de aceite ({campaign1.acceptanceRate.toFixed(1)}% vs {campaign2.acceptanceRate.toFixed(1)}%)</li>
              ) : (
                <li>• {campaign2.name} teve melhor taxa de aceite ({campaign2.acceptanceRate.toFixed(1)}% vs {campaign1.acceptanceRate.toFixed(1)}%)</li>
              )}
              {campaign1.positiveLeads > campaign2.positiveLeads ? (
                <li>• {campaign1.name} gerou mais respostas positivas (+{campaign1.positiveLeads - campaign2.positiveLeads})</li>
              ) : campaign2.positiveLeads > campaign1.positiveLeads ? (
                <li>• {campaign2.name} gerou mais respostas positivas (+{campaign2.positiveLeads - campaign1.positiveLeads})</li>
              ) : (
                <li>• Ambas geraram o mesmo número de respostas positivas</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
