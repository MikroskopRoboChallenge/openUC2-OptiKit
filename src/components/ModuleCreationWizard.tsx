import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { ModuleSizeSelector } from './ModuleSizeSelector';
import { ModuleDrawingCanvas } from './ModuleDrawingCanvas';
import { ModuleMetadataForm, type ModuleMetadata } from './ModuleMetadataForm';

interface DrawingElement {
  id: string;
  type: 'freehand' | 'rectangle' | 'circle' | 'ellipse' | 'text';
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  text?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

interface ModuleCreationWizardProps {
  open: boolean;
  onClose: () => void;
  onModuleCreated?: (module: any) => void;
}

const steps = ['Module Size', 'Draw Design', 'Module Details', 'Review & Save'];

export const ModuleCreationWizard: React.FC<ModuleCreationWizardProps> = ({
  open,
  onClose,
  onModuleCreated
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [moduleSize, setModuleSize] = useState({ width: 1, height: 1 });
  const [drawingElements, setDrawingElements] = useState<DrawingElement[]>([]);
  const [metadata, setMetadata] = useState<ModuleMetadata>({
    name: '',
    group: 'custom',
    color: '#1e4670',
    description: '',
    price: undefined,
    notification: ''
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setModuleSize({ width: 1, height: 1 });
    setDrawingElements([]);
    setMetadata({
      name: '',
      group: 'custom',
      color: '#1e4670',
      description: '',
      price: undefined,
      notification: ''
    });
  };

  const canProceedToNext = () => {
    switch (activeStep) {
      case 0:
        return true; // Size is always valid
      case 1:
        return true; // Drawing is optional
      case 2:
        return metadata.name.trim() && metadata.description.trim();
      default:
        return true;
    }
  };

  const handleCreateModule = async () => {
    try {
      // Generate unique ID for the custom module
      const moduleId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create module data structure
      const customModule = {
        id: moduleId,
        name: metadata.name,
        group: metadata.group,
        color: metadata.color,
        width: moduleSize.width.toString(),
        height: moduleSize.height.toString(),
        thumbnail: '', // Could generate a thumbnail from the drawing
        cadUrl: '',
        description: metadata.description,
        defaultParams: '{}',
        price: metadata.price?.toString() || '',
        notification: metadata.notification || '',
        drawingElements, // Store the drawing data
        isCustom: true
      };

      // Save to localStorage for now (could be extended to save to server)
      const existingCustomModules = JSON.parse(localStorage.getItem('customModules') || '[]');
      existingCustomModules.push(customModule);
      localStorage.setItem('customModules', JSON.stringify(existingCustomModules));

      // Notify parent component
      if (onModuleCreated) {
        onModuleCreated(customModule);
      }

      // Reset wizard and close
      handleReset();
      onClose();

      alert('Custom module created successfully!');
    } catch (error) {
      console.error('Error creating custom module:', error);
      alert('Error creating custom module. Please try again.');
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <ModuleSizeSelector
            selectedSize={moduleSize}
            onSizeSelect={(width, height) => setModuleSize({ width, height })}
          />
        );
      case 1:
        return (
          <ModuleDrawingCanvas
            moduleSize={moduleSize}
            elements={drawingElements}
            onElementsChange={setDrawingElements}
          />
        );
      case 2:
        return (
          <ModuleMetadataForm
            metadata={metadata}
            onMetadataChange={setMetadata}
          />
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Custom Module
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Review your module details below. Once created, you can use this module in your designs.
            </Alert>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Typography><strong>Name:</strong> {metadata.name}</Typography>
              <Typography><strong>Size:</strong> {moduleSize.width} × {moduleSize.height}</Typography>
              <Typography><strong>Group:</strong> {metadata.group}</Typography>
              <Typography><strong>Description:</strong> {metadata.description}</Typography>
              <Typography><strong>Drawing Elements:</strong> {drawingElements.length} element(s)</Typography>
              {metadata.price && <Typography><strong>Price:</strong> €{metadata.price}</Typography>}
              {metadata.notification && (
                <Typography><strong>Note:</strong> {metadata.notification}</Typography>
              )}
            </Box>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle>Create Custom Module</DialogTitle>
      
      <DialogContent>
        <Box sx={{ width: '100%', mb: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Box sx={{ mt: 2, mb: 1 }}>
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleCreateModule : handleNext}
          disabled={!canProceedToNext()}
        >
          {activeStep === steps.length - 1 ? 'Create Module' : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};