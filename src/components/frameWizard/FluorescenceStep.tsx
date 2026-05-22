import {
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Chip,
  Collapse,
  TextField,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Biotech } from '@mui/icons-material';
import { useFrameWizardStore } from '../../stores/frameWizardStore';
import type { FluoBundleOption } from '../../types/frameWizard';

// Static lookup: excitation wavelength (nm) → compatible dyes.
const DYE_DB: Record<number, string[]> = {
  405: ['DAPI', 'Hoechst 33342', 'BV421', 'CF405M'],
  470: ['EGFP', 'GFP', 'FITC', 'Alexa 488', 'CF488A'],
  488: ['EGFP', 'GFP', 'FITC', 'Alexa 488'],
  525: ['Cy3', 'TRITC', 'mCherry', 'mKO', 'Alexa 532'],
  532: ['Cy3', 'TRITC', 'mCherry', 'Alexa 532'],
  635: ['Cy5', 'Alexa 647', 'SiR-DNA', 'SiR-Actin'],
  638: ['Cy5', 'Alexa 647', 'SiR-DNA', 'SiR-Actin'],
  730: ['Cy7', 'IR800CW', 'Alexa 700', 'AF750'],
};

// Display order and labels for bundle categories.
const CATEGORY_ORDER: FluoBundleOption['category'][] = [
  'led-single',
  'led-quad',
  'laser-single',
  'laser-dual',
  'laser-quad',
  'custom',
];

const CATEGORY_LABELS: Record<FluoBundleOption['category'], string> = {
  'led-single': 'LED (single-channel)',
  'led-quad': 'LED (quad-channel)',
  'laser-single': 'Laser (single)',
  'laser-dual': 'Laser (dual)',
  'laser-quad': 'Laser (quad)',
  custom: 'Custom / BYO',
};

/** Collect all compatible dyes for a bundle (union across excitation wavelengths + CSV list). */
function getCompatibleDyes(bundle: FluoBundleOption): string[] {
  const dyes = new Set<string>();
  bundle.excitationWavelengths_nm.forEach((wl) => {
    (DYE_DB[wl] ?? []).forEach((d) => dyes.add(d));
  });
  if (bundle.compatibleDyes) {
    bundle.compatibleDyes
      .split('|')
      .map((d) => d.trim())
      .filter(Boolean)
      .forEach((d) => dyes.add(d));
  }
  return Array.from(dyes);
}

export function FluorescenceStep() {
  const { wizardState, updateWizardState, fluoBundles } = useFrameWizardStore();

  const selectedBundle = fluoBundles.find((b) => b.id === wizardState.fluoBundle) ?? null;

  // Group bundles by category in display order.
  const grouped = CATEGORY_ORDER.reduce<Record<string, FluoBundleOption[]>>(
    (acc, cat) => {
      acc[cat] = fluoBundles.filter((b) => b.category === cat);
      return acc;
    },
    {} as Record<string, FluoBundleOption[]>,
  );

  const handleBundleClick = (bundleId: string) => {
    // Toggle off if already selected.
    updateWizardState({ fluoBundle: wizardState.fluoBundle === bundleId ? '' : bundleId });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Biotech color="primary" />
        <Typography variant="h6">Fluorescence</Typography>
      </Box>

      {/* Enable / disable toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={wizardState.hasFluorescence}
            onChange={(e) => updateWizardState({ hasFluorescence: e.target.checked })}
          />
        }
        label="Enable fluorescence imaging"
      />

      <Collapse in={wizardState.hasFluorescence}>
        <Box sx={{ mt: 2 }}>
          {/* Bundle selection grouped by category */}
          {CATEGORY_ORDER.map((cat) => {
            const bundles = grouped[cat];
            if (!bundles || bundles.length === 0) return null;
            return (
              <Box key={cat} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  {CATEGORY_LABELS[cat]}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {bundles.map((bundle) => {
                    const isSelected = wizardState.fluoBundle === bundle.id;
                    return (
                      <Card
                        key={bundle.id}
                        sx={{
                          width: 210,
                          border: isSelected ? '2px solid' : '1px solid',
                          borderColor: isSelected ? 'primary.main' : 'divider',
                          transition: 'border-color 0.15s',
                        }}
                        elevation={isSelected ? 4 : 1}
                      >
                        <CardActionArea onClick={() => handleBundleClick(bundle.id)}>
                          <CardContent sx={{ p: 1.5 }}>
                            {/* Channel color dots */}
                            <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                              {bundle.channelColors.map((color, i) => (
                                <Box
                                  key={i}
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    border: '1px solid rgba(0,0,0,0.2)',
                                  }}
                                />
                              ))}
                            </Box>

                            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
                              {bundle.name}
                            </Typography>

                            {bundle.manufacturer && (
                              <Typography variant="caption" color="text.secondary">
                                {bundle.manufacturer}
                              </Typography>
                            )}

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block', mt: 0.5, fontSize: '0.68rem' }}
                            >
                              {bundle.filterSetDescription}
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mt: 1,
                              }}
                            >
                              <Chip
                                label={bundle.price > 0 ? `$${bundle.price.toLocaleString()}` : 'Custom'}
                                size="small"
                                color={isSelected ? 'primary' : 'default'}
                                variant={isSelected ? 'filled' : 'outlined'}
                              />
                              {bundle.excitationWavelengths_nm.length > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  {bundle.excitationWavelengths_nm.map((w) => `${w}nm`).join(' / ')}
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            );
          })}

          {/* Detail panel for selected bundle */}
          {selectedBundle && (
            <Box sx={{ mt: 1, mb: 3 }}>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected: {selectedBundle.name}
              </Typography>

              {/* Filter specification table */}
              {selectedBundle.exFilters.length > 0 && (
                <Box sx={{ overflowX: 'auto', mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Channel</TableCell>
                        <TableCell>Excitation filter</TableCell>
                        <TableCell>Dichroic edge</TableCell>
                        <TableCell>Emission filter</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedBundle.exFilters.map((exF, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Box
                              component="span"
                              sx={{
                                display: 'inline-block',
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: selectedBundle.channelColors[i] ?? '#888',
                                mr: 0.5,
                                verticalAlign: 'middle',
                              }}
                            />
                            {selectedBundle.excitationWavelengths_nm[i] != null
                              ? `${selectedBundle.excitationWavelengths_nm[i]} nm`
                              : `Ch ${i + 1}`}
                          </TableCell>
                          <TableCell>{exF}</TableCell>
                          <TableCell>{selectedBundle.dichroicEdges[i] ?? '—'}</TableCell>
                          <TableCell>{selectedBundle.emFilters[i] ?? '—'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* Compatible dyes */}
              {(() => {
                const dyes = getCompatibleDyes(selectedBundle);
                if (dyes.length === 0) return null;
                return (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      Works best with:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {dyes.map((dye) => (
                        <Chip key={dye} label={dye} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                );
              })()}

              {/* Custom bundle alert */}
              {selectedBundle.id === 'bundle-custom' && (
                <Alert severity="info" sx={{ mb: 1 }}>
                  Describe your light source and filter requirements in the notes field below.
                </Alert>
              )}
            </Box>
          )}

          {/* Experiment / custom notes (always visible when fluorescence is enabled) */}
          <TextField
            label="Experiment or custom fluorescence notes"
            placeholder="Describe your experiment, target fluorophores, or custom requirements…"
            value={wizardState.fluoCustomNotes}
            onChange={(e) => updateWizardState({ fluoCustomNotes: e.target.value })}
            multiline
            rows={3}
            fullWidth
            variant="outlined"
          />
        </Box>
      </Collapse>
    </Box>
  );
}
