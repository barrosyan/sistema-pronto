import { useState } from 'react';
import { ParsedFile, MergeType, performLeftJoin } from '@/utils/dataProcessing';
import { FileUpload } from '@/components/FileUpload';
import { DataPreview } from '@/components/DataPreview';
import { MergeConfiguration } from '@/components/MergeConfiguration';
import { MergePreview } from '@/components/MergePreview';
import { ExportOptions } from '@/components/ExportOptions';
import { Button } from '@/components/ui/button';
import { Merge, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type Step = 'upload' | 'configure' | 'preview' | 'export';

const Index = () => {
  const [step, setStep] = useState<Step>('upload');
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [mainFileIndex, setMainFileIndex] = useState(0);
  const [mergeType, setMergeType] = useState<MergeType>('lead-name');
  const [mergedData, setMergedData] = useState<Record<string, any>[]>([]);

  const handleFilesProcessed = (processedFiles: ParsedFile[]) => {
    setFiles(processedFiles);
    if (processedFiles.length >= 2) {
      setStep('configure');
    }
  };

  const handlePreviewMerge = () => {
    if (files.length < 2) {
      toast.error('É necessário pelo menos 2 arquivos para realizar o merge');
      return;
    }

    const mainFile = files[mainFileIndex];
    const secondaryFiles = files.filter((_, index) => index !== mainFileIndex);
    
    try {
      const result = performLeftJoin(mainFile, secondaryFiles, mergeType);
      setMergedData(result);
      setStep('preview');
      toast.success('Preview do merge gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar preview do merge');
      console.error(error);
    }
  };

  const handleConfirmMerge = () => {
    setStep('export');
    toast.success('Merge confirmado! Pronto para download.');
  };

  const handleReset = () => {
    setStep('upload');
    setFiles([]);
    setMergedData([]);
    setMainFileIndex(0);
    setMergeType('lead-name');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Data Merge Pro
          </h1>
          <p className="text-muted-foreground">
            Unifique seus dados de leads e empresas com inteligência
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between max-w-2xl mx-auto">
          {['Upload', 'Configurar', 'Preview', 'Exportar'].map((label, index) => {
            const stepNames: Step[] = ['upload', 'configure', 'preview', 'export'];
            const currentIndex = stepNames.indexOf(step);
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;

            return (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-muted-foreground">{label}</span>
                </div>
                {index < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded transition-colors ${
                      isCompleted ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {step === 'upload' && (
            <FileUpload onFilesProcessed={handleFilesProcessed} />
          )}

          {step === 'configure' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MergeConfiguration
                  files={files}
                  mainFileIndex={mainFileIndex}
                  mergeType={mergeType}
                  onMainFileChange={setMainFileIndex}
                  onMergeTypeChange={setMergeType}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">
                  Preview dos Arquivos
                </h2>
                {files.map((file, index) => (
                  <DataPreview key={index} file={file} />
                ))}
              </div>

              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setStep('upload')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={handlePreviewMerge} size="lg">
                  <Merge className="mr-2 h-5 w-5" />
                  Gerar Preview do Merge
                </Button>
              </div>
            </>
          )}

          {step === 'preview' && (
            <>
              <MergePreview
                mergedData={mergedData}
                originalRowCount={files[mainFileIndex]?.rowCount || 0}
              />

              <div className="flex gap-4 justify-end">
                <Button variant="outline" onClick={() => setStep('configure')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Ajustar Configuração
                </Button>
                <Button onClick={handleConfirmMerge} size="lg">
                  Confirmar Merge
                </Button>
              </div>
            </>
          )}

          {step === 'export' && (
            <>
              <MergePreview
                mergedData={mergedData}
                originalRowCount={files[mainFileIndex]?.rowCount || 0}
              />

              <ExportOptions data={mergedData} filename="merged-data" />

              <div className="flex justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Novo Merge
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
