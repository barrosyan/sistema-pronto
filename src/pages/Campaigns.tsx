import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    toast.info('Processando arquivo de campanha...');
    // TODO: Implement campaign file processing
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campanhas Ativas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe suas campanhas de prospecção
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => document.getElementById('campaign-upload')?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Importar Dados
          </Button>
          <input
            id="campaign-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            className="hidden"
            onChange={handleFileUpload}
          />
          
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Campanha
          </Button>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma campanha encontrada
              </h3>
              <p className="text-muted-foreground mb-6">
                Importe dados de campanhas ou crie uma nova para começar
              </p>
              <Button onClick={() => document.getElementById('campaign-upload')?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Importar Primeira Campanha
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>{campaign.profile}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={campaign.isActive ? 'text-success' : 'text-muted-foreground'}>
                      {campaign.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Convites:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conexões:</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxa de Aceite:</span>
                    <span className="font-medium">0%</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Ver Detalhes
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
