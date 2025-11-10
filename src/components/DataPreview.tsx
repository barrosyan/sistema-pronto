import { ParsedFile } from '@/utils/dataProcessing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataPreviewProps {
  file: ParsedFile;
}

export function DataPreview({ file }: DataPreviewProps) {
  const previewRows = file.data.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{file.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Mostrando {previewRows.length} de {file.rowCount} linhas
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-table-header">
                  {file.headers.map((header, index) => (
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
                    {file.headers.map((header, cellIndex) => (
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
