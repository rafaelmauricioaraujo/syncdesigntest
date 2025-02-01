import * as React from 'react';
import { getIssuesByIds } from '@/services/issues-dynamic';
import { Button } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { ReportPDFDocument } from './report-pdf-document';

export interface Metric {
  key: string;
  title: string;
  subtitle: string;
  value: number;
  navigate: boolean;
  ids: string[];
  params: Record<string, unknown>;
  issues?: unknown[]; // You may replace 'unknown[]' with the actual type you expect for issues
}

export interface ReportData {
  title: string;
  description: string;
  metrics: Metric[];
}

export interface DateRange {
  from: string;
  to: string;
}

export interface ReportPDFLinkProps {
  data: ReportData;
  dateRange: DateRange;
  type: string;
  children: React.ReactNode;
  isLoading: boolean;
  currentReport: string | null;
  setReport: (report: string) => void;
}

export function ReportPDFLink({
  type,
  data,
  dateRange,
  isLoading,
  currentReport,
  setReport,
}: ReportPDFLinkProps): JSX.Element {
  const [loadingState, setLoadingState] = React.useState<'idle' | 'loading' | 'loaded'>('idle');
  const [updatedData, setUpdatedData] = React.useState<ReportData | null>(null);
  const [tooLargeForDownload, setTooLargeForDownload] = React.useState(false);

  const handleDownload = async () => {
    // Reset state before starting a new download process
    setUpdatedData(null);
    setReport(data.title);
    setLoadingState('idle');

    if (loadingState !== 'idle') return;
    setLoadingState('loading');

    try {
      // Create a deep copy of data to avoid mutating props
      const dataCopy = { ...data, metrics: [...data.metrics] };
      
      const updatedMetrics = await Promise.all(
        dataCopy.metrics.map(async (metric) => {
          if (!metric.ids || metric.ids.length === 0) {
            return metric;
          }
          const { issues } = await getIssuesByIds(metric.ids, 'report');
          return { ...metric, issues };
        })
      );
      setUpdatedData({ ...dataCopy, metrics: updatedMetrics });
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading metrics:', error);
      setLoadingState('idle');
    }
  };

  // Reset to 'idle' state if data or parameters change, ensuring previous data is not retained
  React.useEffect(() => {
    const totalIssueCount = data.metrics.reduce((acc, metric) => acc + (typeof metric.value === 'number' ? metric.value : 0), 0);

    if (!tooLargeForDownload && totalIssueCount > 800) {
      setTooLargeForDownload(true);
    }
    if (currentReport === updatedData?.title) return;
    return () => {
      setUpdatedData(null);
      setLoadingState('idle');
    };
  }, [currentReport]);

  return (
    <>
      {!isLoading && data.metrics.length > 0 && (
        <>
          {loadingState === 'loaded' && updatedData ? (
            <PDFDownloadLink
              document={<ReportPDFDocument type={type} dateRange={dateRange} data={updatedData} />}
              fileName={`report-${data.title}-${new Date()
                .toISOString()
                .slice(2, 19)
                .replace(/[-:]/g, '')
                .replace('T', '_')}.pdf`}
            >
              {({ loading }) => (
                <Button color="success" disabled={loading}>
                  {loading ? `Generating Report ${data.title}` : `Download ${data.title}`}
                </Button>
              )}
            </PDFDownloadLink>
          ) : (
            <Button color="primary" onClick={handleDownload} disabled={loadingState === 'loading' || tooLargeForDownload}>
              {loadingState === 'loading' ? 'Loading Report...' : tooLargeForDownload ? "Dataset too large" :'Generate Report'}
            </Button>
          )}
        </>
      )}
    </>
  );
}
