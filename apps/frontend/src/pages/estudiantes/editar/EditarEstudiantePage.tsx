import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import FormularioEstudiante from "../FormularioEstudiante";
import SidebarLayout from "@/pages/global/SidebarLayout";

// Mantenemos este componente por compatibilidad con rutas existentes
const EditarEstudiantePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    return (
      <SidebarLayout>
        <Box sx={{ p: 4 }}>
          <Box sx={{ bgcolor: "white", p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h5" color="error" fontWeight="bold">
              Error
            </Typography>
            <Typography mt={2}>
              No se ha especificado un ID de estudiante válido.
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: "#538A3E",
                "&:hover": {
                  bgcolor: "#3e6c2e",
                },
              }}
              onClick={() => navigate("/estudiantes")}
            >
              Volver a la lista de estudiantes
            </Button>
          </Box>
        </Box>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioEstudiante estudianteId={id} isEditing={true} />
      </Box>
    </SidebarLayout>
  );
};

export default EditarEstudiantePage;
