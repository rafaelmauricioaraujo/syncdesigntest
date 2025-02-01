import * as React from 'react';

import { ReportForm } from '@/components/dashboard/single-appointment/forms/report-form';
import {
  Dialog,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import type { Report } from '../components/dashboard/single-appointment/forms/form.interface';

const createNewItem = (): { description: string; costCode: string; images: string[] } => ({
  description: '',
  costCode: '',
  images: [],
});

export function Page(): React.JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [report, setReport] = React.useState<Report>({
    createdAt: new Date(),
    title: '',
    description: '',
    images: [],
    type: '',
    parts: '',
    links: [],
    user: 'userId',
    items: [createNewItem()],
    approvalNeeded: null,
  });
  const [isDialogErrorVisible, setIsDialogErrorVisible] = React.useState<boolean>(false);


  const addNewItem = (): void => {
    setReport((prev) => ({ ...prev, items: [...prev.items ?? [], createNewItem()] }));
  }

  React.useEffect(() => {
    console.log('Report:', report);
  }, [report]);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    // NOTE TO CANDIDATE:
    // This is where you would send the report to the database, implement logic
    try {
      setLoading(true);
      console.log('Report submitted:', report);
    } catch (error) {
      setIsDialogErrorVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '100%', maxWidth: '600px' }}>
        <h1 style={{ textAlign: 'center' }}>Create New Report</h1>
        <ReportForm
          addNewItem={addNewItem}
          formType="Other"
          loading={loading}
          report={report}
          sendReportToDatabase={(e: React.FormEvent) => { handleSubmit(e) }}
          setReport={setReport}
        />
      </div>
      <Dialog onClose={() => { setIsDialogErrorVisible(false) }} open={isDialogErrorVisible}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Error submitting report. Please try again.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
