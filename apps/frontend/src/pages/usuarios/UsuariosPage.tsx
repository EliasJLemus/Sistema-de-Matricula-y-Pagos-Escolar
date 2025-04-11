import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import UsuarioModal from './UsuarioModal';
import TablaUsuarios from './TablaUsuario';
import { UsuarioFormData } from './FormularioUsuario';

const UsuariosPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioFormData | null>(null);

  const handleCreateClick = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleSubmit = (data: UsuarioFormData) => {
    console.log('Datos enviados:', data);
    setModalOpen(false);
  };

  const handleEdit = (user: UsuarioFormData) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Gestión de Usuarios</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateClick}>
          Crear Usuario
        </Button>
      </Box>

      <TablaUsuarios onEdit={handleEdit} />

      <UsuarioModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingUser || undefined}
      />
    </Box>
  );
};

export default UsuariosPage;
