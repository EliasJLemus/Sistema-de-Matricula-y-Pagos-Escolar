import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { TablaMensualidad } from "./TablaMensualidad"; // Asegurar que existe este componente
import MensualidadModal from "./MensualidadModal"; // Asegurar que existe este componente

const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const MensualidadPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedMensualidadId, setSelectedMensualidadId] = useState<number | null>(null);

  // Handlers para modales
  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const handleOpenEditModal = (id: number) => {
    setSelectedMensualidadId(id);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedMensualidadId(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          fontFamily,
          color: "#1A1363",
          display: "flex",
          alignItems: "center",
          gap: 2
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="#1A1363"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.88-11.71L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0l5.59-5.59a.996.996 0 1 0-1.41-1.41z"/>
        </svg>
        Gestión de Mensualidades
      </Typography>

      <TablaMensualidad
        onNewMensualidad={handleOpenCreateModal}
        onEditMensualidad={handleOpenEditModal}
      />

      {/* Modales */}
      <MensualidadModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        isEditing={false}
      />

      <MensualidadModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        mensualidadId={selectedMensualidadId || undefined}
        isEditing={true}
      />
    </Box>
  );
};

export default MensualidadPage;