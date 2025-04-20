import React from 'react';
import { Box } from '@mui/material';
import FormularioBecas from '../FormularioBecas';
import SidebarLayout from '@/pages/global/SidebarLayout';

const NuevoBecas: React.FC = () => {
  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioBecas />
      </Box>
    </SidebarLayout>
  );
};

export default NuevoBecas;