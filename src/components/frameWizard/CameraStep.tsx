import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Search, Videocam, Info } from '@mui/icons-material';
import { useFrameWizardStore } from '../../stores/frameWizardStore';

export function CameraStep() {
  const { wizardState, updateWizardState, cameras, computeNyquist } = useFrameWizardStore();
  const [search, setSearch] = useState('');
  const [mfgFilter, setMfgFilter] = useState<string>('all');

  const manufacturers = [...new Set(cameras.map((c) => c.manufacturer))];

  const filtered = cameras.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.manufacturer.toLowerCase().includes(search.toLowerCase());
    const matchMfg = mfgFilter === 'all' || c.manufacturer === mfgFilter;
    return matchSearch && matchMfg;
  });

  const nyquist = computeNyquist();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Videocam color="primary" />
        <Typography variant="h5" fontWeight="bold">
          Select Camera
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose the main imaging camera. The Nyquist sampling indicator helps ensure your pixel size matches the optical resolution.
      </Typography>

      {/* Nyquist indicator */}
      {nyquist && (
        <Alert severity={nyquist.isSampled ? 'success' : 'warning'} sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            Nyquist Sampling: {nyquist.isSampled ? 'Satisfied ✓' : 'Undersampled ✗'}
          </Typography>
          <Typography variant="caption">
            Optical resolution: {nyquist.resolution_um.toFixed(2)} µm |
            Nyquist pixel: {nyquist.nyquistPixelSize_um.toFixed(2)} µm |
            Effective pixel: {nyquist.effectivePixelSize_um.toFixed(2)} µm |
            Ratio: {nyquist.samplingRatio.toFixed(2)}×
          </Typography>
        </Alert>
      )}

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <TextField
          size="small"
          placeholder="Search cameras..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> } }}
          sx={{ width: 280 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Manufacturer</InputLabel>
          <Select
            value={mfgFilter}
            label="Manufacturer"
            onChange={(e) => setMfgFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            {manufacturers.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Camera Table */}
      <TableContainer component={Paper} sx={{ maxHeight: 380 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              <TableCell>Name</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Resolution</TableCell>
              <TableCell align="right">Pixel (µm)</TableCell>
              <TableCell align="right">FPS</TableCell>
              <TableCell>Interface</TableCell>
              <TableCell>Mount</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((cam) => (
              <TableRow
                key={cam.id}
                hover
                sx={{
                  bgcolor: wizardState.selectedCamera === cam.id ? 'primary.50' : undefined,
                }}
              >
                <TableCell padding="checkbox">
                  <Radio
                    size="small"
                    checked={wizardState.selectedCamera === cam.id}
                    onChange={() => updateWizardState({ selectedCamera: cam.id })}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {cam.name}
                  </Typography>
                </TableCell>
                <TableCell>{cam.manufacturer}</TableCell>
                <TableCell>{cam.resolution}</TableCell>
                <TableCell align="right">{cam.pixelSize_um}</TableCell>
                <TableCell align="right">{cam.fps_max}</TableCell>
                <TableCell>
                  <Chip label={cam.interface} size="small" variant="outlined" />
                </TableCell>
                <TableCell>{cam.mountType}</TableCell>
                <TableCell align="right">${cam.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Selected camera detail card */}
      {(() => {
        const sel = cameras.find((c) => c.id === wizardState.selectedCamera);
        if (!sel) return null;
        return (
          <Paper variant="outlined" sx={{ mt: 2, p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
            {sel.thumbnail && (
              <Box sx={{ flexShrink: 0, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={sel.thumbnail.startsWith('/') ? `/configurator${sel.thumbnail}` : sel.thumbnail}
                  alt={sel.name}
                  style={{ maxWidth: 70, maxHeight: 70 }}
                />
              </Box>
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">{sel.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {sel.manufacturer} &middot; {sel.resolution} &middot; {sel.pixelSize_um}µm &middot; {sel.fps_max}fps &middot; {sel.interface} &middot; {sel.mountType}
              </Typography>
              <Typography variant="subtitle2" color="primary" sx={{ mt: 0.5 }}>
                ${sel.price.toLocaleString()}
              </Typography>
            </Box>
            {sel.docsUrl && (
              <Tooltip title="View full documentation">
                <IconButton onClick={() => window.open(sel.docsUrl, '_blank', 'noopener')}>
                  <Info />
                </IconButton>
              </Tooltip>
            )}
          </Paper>
        );
      })()}
    </Box>
  );
}
