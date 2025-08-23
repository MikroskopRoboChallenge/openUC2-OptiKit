import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  alpha,
} from '@mui/material';

interface ModuleSizeSelectorProps {
  selectedSize: { width: number; height: number };
  onSizeSelect: (width: number, height: number) => void;
}

const commonSizes = [
  { width: 1, height: 1, label: '1×1' },
  { width: 2, height: 1, label: '2×1' },
  { width: 1, height: 2, label: '1×2' },
  { width: 2, height: 2, label: '2×2' },
  { width: 3, height: 1, label: '3×1' },
  { width: 1, height: 3, label: '1×3' },
  { width: 3, height: 2, label: '3×2' },
  { width: 2, height: 3, label: '2×3' },
  { width: 3, height: 3, label: '3×3' },
  { width: 4, height: 1, label: '4×1' },
  { width: 1, height: 4, label: '1×4' },
  { width: 5, height: 2, label: '5×2' },
];

export const ModuleSizeSelector: React.FC<ModuleSizeSelectorProps> = ({
  selectedSize,
  onSizeSelect
}) => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Select Module Size
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose the footprint size for your custom module in grid units.
      </Typography>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
      }}>
        {commonSizes.map((size) => {
          const isSelected = selectedSize.width === size.width && selectedSize.height === size.height;
          
          return (
            <Card
              key={`${size.width}x${size.height}`}
              variant="outlined"
              sx={{
                borderColor: isSelected ? 'primary.main' : 'divider',
                backgroundColor: isSelected ? alpha('#1976d2', 0.08) : 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 1,
                }
              }}
            >
                <CardActionArea
                  onClick={() => onSizeSelect(size.width, size.height)}
                  sx={{ p: 2 }}
                >
                  <CardContent sx={{ p: 0, textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${size.width}, 1fr)`,
                        gap: '2px',
                        mb: 1,
                        justifyItems: 'center',
                      }}
                    >
                      {Array.from({ length: size.width * size.height }, (_, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 16,
                            height: 16,
                            backgroundColor: isSelected ? 'primary.main' : 'grey.300',
                            borderRadius: '2px',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight={isSelected ? 600 : 400}
                      color={isSelected ? 'primary.main' : 'text.primary'}
                    >
                      {size.label}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
          );
        })}
      </Box>
    </Box>
  );
};