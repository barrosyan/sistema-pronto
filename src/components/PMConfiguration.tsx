import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Crown, Users, Loader2 } from 'lucide-react';
import { useAdminUser } from '@/contexts/AdminUserContext';

interface User {
  id: string;
  email: string;
  full_name: string | null;
}

export function PMConfiguration() {
  const { isAdmin, selectedUserIds, setSelectedUserIds, currentUserId, loading: contextLoading } = useAdminUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [isPM, setIsPM] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsPM(isAdmin);
    if (isAdmin) {
      loadAllUsers();
    }
  }, [isAdmin]);

  const loadAllUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      if (error) throw error;
      setUsers(profilesData || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const togglePMRole = async (enabled: boolean) => {
    if (!currentUserId) {
      toast.error('Usuário não autenticado');
      return;
    }

    setSaving(true);
    try {
      if (enabled) {
        // Add admin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: currentUserId,
            role: 'admin'
          });

        if (error) {
          if (error.code === '23505') {
            // Already has the role
            setIsPM(true);
            await loadAllUsers();
          } else {
            throw error;
          }
        } else {
          setIsPM(true);
          toast.success('Você agora é um PM! Pode visualizar dados de outros usuários.');
          await loadAllUsers();
        }
      } else {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', currentUserId)
          .eq('role', 'admin');

        if (error) throw error;

        setIsPM(false);
        setSelectedUserIds([currentUserId]);
        setUsers([]);
        toast.success('Você não é mais PM. Visualizando apenas seus dados.');
      }
    } catch (error) {
      console.error('Error toggling PM role:', error);
      toast.error('Erro ao alterar configuração de PM');
    } finally {
      setSaving(false);
    }
  };

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds([...selectedUserIds, userId]);
    } else {
      // Don't allow deselecting own user
      if (userId === currentUserId) return;
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    }
  };

  const selectAll = () => {
    setSelectedUserIds(users.map(u => u.id));
  };

  const selectOnlyMe = () => {
    if (currentUserId) {
      setSelectedUserIds([currentUserId]);
    }
  };

  if (contextLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* PM Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Configuração de PM (Project Manager)</CardTitle>
          </div>
          <CardDescription>
            Como PM, você pode visualizar dados de campanhas e leads de todos os usuários selecionados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="pm-toggle" className="text-base font-medium">
                Ativar modo PM
              </Label>
              <p className="text-sm text-muted-foreground">
                Habilite para visualizar dados de múltiplos usuários
              </p>
            </div>
            <Switch
              id="pm-toggle"
              checked={isPM}
              onCheckedChange={togglePMRole}
              disabled={saving}
            />
          </div>
          
          {isPM && (
            <Badge variant="default" className="mt-2">
              <Crown className="h-3 w-3 mr-1" />
              Você é um PM
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* User Selection - Only shows when PM */}
      {isPM && (
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Selecionar Usuários para Análise</CardTitle>
            </div>
            <CardDescription>
              Selecione de quais usuários deseja visualizar os dados de campanhas e leads
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingUsers ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    Selecionar Todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={selectOnlyMe}>
                    Apenas Eu
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                  {users.map((user) => (
                    <div 
                      key={user.id} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        selectedUserIds.includes(user.id) 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'border-border'
                      }`}
                    >
                      <Checkbox
                        id={`pm-user-${user.id}`}
                        checked={selectedUserIds.includes(user.id)}
                        onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
                        disabled={user.id === currentUserId}
                      />
                      <Label
                        htmlFor={`pm-user-${user.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        <div className="font-medium">
                          {user.full_name || 'Sem nome'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </Label>
                      {user.id === currentUserId && (
                        <Badge variant="secondary" className="text-xs">Você</Badge>
                      )}
                    </div>
                  ))}
                </div>

                {users.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhum usuário encontrado
                  </p>
                )}

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <strong>{selectedUserIds.length}</strong> usuário(s) selecionado(s) para análise
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
