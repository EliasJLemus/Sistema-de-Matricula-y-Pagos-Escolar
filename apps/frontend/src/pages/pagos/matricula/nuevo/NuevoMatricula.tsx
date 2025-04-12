import React from 'react';
import { Box } from '@mui/material';
import FormularioMatricula from '../FormularioMatricula';
import SidebarLayout from '@/pages/global/SidebarLayout';

const NuevoMatricula: React.FC = () => {
  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioMatricula onClose={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </Box>
    </SidebarLayout>
  );
};

export default NuevoMatricula;