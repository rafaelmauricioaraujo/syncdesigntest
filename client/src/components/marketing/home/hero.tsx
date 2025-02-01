import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useColorScheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { paths } from '@/paths';
import { RouterLink } from '@/components/core/link';

export function Hero(): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const [img, setImg] = React.useState<string>('/assets/home-hero-light.png');

  React.useEffect(() => {
    setImg(colorScheme === 'dark' ? '/assets/home-hero-dark.png' : '/assets/home-hero-light.png');
  }, [colorScheme]);
  const welcomeMessage = 'Sync Design Technologies Technical Test';
  const instructions =
    'Thank you for applying to Sync Design Technologies. In this assessment, you will be tasked with modifying the front-end according to the specified criteria and developing a comprehensive and scalable back-end to ensure its functionality.';
  return (
    <Box
      sx={{
        bgcolor: 'var(--mui-palette-neutral-950)',
        color: 'var(--mui-palette-common-white)',
        overflow: 'hidden',
        position: 'relative',
        height: '100vh',
        display: 'flex',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          margin: 'auto',
          height: '100%',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 0,
        }}
      >
        <Box component="img" src="/assets/home-cosmic.svg" sx={{ height: 'auto', width: '1600px' }} />
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        <Box component="img" src="/assets/home-rectangles.svg" sx={{ height: 'auto', width: '1900px' }} />
      </Box>
      <Container maxWidth="md" sx={{ display: 'flex', zIndex: 3, margin: 'auto' }}>
        <Stack sx={{ margin: 'auto' }} spacing={4}>
          <Stack spacing={2}>
            <Typography
              sx={{
                fontSize: '3.5rem',
                fontWeight: 600,
                lineHeight: 1.2,
                textAlign: 'center',
                '@media (max-width: 600px)': { fontSize: '2.3rem', paddingBottom: '2rem' },
              }}
            >
              {welcomeMessage}
            </Typography>
            <Typography sx={{ textAlign: 'center' }}>{instructions}</Typography>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <Button component={RouterLink} href={paths.newReport} size="large" variant="contained">
              Continue
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
