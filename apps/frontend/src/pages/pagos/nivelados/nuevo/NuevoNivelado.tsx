import React from 'react';
import { Box } from '@mui/material';
import FormularioNivelado from '../FormularioNivelado';
import SidebarLayout from '@/pages/global/SidebarLayout';

const NuevoNivelado: React.FC = () => {
  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioNivelado />
      </Box>
    </SidebarLayout>
  );
};

export default NuevoNivelado;