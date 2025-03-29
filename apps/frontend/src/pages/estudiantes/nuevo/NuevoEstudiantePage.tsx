import React from 'react';
import { Box } from '@mui/material';
import FormularioEstudiante from '../FormularioEstudiante';
import SidebarLayout from '@/pages/global/SidebarLayout';

const NuevoEstudiantePage: React.FC = () => {
  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioEstudiante />
      </Box>
    </SidebarLayout>
  );
};

export default NuevoEstudiantePage;