import type { JSX } from 'react';
import * as React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
} from '@mui/material';

import { TextEditor } from '../../../core/text-editor-report-form/text-editor';
import { Uploader } from '../uploader';
import { useFormHook } from './form-hooks';
import type {
  Report,
  ReportItem,
} from './form.interface';

interface ReportFormProps {
  report: Report;
  setReport: React.Dispatch<React.SetStateAction<Report>>;
}

export function GeneralForm({ report, setReport }: ReportFormProps): JSX.Element {
  const [uploadList, setUploadList] = React.useState({ images: [] });

  const [key, setKey] = React.useState(0);

  const { handleFieldChange } = useFormHook({ report, setReport });

  const handlerItemChange = (index: number, field: string, content: string): void => {
    setKey(index);
    if (!report.items) {
      return;
    }
    const item = report.items[index];
    item[field] = content;
    report.items[index] = item;
    handleFieldChange('items', report.items);
  }

  const handleDeleteItem = (description: string): void => {
    if (!report.items || report.items.length === 1) {
      return;
    }
    const newItems = report.items.filter((item) => item.description !== description);
    handleFieldChange('items', newItems);
  }

  React.useEffect(() => {
    if (!report.items) {
      return;
    }

    if (uploadList.images.length === 0) {
      return;
    }

    const item = report.items[key];
    item.images = Array.from(uploadList.images, (img: any) => ({ url: img.preview, isDeleted: false }));

    handleFieldChange('items', report.items);
  }, [uploadList, handleFieldChange, report.items, key]);


  return (
    <>
      {report.items?.map((item: ReportItem, index: number) => (
        <>
          <FormControl>
            <InputLabel htmlFor="description-editor" shrink>
              Job Description <span style={{ fontWeight: 'lighter' }}>(required)</span>
            </InputLabel>
            <Box sx={{ mt: '8px', '& .tiptap-container': { minHeight: '8rem' } }}>
              <TextEditor
                content={item.description || ''}
                onUpdate={(content) => {
                  handlerItemChange(index, "description", content as unknown as string)
                }}
                placeholder="Fridge Broken - Microwave not working - Oven not heating"
              />
            </Box>
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="description-editor" shrink>
              Cost Code <span style={{ fontWeight: 'lighter' }}>(required)</span>
            </InputLabel>
            <Box sx={{ mt: '8px', '& .tiptap-container': { minHeight: '8rem' } }}>
              <TextEditor
                content={item.costCode || ''}
                onUpdate={(content) => {
                  handlerItemChange(index, 'costCode', content as unknown as string);
                }}
                placeholder="C100 - C203 - C880"
              />
            </Box>
          </FormControl>
          <Uploader report={report?.items?.[index]} setReport={setUploadList} />
          <FormControl>
            <IconButton disabled={!report.items || report.items.length === 1} onClick={() => handleDeleteItem(item.description)} aria-label="delete" size="large">
              <DeleteIcon fontSize="inherit" />
            </IconButton>

          </FormControl>
        </>
      )
      )}
    </>
  );
}
