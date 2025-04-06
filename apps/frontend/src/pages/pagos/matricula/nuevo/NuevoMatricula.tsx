import React from 'react';
import { Box } from '@mui/material';
import FormularioMatricula from '../FormularioMatricula';
import SidebarLayout from '@/pages/global/SidebarLayout';

const NuevoMatricula: React.FC = () => {
  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioMatricula />
      </Box>
    </SidebarLayout>
  );
};

export default NuevoMatricula;