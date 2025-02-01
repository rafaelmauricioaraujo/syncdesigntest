import * as React from 'react';
import { Camera } from '@capacitor/camera';
import { IonButton, IonIcon, isPlatform } from '@ionic/react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CloudArrowUp as CloudArrowUpIcon } from '@phosphor-icons/react';
import { camera } from 'ionicons/icons';
import { FileWithPath, useDropzone } from 'react-dropzone';

export interface FileDropzoneProps extends DropzoneOptions {
  caption?: string;
  files?: File[];
  onRemove?: (file: File) => void;
  onRemoveAll?: () => void;
  onUpload?: () => void;
}


export function FileDropzone({ caption, ...props }: FileDropzoneProps): React.JSX.Element {
  const { getRootProps, getInputProps, isDragActive } = useDropzone(props);
  const [isMobile] = React.useState<boolean>(isPlatform('mobile'));
  const [isSimple] = React.useState(props.isSimple ? props.isSimple : false);

  const pickImagesFromGallery = async () => {
    try {
      const result = await Camera.pickImages({
        quality: 80,
        limit: 50,
        height: 1920,
        width: 1920,
        types: ['image', 'video'], // Allow both images and videos
      });

      const files = await Promise.all(
        result.photos.map(async (photo) => {
          // Fetch the image as a Blob
          const response = await fetch(photo.webPath);
          const blob = await response.blob();

          // Extract the original file name from the path
          const fileName = `${photo.webPath.split('/').pop()}.${blob.type.split('/')[1]}`;

          const file = new File([blob], fileName, { type: blob.type });

          return file as FileWithPath;
        })
      );

      props.onDrop?.(files);
    } catch (error) {
      console.error('Error picking images from gallery:', error);
    }
  };

  return (
    <Stack spacing={2}>
      {isMobile ? (
        <Box
          sx={{
            alignItems: 'center',
            border: '1px dashed var(--mui-palette-divider)',
            borderRadius: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            outline: 'none',
            p: 4,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Avatar
              sx={{
                '--Avatar-size': '60px',
                '--Icon-fontSize': 'var(--icon-fontSize-lg)',
                bgcolor: 'var(--mui-palette-background-paper)',
                boxShadow: 'var(--mui-shadows-8)',
                color: 'var(--mui-palette-text-primary)',
              }}
            >
              <CloudArrowUpIcon fontSize="var(--Icon-fontSize)" />
            </Avatar>
            <Stack spacing={1}>
              <IonButton
                {...getRootProps()}
                sx={{ textDecoration: 'underline', justifyContent: 'center', lineHeight: '1rem' }}
                variant="primary"
              >
                Click to upload media
                <input {...getInputProps()} />
              </IonButton>
              {isSimple ? null : (
                <>
                  {isPlatform('android') && (
                    <IonButton
                      onClick={pickImagesFromGallery}
                      sx={{ textDecoration: 'underline', justifyContent: 'center', lineHeight: '1rem' }}
                      variant="primary"
                    >
                      <IonIcon slot="start" icon={camera}></IonIcon>
                      Pick Images from Gallery
                    </IonButton>
                  )}
                </>
              )}
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Box
          sx={{
            alignItems: 'center',
            border: '1px dashed var(--mui-palette-divider)',
            borderRadius: 1,
            cursor: 'pointer',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            outline: 'none',
            p: 6,
            ...(isDragActive && { bgcolor: 'var(--mui-palette-action-selected)', opacity: 0.5 }),
            '&:hover': { ...(!isDragActive && { bgcolor: 'var(--mui-palette-action-hover)' }) },
          }}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar
              sx={{
                '--Avatar-size': '60px',
                '--Icon-fontSize': 'var(--icon-fontSize-lg)',
                bgcolor: 'var(--mui-palette-background-paper)',
                boxShadow: 'var(--mui-shadows-8)',
                color: 'var(--mui-palette-text-primary)',
              }}
            >
              <CloudArrowUpIcon fontSize="var(--Icon-fontSize)" />
            </Avatar>
            <Stack spacing={1}>
              <Typography variant="h6">
                <Typography component="span" sx={{ textDecoration: 'underline' }} variant="inherit">
                  Click to upload
                </Typography>{' '}
                or drag and drop
              </Typography>
              {caption ? (
                <Typography color="text.secondary" variant="body2">
                  {caption}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}
