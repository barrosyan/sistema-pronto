import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name: string;
    profile: string;
    objective: string;
    cadence: string;
    positions: string;
  }) => void;
}

export const CampaignDialog = ({ open, onOpenChange, onSave }: CampaignDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    profile: '',
    objective: '',
    cadence: '',
    positions: ''
  });

  const handleSave = () => {
    if (!formData.name || !formData.profile) {
      toast.error('Nome e Perfil são obrigatórios');
      return;
    }

    onSave(formData);
    setFormData({ name: '', profile: '', objective: '', cadence: '', positions: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Campanha</DialogTitle>
          <DialogDescription>
            Crie uma nova campanha de prospecção
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Campanha *</Label>
            <Input
              id="name"
              placeholder="Ex: Prospecção Q1 2024"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile">Perfil *</Label>
            <Input
              id="profile"
              placeholder="Ex: Gerentes de TI"
              value={formData.profile}
              onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Objetivo</Label>
            <Textarea
              id="objective"
              placeholder="Descreva o objetivo desta campanha"
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cadence">Cadência</Label>
            <Input
              id="cadence"
              placeholder="Ex: Diária, 50 convites/dia"
              value={formData.cadence}
              onChange={(e) => setFormData({ ...formData, cadence: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="positions">Cargos na Pesquisa</Label>
            <Textarea
              id="positions"
              placeholder="Ex: Gerente de TI, CTO, Diretor de Tecnologia"
              value={formData.positions}
              onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Criar Campanha
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
