import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ExportOptionsProps {
  data: Record<string, any>[];
  filename?: string;
}

export function ExportOptions({ data, filename = 'merged-data' }: ExportOptionsProps) {
  const exportToCSV = () => {
    try {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
      toast.success('CSV exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar CSV');
      console.error(error);
    }
  };

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados Merged');
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      toast.success('Excel exportado com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar Excel');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Resultado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={exportToCSV} className="flex-1" size="lg">
            <FileText className="mr-2 h-5 w-5" />
            Baixar CSV
          </Button>
          <Button onClick={exportToExcel} className="flex-1" size="lg">
            <FileSpreadsheet className="mr-2 h-5 w-5" />
            Baixar Excel
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4 text-center">
          {data.length} linhas prontas para download
        </p>
      </CardContent>
    </Card>
  );
}
