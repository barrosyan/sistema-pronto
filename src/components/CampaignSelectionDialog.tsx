import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CampaignSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (campaignName: string) => void;
  existingCampaigns: string[];
  suggestedName?: string;
}

export function CampaignSelectionDialog({
  open,
  onOpenChange,
  onConfirm,
  existingCampaigns,
  suggestedName = '',
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Selecionar Campanha</DialogTitle>
          <DialogDescription>
            Escolha a qual campanha estes leads pertencem ou crie uma nova campanha.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
        </div>

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
