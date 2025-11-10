import { ParsedFile } from '@/utils/dataProcessing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface MergePreviewProps {
  mergedData: Record<string, any>[];
  originalRowCount: number;
}

export function MergePreview({ mergedData, originalRowCount }: MergePreviewProps) {
  const previewRows = mergedData.slice(0, 10);
  const headers = mergedData.length > 0 ? Object.keys(mergedData[0]) : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Preview do Resultado</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              Original: {originalRowCount} linhas
            </Badge>
            <Badge variant="default">
              Resultado: {mergedData.length} linhas
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Mostrando {previewRows.length} de {mergedData.length} linhas
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-table-header">
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="border border-border px-4 py-2 text-left font-semibold text-foreground whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={rowIndex % 2 === 0 ? 'bg-table-row-even' : 'bg-table-row-odd'}
                  >
                    {headers.map((header, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="border border-border px-4 py-2 text-foreground whitespace-nowrap"
                      >
                        {row[header] !== null && row[header] !== undefined
                          ? String(row[header])
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
