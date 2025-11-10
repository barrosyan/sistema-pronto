import { useCampaignData } from '@/hooks/useCampaignData';
import { Lead } from '@/types/campaign';

export interface LeadWithHistory {
  lead: Lead;
  events: string[];
  eventCount: number;
  firstEvent: string;
  lastEvent: string;
  isRecurrent: boolean;
}

export interface EventLeadsAnalysis {
  eventName: string;
  totalLeads: number;
  positiveLeads: number;
  negativeLeads: number;
  recurrentLeads: number;
  newLeads: number;
  leads: LeadWithHistory[];
}

export function useEventAnalysis() {
  const { getAllLeads } = useCampaignData();

  const getLeadHistory = (): Map<string, LeadWithHistory> => {
    const allLeads = getAllLeads();
    const leadMap = new Map<string, LeadWithHistory>();

    allLeads.forEach(lead => {
      const key = `${lead.name.toLowerCase()}_${lead.company.toLowerCase()}`;
      
      if (leadMap.has(key)) {
        const existing = leadMap.get(key)!;
        if (!existing.events.includes(lead.campaign)) {
          existing.events.push(lead.campaign);
          existing.eventCount++;
          existing.isRecurrent = existing.eventCount > 1;
        }
      } else {
        leadMap.set(key, {
          lead,
          events: [lead.campaign],
          eventCount: 1,
          firstEvent: lead.campaign,
          lastEvent: lead.campaign,
          isRecurrent: false
        });
      }
    });

    return leadMap;
  };

  const getEventLeadsAnalysis = (): EventLeadsAnalysis[] => {
    const allLeads = getAllLeads();
    const leadHistory = getLeadHistory();
    const eventMap = new Map<string, Lead[]>();

    // Group leads by event/campaign
    allLeads.forEach(lead => {
      const eventName = lead.campaign;
      if (!eventMap.has(eventName)) {
        eventMap.set(eventName, []);
      }
      eventMap.get(eventName)!.push(lead);
    });

    // Create analysis for each event
    return Array.from(eventMap.entries()).map(([eventName, leads]) => {
      const leadsWithHistory: LeadWithHistory[] = leads.map(lead => {
        const key = `${lead.name.toLowerCase()}_${lead.company.toLowerCase()}`;
        return leadHistory.get(key)!;
      });

      const recurrentLeads = leadsWithHistory.filter(l => l.isRecurrent).length;
      const newLeads = leadsWithHistory.filter(l => !l.isRecurrent).length;

      return {
        eventName,
        totalLeads: leads.length,
        positiveLeads: leads.filter(l => l.status === 'positive').length,
        negativeLeads: leads.filter(l => l.status === 'negative').length,
        recurrentLeads,
        newLeads,
        leads: leadsWithHistory
      };
    });
  };

  const getRecurrentLeads = (): LeadWithHistory[] => {
    const leadHistory = getLeadHistory();
    return Array.from(leadHistory.values()).filter(l => l.isRecurrent);
  };

  const getRecommendedApproach = (leadHistory: LeadWithHistory): string => {
    const { lead, eventCount, events } = leadHistory;

    if (eventCount === 1) {
      return lead.status === 'positive' 
        ? 'Lead novo com resposta positiva - priorizar agendamento de reunião'
        : 'Lead novo - primeira abordagem padrão';
    }

    if (eventCount === 2) {
      const hasPositive = lead.status === 'positive';
      return hasPositive
        ? 'Lead recorrente com interesse - referenciar evento anterior e propor reunião'
        : 'Lead recorrente sem conversão anterior - ajustar abordagem e destacar novidades';
    }

    if (eventCount >= 3) {
      return lead.status === 'positive'
        ? `Lead muito engajado (${eventCount} eventos) - tratamento VIP, reunião prioritária`
        : `Lead presente em ${eventCount} eventos mas sem conversão - considerar abordagem diferenciada ou qualificação`;
    }

    return 'Avaliar histórico detalhado';
  };

  return {
    getLeadHistory,
    getEventLeadsAnalysis,
    getRecurrentLeads,
    getRecommendedApproach
  };
}
