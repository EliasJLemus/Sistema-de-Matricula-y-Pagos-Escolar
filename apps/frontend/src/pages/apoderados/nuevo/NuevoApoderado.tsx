import React from 'react';
import { Box } from '@mui/material';
import FormularioApoderado from '../FormularioApoderado';
import SidebarLayout from '@/pages/global/SidebarLayout';

const NuevoApoderadoPage: React.FC = () => {
  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioApoderado />
      </Box>
    </SidebarLayout>
  );
};

export default NuevoApoderadoPage;