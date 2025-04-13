import { useState } from "react";
import { Box, Typography } from "@mui/material";
import TablaMatricula from "./TablaMatricula";
import MatriculaModal from "./MatriculaModal";

const fontFamily = "'Nunito', sans-serif";

const MatriculaPage: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedMatriculaId, setSelectedMatriculaId] = useState<string | null>(null);

  const handleOpenCreateModal = () => setCreateModalOpen(true);
  const handleCloseCreateModal = () => setCreateModalOpen(false);

  const handleOpenEditModal = (codigo: string) => {
    console.log(codigo)
    setSelectedMatriculaId(codigo);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedMatriculaId(null);
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
          gap: 2,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="#1A1363"
        >
          <path d="M17 3h-1v2h-3V3H7v2H4V3H3v18h18V3h-4zm0 16H5V5h1v2h3V5h6v2h3V5h1v14z" />
          <path d="M15 11h-2V9h-2v2H9v2h2v2h2v-2h2z" />
        </svg>
        Gestión de Matrículas
      </Typography>

      <TablaMatricula
        onNewMatricula={handleOpenCreateModal}
        onEditMatricula={handleOpenEditModal} onDeleteMatricula={function (codigo_matricula: string, nombre: string): void {
          throw new Error("Function not implemented.");
        } }      />

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
