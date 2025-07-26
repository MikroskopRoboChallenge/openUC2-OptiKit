import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  RotateRight as RotateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useAppStore } from '../stores/appStore';

export const PropertyPanel: React.FC = () => {
  const { 
    selectedItemId, 
    selectedItemType, 
    placedModules, 
    annotations, 
    modules,
    removeModule,
    removeAnnotation,
    rotateModule,
    updateModuleCustomText,
    exportData
  } = useAppStore();

  const [isEditingText, setIsEditingText] = useState(false);
  const [editText, setEditText] = useState('');
  const [metadataDialogOpen, setMetadataDialogOpen] = useState(false);
  const [metadataForm, setMetadataForm] = useState({
    name: '',
    category: 'General',
    description: '',
    screenshot: ''
  });

  const categories = ['General', 'Microscopy', 'Astronomy', 'Spectroscopy', 'Imaging', 'Laser'];

  const handleOpenMetadataDialog = () => {
    setMetadataForm({
      name: '',
      category: 'General',
      description: '',
      screenshot: ''
    });
    setMetadataDialogOpen(true);
  };

  const handleCloseMetadataDialog = () => {
    setMetadataDialogOpen(false);
  };

  const handleSaveMetadata = async () => {
    // Get current setup data
    const currentSetup = await exportData();
    
    // Create setup with metadata
    const setupWithMetadata = {
      ...JSON.parse(currentSetup),
      name: metadataForm.name,
      category: metadataForm.category,
      description: metadataForm.description,
      screenshot: metadataForm.screenshot
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(setupWithMetadata, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadataForm.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    handleCloseMetadataDialog();
  };

  if (!selectedItemId || !selectedItemType) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <SettingsIcon />
          Properties
        </Typography>
        
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Setup Metadata
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add metadata to your current optical setup for easy sharing and organization.
            </Typography>
            
            <Button 
              variant="contained" 
              startIcon={<DownloadIcon />}
              onClick={handleOpenMetadataDialog}
              fullWidth
              size="small"
            >
              Export Setup with Metadata
            </Button>
          </CardContent>
        </Card>
        
        <Paper 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'grey.50'
          }}
        >
          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center' }}>
            Select a component to view and edit its properties
          </Typography>
        </Paper>
      </Box>
    );
  }

  const renderModuleProperties = () => {
    const module = placedModules.find(m => m.id === selectedItemId);
    if (!module) return null;

    const moduleDefinition = modules.find(m => m.id === module.moduleId);
    if (!moduleDefinition) return null;

    const handleRotate = () => {
      const newRotation = (module.rotation + 90) % 360;
      rotateModule(module.id, newRotation);
    };

    const handleEditText = () => {
      setEditText(module.customText || moduleDefinition.defaultParams?.customText as string || '');
      setIsEditingText(true);
    };

    const handleSaveText = () => {
      updateModuleCustomText(module.id, editText);
      setIsEditingText(false);
    };

    const handleCancelEdit = () => {
      setIsEditingText(false);
      setEditText('');
    };

    const isWildCard = moduleDefinition.defaultParams?.isWildCard === true;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Module Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">Name</Typography>
                <Typography variant="body2">{moduleDefinition.name}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">Position</Typography>
                <Typography variant="body2">({module.position.x}, {module.position.y})</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">Rotation</Typography>
                <Typography variant="body2">{module.rotation}°</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">Layer</Typography>
                <Typography variant="body2">{module.layer}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">Footprint</Typography>
                <Typography variant="body2">
                  {module.rotation === 90 || module.rotation === 270 ? 
                    `${moduleDefinition.footprint.height} × ${moduleDefinition.footprint.width}` : 
                    `${moduleDefinition.footprint.width} × ${moduleDefinition.footprint.height}`}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {isWildCard && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Wild Card Text
              </Typography>
              {isEditingText ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    multiline
                    rows={3}
                    fullWidth
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Enter custom text..."
                    variant="outlined"
                    size="small"
                  />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={handleSaveText}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2, fontStyle: module.customText ? 'normal' : 'italic' }}>
                    {module.customText || 'No custom text set'}
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={handleEditText}
                  >
                    {module.customText ? 'Edit Text' : 'Add Text'}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined"
                startIcon={<RotateIcon />}
                onClick={handleRotate}
                size="small"
              >
                Rotate 90°
              </Button>
              <Button 
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => removeModule(module.id)}
                size="small"
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>

        {module.params && Object.keys(module.params).length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Parameters
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Object.entries(module.params).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="textSecondary">{key}</Typography>
                    <Chip label={String(value)} size="small" variant="outlined" />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };

  const renderAnnotationProperties = () => {
    const annotation = annotations.find(a => a.id === selectedItemId);
    if (!annotation) return null;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Annotation Info
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">Type</Typography>
                <Typography variant="body2">{annotation.type}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="textSecondary">Layer</Typography>
                <Typography variant="body2">{annotation.layer}</Typography>
              </Box>
              {annotation.text && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="textSecondary">Text</Typography>
                  <Typography variant="body2">{annotation.text}</Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Button 
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => removeAnnotation(annotation.id)}
              size="small"
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <SettingsIcon />
        Properties
      </Typography>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {selectedItemType === 'module' && renderModuleProperties()}
        {selectedItemType === 'annotation' && renderAnnotationProperties()}
      </Box>

      {/* Metadata Entry Dialog */}
      <Dialog open={metadataDialogOpen} onClose={handleCloseMetadataDialog} maxWidth="md" fullWidth>
        <DialogTitle>Export Setup with Metadata</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create metadata for your current optical setup. This will export your setup with the specified information.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Setup Name"
              fullWidth
              variant="outlined"
              value={metadataForm.name}
              onChange={(e) => setMetadataForm({ ...metadataForm, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={metadataForm.category}
                label="Category"
                onChange={(e) => setMetadataForm({ ...metadataForm, category: e.target.value })}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              value={metadataForm.description}
              onChange={(e) => setMetadataForm({ ...metadataForm, description: e.target.value })}
              placeholder="Describe your optical setup, its purpose, and key features..."
            />
            <TextField
              margin="dense"
              label="Screenshot URL (optional)"
              fullWidth
              variant="outlined"
              value={metadataForm.screenshot}
              onChange={(e) => setMetadataForm({ ...metadataForm, screenshot: e.target.value })}
              placeholder="https://example.com/screenshot.png"
              helperText="Provide a URL to an image showing your setup"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMetadataDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveMetadata} 
            variant="contained"
            disabled={!metadataForm.name.trim()}
          >
            Export Setup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};