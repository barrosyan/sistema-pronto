import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Lead } from '@/types/campaign';

interface CampaignSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (campaignName: string) => void;
  existingCampaigns: string[];
  suggestedName?: string;
  positiveLeads?: Lead[];
  negativeLeads?: Lead[];
}

export function CampaignSelectionDialog({
  open,
  onOpenChange,
  onConfirm,
  existingCampaigns,
  suggestedName = '',
  positiveLeads = [],
  negativeLeads = [],
}: CampaignSelectionDialogProps) {
  const [selectionType, setSelectionType] = useState<'existing' | 'new'>('existing');
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [newCampaignName, setNewCampaignName] = useState(suggestedName);

  useEffect(() => {
    if (suggestedName) {
      setNewCampaignName(suggestedName);
    }
  }, [suggestedName]);

  useEffect(() => {
    // Se não há campanhas existentes, forçar criação de nova
    if (existingCampaigns.length === 0) {
      setSelectionType('new');
    }
  }, [existingCampaigns]);

  const handleConfirm = () => {
    const campaignName = selectionType === 'existing' ? selectedCampaign : newCampaignName.trim();
    if (campaignName) {
      onConfirm(campaignName);
    }
  };

  const isValid = selectionType === 'existing' ? selectedCampaign : newCampaignName.trim().length > 0;
  const totalLeads = positiveLeads.length + negativeLeads.length;
  const previewLeads = [...positiveLeads.slice(0, 5), ...negativeLeads.slice(0, 5)];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Preview e Seleção de Campanha</DialogTitle>
          <DialogDescription>
            Encontrados {totalLeads} leads ({positiveLeads.length} positivos, {negativeLeads.length} negativos)
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview dos Dados</TabsTrigger>
            <TabsTrigger value="campaign">Selecionar Campanha</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {previewLeads.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="border border-border px-3 py-2 text-left font-semibold">Nome</th>
                              <th className="border border-border px-3 py-2 text-left font-semibold">Empresa</th>
                              <th className="border border-border px-3 py-2 text-left font-semibold">Cargo</th>
                              <th className="border border-border px-3 py-2 text-left font-semibold">LinkedIn</th>
                              <th className="border border-border px-3 py-2 text-left font-semibold">Tipo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewLeads.map((lead, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                                <td className="border border-border px-3 py-2">{lead.name}</td>
                                <td className="border border-border px-3 py-2">{lead.company}</td>
                                <td className="border border-border px-3 py-2">{lead.position}</td>
                                <td className="border border-border px-3 py-2 text-xs truncate max-w-[200px]">
                                  {lead.linkedin}
                                </td>
                                <td className="border border-border px-3 py-2">
                                  <span className={`inline-block px-2 py-1 rounded text-xs ${
                                    lead.classification === 'positive' 
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                  }`}>
                                    {lead.classification === 'positive' ? 'Positivo' : 'Negativo'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {totalLeads > 10 && (
                          <p className="text-sm text-muted-foreground text-center mt-4">
                            Mostrando 10 de {totalLeads} leads
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Nenhum dado encontrado no arquivo
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaign" className="space-y-6 py-4">
            <RadioGroup value={selectionType} onValueChange={(value) => setSelectionType(value as 'existing' | 'new')}>
              {existingCampaigns.length > 0 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="existing" id="existing" />
                  <Label htmlFor="existing" className="cursor-pointer">Campanha existente</Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="cursor-pointer">Nova campanha</Label>
              </div>
            </RadioGroup>

            {selectionType === 'existing' && existingCampaigns.length > 0 ? (
              <div className="space-y-2">
                <Label>Selecione a campanha</Label>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha uma campanha..." />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCampaigns.map((campaign) => (
                      <SelectItem key={campaign} value={campaign}>
                        {campaign}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Nome da nova campanha</Label>
                <Input
                  id="campaign-name"
                  placeholder="Digite o nome da campanha..."
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                />
                {suggestedName && (
                  <p className="text-sm text-muted-foreground">
                    Sugestão baseada no arquivo: {suggestedName}
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!isValid}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
