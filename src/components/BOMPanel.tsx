import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Receipt as BOMIcon,
  Inventory as InventoryIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { useAppStore } from '../stores/appStore';
import type { ModuleDefinition } from '../types';

export const BOMPanel: React.FC = () => {
  const { placedModules, modules, removeModule, exportData } = useAppStore();
  const [buyDialogOpen, setBuyDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');

  // Calculate BOM from placed modules
  const bomItems = React.useMemo(() => {
    const bomMap = new Map<string, { module: ModuleDefinition; count: number; totalPrice: number; moduleIds: string[] }>();
    
    placedModules.forEach(placedModule => {
      const moduleDefinition = modules.find(m => m.id === placedModule.moduleId);
      if (moduleDefinition) {
        const key = moduleDefinition.id;
        const existing = bomMap.get(key);
        const price = moduleDefinition.price || 0;
        
        if (existing) {
          existing.count += 1;
          existing.totalPrice += price;
          existing.moduleIds.push(placedModule.id);
        } else {
          bomMap.set(key, {
            module: moduleDefinition,
            count: 1,
            totalPrice: price,
            moduleIds: [placedModule.id]
          });
        }
      }
    });
    
    return Array.from(bomMap.values()).sort((a, b) => a.module.name.localeCompare(b.module.name));
  }, [placedModules, modules]);

  const totalCost = bomItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleDeleteModule = (moduleIds: string[], moduleName: string) => {
    if (confirm(`Delete all ${moduleName} modules from the layout?`)) {
      moduleIds.forEach(moduleId => removeModule(moduleId));
    }
  };

  const handleBuyConfiguration = async () => {
    try {
      // Get current setup data
      const setupData = await exportData();
      
      // Create issue title and body
      const issueTitle = `Purchase Request: Custom UC2 Configuration`;
      const issueBody = `Hi @beniroquai,

I would like to purchase the following UC2 configuration:

**Setup Details:**
- Total components: ${bomItems.reduce((sum, item) => sum + item.count, 0)}
- Unique modules: ${bomItems.length}
- Estimated cost: $${totalCost.toFixed(2)}

**Bill of Materials:**
${bomItems.map(item => `- ${item.module.name} (${item.count}x) - $${item.totalPrice.toFixed(2)}`).join('\n')}

**Configuration Data:**
\`\`\`json
${setupData}
\`\`\`

Please let me know about availability, final pricing, and shipping details.

Best regards`;

      // Create GitHub issue URL
      const githubUrl = 'https://github.com/openUC2/openUC2-OptiKit/issues/new';
      const params = new URLSearchParams({
        title: issueTitle,
        body: issueBody,
        labels: 'purchase-request'
      });
      
      // Open GitHub issue creation page in new tab
      window.open(`${githubUrl}?${params.toString()}`, '_blank');
      
      setBuyDialogOpen(false);
      setSnackbarMessage('GitHub issue page opened. We will get back to you as soon as possible!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error creating purchase request:', error);
      setSnackbarMessage('Failed to create purchase request. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSendToMail = async () => {
    try {
      // Create email subject and body
      const subject = 'UC2 Configuration - Bill of Materials';
      const body = `Dear colleague,

I'm sharing my UC2 optical configuration with you:

Setup Summary:
- Total components: ${bomItems.reduce((sum, item) => sum + item.count, 0)}
- Unique modules: ${bomItems.length}
- Estimated cost: $${totalCost.toFixed(2)}

Bill of Materials:
${bomItems.map(item => `${item.module.name} (${item.count}x) - $${item.totalPrice.toFixed(2)}`).join('\n')}

You can create this configuration using the UC2 OptiKit configurator at:
https://openuc2.github.io/openUC2-OptiKit/configurator

Best regards`;

      // Create mailto link
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      setSnackbarMessage('Email client opened with BOM details');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending email:', error);
      setSnackbarMessage('Failed to open email client. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <BOMIcon />
        Bill of Materials
      </Typography>
      
      {bomItems.length === 0 ? (
        <Paper 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'grey.50'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <InventoryIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="textSecondary">
              No modules placed yet
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
          {/* Summary */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h4" color="primary">
                    {bomItems.reduce((sum, item) => sum + item.count, 0)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Items
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="secondary">
                    {bomItems.length}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Unique Modules
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" color="success.main">
                    ${totalCost.toFixed(2)}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Cost
                  </Typography>
                </Box>
              </Box>
              
              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => setBuyDialogOpen(true)}
                  disabled={bomItems.length === 0}
                  fullWidth
                >
                  Buy Configuration
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<EmailIcon />}
                  onClick={handleSendToMail}
                  disabled={bomItems.length === 0}
                  fullWidth
                >
                  Send to Mail
                </Button>
              </Box>
              
              {/* Purchase Information */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  <strong>Purchase Information:</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  You can directly buy these components by sharing your setup via the shareable link 
                  or by saving your configuration and sharing it with <strong>sales@openuc2.com</strong>.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                  Note: Final prices may vary. You can get a customized quotation based on your drawings and requirements.
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
          {/* BOM Table */}
          <Paper sx={{ flex: 1, overflow: 'auto' }}>
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Module</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bomItems.map((item, index) => {
                    const unitPrice = item.module.price || 0;
                    return (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.module.name}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {item.module.id}
                            </Typography>
                            {item.module.autodeskInventor && (
                              <Chip 
                                label={item.module.autodeskInventor}
                                size="small"
                                variant="outlined"
                                sx={{ mt: 0.5, fontSize: '0.65rem', height: 18 }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={item.count} 
                            size="small" 
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            ${unitPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            ${item.totalPrice.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title={`Delete all ${item.module.name} modules`}>
                            <IconButton 
                              size="small"
                              color="error"
                              onClick={() => handleDeleteModule(item.moduleIds, item.module.name)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
      
      {/* Buy Configuration Dialog */}
      <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Buy This Configuration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will create a GitHub issue with your configuration details and tag our team (@beniroquai) for a purchase request.
            We will review your request and get back to you as soon as possible with availability, final pricing, and shipping information.
          </DialogContentText>
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Configuration Summary:</Typography>
            <Typography variant="body2">• Total items: {bomItems.reduce((sum, item) => sum + item.count, 0)}</Typography>
            <Typography variant="body2">• Unique modules: {bomItems.length}</Typography>
            <Typography variant="body2" color="primary">• Estimated cost: ${totalCost.toFixed(2)}</Typography>
          </Box>
          <DialogContentText>
            Note: Final pricing may vary based on current availability and shipping location.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleBuyConfiguration} variant="contained" color="primary">
            Create Purchase Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};