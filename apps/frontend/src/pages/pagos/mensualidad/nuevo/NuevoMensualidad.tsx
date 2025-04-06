import React from 'react';
import { Box } from '@mui/material';
import FormularioMensualidad from '../FormularioMensualidad';
import SidebarLayout from '@/pages/global/SidebarLayout';

const NuevoMensualidad: React.FC = () => {
  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioMensualidad />
      </Box>
    </SidebarLayout>
  );
};

export default NuevoMensualidad;