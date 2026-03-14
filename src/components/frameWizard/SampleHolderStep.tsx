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
import { Info, ViewModule } from '@mui/icons-material';
import { useFrameWizardStore } from '../../stores/frameWizardStore';
import type { SampleHolderChoice } from '../../types/frameWizard';

const HOLDER_OPTIONS: {
  value: SampleHolderChoice;
  label: string;
  icon: string;
  photo: string;
  description: string;
  detailText: string;
  docsUrl: string;
  price: number;
}[] = [
  {
    value: '4-slide-insert',
    label: '4-Slide Insert',
    icon: '/configurator/icons/uc2-framewellplate4.svg',
    photo: '/configurator/photos/4-slide-insert.svg',
    description:
      'Holds up to 4 standard microscope slides (75×25mm). Compatible with motorized XY stage for scanning.',
    detailText:
      'The 4-slide insert is a 3D-printed holder that fits into the FRAME stage area. It accommodates up to 4 standard microscope slides (75×25mm) in a 2×2 grid arrangement. Compatible with the motorized XY stage for automated slide scanning. Spring-loaded clips hold slides securely during movement.',
    docsUrl: 'https://docs.openuc2.com/frame/4-slide-insert',
    price: 80,
  },
  {
    value: 'wellplate-insert',
    label: 'Wellplate Insert',
    icon: '/configurator/icons/uc2-framewellplate.svg',
    photo: '/configurator/photos/wellplate-insert.svg',
    description:
      'Standard SBS-format wellplate holder. Fits 6, 12, 24, 48, or 96-well plates for high-throughput screening.',
    detailText:
      'The wellplate insert accepts standard SBS-format microwell plates (6 to 96-well). Precise positioning ensures alignment with motorized XY scanning patterns. Features alignment pins and spring retention for vibration-free imaging. Ideal for drug screening, cell culture assays, and high-content analysis.',
    docsUrl: 'https://docs.openuc2.com/frame/wellplate-insert',
    price: 100,
  },
];

export function SampleHolderStep() {
  const { wizardState, updateWizardState } = useFrameWizardStore();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <ViewModule color="primary" />
        <Typography variant="h5" fontWeight="bold">
          Sample Holder
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose which type of sample stage insert you need for your experiments.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {HOLDER_OPTIONS.map((opt) => (
          <Card
            key={opt.value}
            variant={wizardState.sampleHolder === opt.value ? 'elevation' : 'outlined'}
            sx={{
              width: 260,
              border: wizardState.sampleHolder === opt.value ? '2px solid' : undefined,
              borderColor: 'primary.main',
              transition: 'all 0.2s',
            }}
          >
            <CardActionArea
              onClick={() => updateWizardState({ sampleHolder: opt.value })}
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
                <img src={opt.icon} alt={opt.label} style={{ maxHeight: 70, maxWidth: 70 }} />
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
                <Typography variant="subtitle2" color="primary" textAlign="center" sx={{ mt: 1 }}>
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

      <Box sx={{ mt: 2 }}>
        <Card
          variant={wizardState.sampleHolder === 'none' ? 'elevation' : 'outlined'}
          sx={{
            border: wizardState.sampleHolder === 'none' ? '2px solid' : undefined,
            borderColor: 'text.secondary',
            cursor: 'pointer',
          }}
        >
          <CardActionArea
            onClick={() => updateWizardState({ sampleHolder: 'none' })}
            sx={{ p: 1.5 }}
          >
            <Typography variant="body2" textAlign="center" color="text.secondary">
              No sample holder (I'll use my own)
            </Typography>
          </CardActionArea>
        </Card>
      </Box>

      {/* Selected module detail panel */}
      {(() => {
        const sel = HOLDER_OPTIONS.find((o) => o.value === wizardState.sampleHolder);
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
