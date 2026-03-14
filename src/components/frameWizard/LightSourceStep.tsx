import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Tooltip,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import { Info, Lightbulb } from '@mui/icons-material';
import { useFrameWizardStore } from '../../stores/frameWizardStore';
import type { LightSourceChoice } from '../../types/frameWizard';

const LIGHT_OPTIONS: {
  value: LightSourceChoice;
  label: string;
  icon: string;
  photo: string;
  description: string;
  detailText: string;
  docsUrl: string;
  price: number;
}[] = [
  {
    value: 'single-led',
    label: 'Single White LED',
    icon: '/configurator/icons/uc2-singleled.svg',
    photo: '/configurator/photos/single-led.svg',
    description:
      'Bright white LED for standard brightfield illumination. Simple, reliable, and cost-effective.',
    detailText:
      'The single white LED module provides even, high-intensity illumination for standard brightfield microscopy. It features adjustable brightness via PWM control through ImSwitch software. Power consumption: ~3W. Beam angle: 120°. Lifetime: >50,000h.',
    docsUrl: 'https://docs.openuc2.com/frame/led-single',
    price: 30,
  },
  {
    value: 'led-matrix',
    label: 'Programmable LED Matrix',
    icon: '/configurator/icons/uc2-ledmatrix.svg',
    photo: '/configurator/photos/led-matrix.svg',
    description:
      'NeoPixel 8×8 LED matrix for structured illumination, darkfield, DPC, and quantitative phase imaging.',
    detailText:
      'The 8×8 NeoPixel LED matrix unlocks advanced computational imaging: Differential Phase Contrast (DPC), darkfield, structured illumination, and Fourier Ptychography. Each LED is individually addressable (RGB). Controlled via I2C from the UC2e board. Compatible with ImSwitch matrix control plugin.',
    docsUrl: 'https://docs.openuc2.com/frame/led-matrix',
    price: 150,
  },
  {
    value: 'led-ring',
    label: 'LED Ring (Köhler)',
    icon: '/configurator/icons/uc2-ledring.svg',
    photo: '/configurator/photos/led-ring.svg',
    description:
      'LED ring with Köhler optics for uniform, high-quality illumination across the full field of view.',
    detailText:
      'The Köhler LED ring provides uniform, shadow-free illumination. The ring geometry combined with a condenser lens achieves Köhler illumination without manual alignment. Ideal for quantitative measurements and publication-quality imaging. Includes adjustable NA aperture.',
    docsUrl: 'https://docs.openuc2.com/frame/led-ring',
    price: 120,
  },
];

export function LightSourceStep() {
  const { wizardState, updateWizardState } = useFrameWizardStore();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Lightbulb color="primary" />
        <Typography variant="h5" fontWeight="bold">
          Choose a Light Source
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Select the transmitted-light illumination module for your FRAME microscope.
        Each option supports different imaging techniques.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {LIGHT_OPTIONS.map((opt) => (
          <Card
            key={opt.value}
            variant={wizardState.lightSource === opt.value ? 'elevation' : 'outlined'}
            sx={{
              width: 220,
              border: wizardState.lightSource === opt.value ? '2px solid' : undefined,
              borderColor: 'primary.main',
              opacity: wizardState.lightSource === opt.value ? 1 : 0.8,
              transition: 'all 0.2s',
            }}
          >
            <CardActionArea
              onClick={() => updateWizardState({ lightSource: opt.value })}
              sx={{ p: 2 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mb: 1,
                  height: 80,
                  alignItems: 'center',
                }}
              >
                <img
                  src={opt.icon}
                  alt={opt.label}
                  style={{ maxHeight: 70, maxWidth: 70 }}
                />
              </Box>
              <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                <Typography variant="subtitle1" fontWeight="bold" textAlign="center">
                  {opt.label}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ mt: 0.5, fontSize: '0.75rem' }}
                >
                  {opt.description}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  textAlign="center"
                  sx={{ mt: 1 }}
                >
                  ${opt.price}
                </Typography>
              </CardContent>
            </CardActionArea>
            <Box sx={{ textAlign: 'right', pr: 1, pb: 0.5 }}>
              <Tooltip title="View documentation">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(opt.docsUrl, '_blank', 'noopener');
                  }}
                >
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Card>
        ))}
      </Box>

      {/* None option */}
      <Box sx={{ mt: 2 }}>
        <Card
          variant={wizardState.lightSource === 'none' ? 'elevation' : 'outlined'}
          sx={{
            border: wizardState.lightSource === 'none' ? '2px solid' : undefined,
            borderColor: 'text.secondary',
            cursor: 'pointer',
          }}
        >
          <CardActionArea
            onClick={() => updateWizardState({ lightSource: 'none' })}
            sx={{ p: 1.5 }}
          >
            <Typography variant="body2" textAlign="center" color="text.secondary">
              No light source (I'll add my own later)
            </Typography>
          </CardActionArea>
        </Card>
      </Box>

      {/* Selected module detail panel */}
      {(() => {
        const sel = LIGHT_OPTIONS.find((o) => o.value === wizardState.lightSource);
        if (!sel) return null;
        return (
          <Paper variant="outlined" sx={{ mt: 3, p: 2.5, display: 'flex', gap: 3, alignItems: 'flex-start' }}>
            <Box sx={{ flexShrink: 0, width: 160, height: 120, borderRadius: 1, overflow: 'hidden', bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={sel.photo} alt={sel.label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold">{sel.label}</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {sel.detailText}
              </Typography>
              <Typography variant="subtitle1" color="primary" fontWeight="bold">
                ${sel.price.toLocaleString()}
              </Typography>
            </Box>
          </Paper>
        );
      })()}
    </Box>
  );
}
