import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { TablaBecas } from "./TablaBecas";
import BecasModal from "./BecasModal";

// Fuente para mantener consistencia con el diseño general
const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const BecasPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedBecaId, setSelectedBecaId] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const handleOpenEditModal = (uuid: string) => {
    setSelectedBecaId(uuid);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedBecaId(null);
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
        Gestión de Becas
      </Typography>

      <TablaBecas
        onNewBeca={handleOpenCreateModal}
        onEditBeca={handleOpenEditModal}
      />

      {/* Modal para crear nueva beca */}
      <BecasModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        isEditing={false}
      />

      {/* Modal para editar beca existente */}
      <BecasModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        becaId={selectedBecaId || undefined}
        isEditing={true}
      />
    </Box>
  );
};

export default BecasPage;
