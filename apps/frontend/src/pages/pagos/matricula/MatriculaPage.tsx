"use client";

import type React from "react";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import TablaMatricula from "./TablaMatricula";
import MatriculaModal from "./MatriculaModal";

const fontFamily = "'Nunito', sans-serif";

const MatriculaPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedMatriculaId, setSelectedMatriculaId] = useState<string | null>(
    null
  );

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const handleOpenEditModal = (codigo: string) => {
    console.log(codigo);
    setSelectedMatriculaId(codigo);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedMatriculaId(null);
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
        Gestión de Estudiantes
      </Typography>

      <TablaMatricula
        onNewMatricula={handleOpenCreateModal}
        onEditMatricula={handleOpenEditModal}
        onDeleteMatricula={(codigo_matricula: string, nombre: string): void => {
          throw new Error("Function not implemented.");
        }}
      />

      <MatriculaModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        isEditing={false}
      />

      <MatriculaModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        matriculaId={selectedMatriculaId || undefined}
        isEditing={true}
      />
    </Box>
  );
};

export default MatriculaPage;
