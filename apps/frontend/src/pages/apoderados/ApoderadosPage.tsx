import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { TablaApoderados } from "./TablaApoderados";
import ApoderadoModal from "./ApoderadoModal";

// Font family constant to match sidebar and topbar
const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const ApoderadosPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedApoderadoId, setSelectedApoderadoId] = useState<number | null>(
    null
  );

  // Función para abrir el modal de creación
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  // Función para cerrar el modal de creación
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = (id: number) => {
    setSelectedApoderadoId(id);
    setEditModalOpen(true);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedApoderadoId(null);
  };

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          fontFamily,
          color: "#1A1363",
        }}
      >
        Gestión de Apoderados
      </Typography>

      <TablaApoderados
        onNewApoderado={handleOpenCreateModal}
        onEditApoderado={handleOpenEditModal}
      />

      {/* Modal para crear nuevo apoderado */}
      <ApoderadoModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        isEditing={false}
      />

      {/* Modal para editar apoderado existente */}
      <ApoderadoModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        apoderadoId={selectedApoderadoId || undefined}
        isEditing={true}
      />
    </Box>
  );
};

export default ApoderadosPage;