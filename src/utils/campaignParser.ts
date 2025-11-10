import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { CampaignMetrics, Lead } from '@/types/campaign';

export interface ParsedCampaignData {
  metrics: CampaignMetrics[];
  leads: Lead[];
}

export function parseCampaignFile(file: File): Promise<ParsedCampaignData> {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
      parseCsvFile(file)
        .then(resolve)
        .catch(reject);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      parseExcelFile(file)
        .then(resolve)
        .catch(reject);
    } else {
      reject(new Error('Formato de arquivo não suportado. Use CSV ou Excel.'));
    }
  });
}

function parseCsvFile(file: File): Promise<ParsedCampaignData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const data = processCampaignData(results.data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error),
    });
  });
}

function parseExcelFile(file: File): Promise<ParsedCampaignData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const objectData = rows.map(row => {
          const obj: Record<string, any> = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        const parsedData = processCampaignData(objectData);
        resolve(parsedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsBinaryString(file);
  });
}

function processCampaignData(data: any[]): ParsedCampaignData {
  const metrics: CampaignMetrics[] = [];
  const leads: Lead[] = [];
  
  // Detect if this is campaign metrics or leads data
  if (data.length > 0) {
    const firstRow = data[0];
    
    // Check for campaign metrics format
    if ('Campaign Name' in firstRow && 'Event Type' in firstRow) {
      data.forEach((row, index) => {
        const dailyData: Record<string, number> = {};
        
        Object.keys(row).forEach(key => {
          if (key.match(/^\d{4}-\d{2}-\d{2}$/)) {
            dailyData[key] = Number(row[key]) || 0;
          }
        });
        
        metrics.push({
          campaignName: row['Campaign Name'] || '',
          eventType: row['Event Type'] || '',
          profileName: row['Profile Name'] || '',
          totalCount: Number(row['Total Count']) || 0,
          dailyData,
        });
      });
    }
    
    // Check for leads format (positive or negative)
    if ('Campanha' in firstRow && 'LinkedIn' in firstRow) {
      const isPositive = 'Data Resposta Positiva' in firstRow;
      
      data.forEach((row, index) => {
        const lead: Lead = {
          id: `lead-${index}`,
          campaign: row['Campanha'] || '',
          linkedin: row['LinkedIn'] || '',
          name: row['Nome'] || '',
          position: row['Cargo'] || '',
          company: row['Empresa'] || '',
          status: isPositive ? 'positive' : 'negative',
        };
        
        if (isPositive) {
          lead.positiveResponseDate = row['Data Resposta Positiva'];
          lead.transferDate = row['Data Repasse'];
          lead.statusDetails = row['Status'];
          lead.comments = row['Comentários'];
          lead.followUp1Date = row['Data FU 1'];
          lead.followUp1Comments = row['Comentarios FU1'];
          lead.followUp2Date = row['Data FU 2'];
          lead.followUp2Comments = row['Comentarios FU2'];
          lead.followUp3Date = row['Data FU 3'];
          lead.followUp3Comments = row['Comentarios FU3'];
          lead.followUp4Date = row['Data FU 4'];
          lead.followUp4Comments = row['Comentarios FU4'];
          lead.observations = row['Observações'];
          lead.meetingScheduleDate = row['Data de agendamento da reunião'];
          lead.meetingDate = row['Data da Reunião'];
          lead.proposalDate = row['Data Proposta'];
          lead.proposalValue = row['Valor Proposta'] ? Number(row['Valor Proposta']) : undefined;
          lead.saleDate = row['Data Venda'];
          lead.saleValue = row['Valor Venda'] ? Number(row['Valor Venda']) : undefined;
          lead.profile = row['Perfil'];
          lead.classification = row['Classificação'];
          lead.attendedWebinar = row['Participou do Webnar'] === 'Sim';
          lead.whatsapp = row['WhatsApp'];
          lead.standDay = row['Dia do Stand'];
          lead.pavilion = row['Pavilhão'];
          lead.stand = row['Stand'];
        } else {
          lead.negativeResponseDate = row['Data Resposta Negativa'];
          lead.transferDate = row['Data Repasse'];
          lead.statusDetails = row['Status'];
          lead.observations = row['Observações'];
          lead.hadFollowUp = row['Teve FU? Porque?'] !== undefined && row['Teve FU? Porque?'] !== '';
          lead.followUpReason = row['Teve FU? Porque?'];
        }
        
        leads.push(lead);
      });
    }
  }
  
  return { metrics, leads };
}

export function groupMetricsByCampaign(metrics: CampaignMetrics[]): Map<string, CampaignMetrics[]> {
  const grouped = new Map<string, CampaignMetrics[]>();
  
  metrics.forEach(metric => {
    const key = metric.campaignName;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(metric);
  });
  
  return grouped;
}
