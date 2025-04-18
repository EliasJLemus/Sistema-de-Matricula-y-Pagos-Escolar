"use client";

import type React from "react";

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { TablaEstudiantes } from "./TablaEstudiantes";
import EstudianteModal from "./EstudianteModal";

// Font family constant to match sidebar and topbar
const fontFamily = "'Nunito', sans-serif";

const EstudiantesPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
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
  const handleOpenEditModal = (uuid: string) => {
    console.log("UUID del estudiante a editar:", uuid);
    setSelectedStudentId(uuid);
    setEditModalOpen(true);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedStudentId(null);
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

      <TablaEstudiantes
        onNewStudent={handleOpenCreateModal}
        onEditStudent={handleOpenEditModal}
      />

      {/* Modal para crear nuevo estudiante */}
      <EstudianteModal
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        isEditing={false}
      />

      {/* Modal para editar estudiante existente */}
      <EstudianteModal
        open={editModalOpen}
        onClose={handleCloseEditModal}
        estudianteId={selectedStudentId || undefined}
        isEditing={true}
      />
    </Box>
  );
};

export default EstudiantesPage;
