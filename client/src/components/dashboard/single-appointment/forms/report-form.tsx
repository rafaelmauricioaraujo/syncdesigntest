import type { JSX } from 'react';
import * as React from 'react';
import { useEffect } from 'react';

// import type { Issue, Report } from '@/interfaces/tables';
import {
  Box,
  Button,
  Stack,
} from '@mui/material';

import { useFormHook } from './form-hooks';
import type { Report } from './form.interface';
import { GeneralForm } from './general-form';

interface ReportFormProps {
  loading: boolean;
  report: Report; // Define a more specific type if possible
  setReport: React.Dispatch<React.SetStateAction<Report>>;
  sendReportToDatabase: (e: React.FormEvent) => void;
  formType: string;
  addNewItem: () => void;
  expandedItem: string | null;
}
// NOTE TO CANDIDATE
// report and setReport are the main props that are passed to the form

export function ReportForm({
  loading,
  report,
  setReport,
  sendReportToDatabase,
  formType,
  addNewItem,
  expandedItem,
}: ReportFormProps): JSX.Element {

  const { validateForm, handleFieldChange } = useFormHook({
    report,
    setReport,
  });

  useEffect(() => {
    handleFieldChange('type', formType);
  }, [formType, handleFieldChange]);

  useEffect(() => {
    validateForm();
  }, [report, validateForm]);

  return (
      <Box sx={{ sm: { padding: 0 }, md: { padding: 3 } }}>
        <Stack spacing={3}>

          {/* Directly render the appropriate form component */}
          <GeneralForm report={report} setReport={setReport} expandedItem={expandedItem} />

          {/* NOTE TO CANDIDATE */}
          {/* We are keen on implementing forms in a modular way. So they can be combined and imported form any part of the application*/}
          {/* Feel free to follow this structure to create your form. Creating new components or component to populate this from passing down setReport */}

          {/* Example - RepairsForm that could be added */}
          {/* <RepairsForm  report={report} setReport={setReport} /> */}


        <Button
          disabled={loading} // Disable button if form is invalid or loading is true
          onClick={addNewItem}
          size="large"
          sx={{ width: '100%' }}
          variant="outlined"
        >
          Add new Item
        </Button>
        <Button
          disabled={loading} // Disable button if form is invalid or loading is true
          onClick={sendReportToDatabase}
          size="large"
          sx={{ width: '100%' }}
          variant="contained"
        >
          {loading ? 'Loading...' : 'Upload Report'}
        </Button>
        </Stack>
      </Box>

  );
}
