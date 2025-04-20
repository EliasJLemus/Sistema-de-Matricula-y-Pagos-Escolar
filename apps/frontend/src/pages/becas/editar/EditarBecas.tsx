import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import FormularioBecas from "../FormularioBecas"; // Asegúrate de tener este componente
import SidebarLayout from "@/pages/global/SidebarLayout";

const EditarBecas: React.FC = () => {
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
              No se ha especificado un ID de beca válido.
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
              onClick={() => navigate("/becas")}
            >
              Volver a la lista de becas
            </Button>
          </Box>
        </Box>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <Box sx={{ p: 4 }}>
        <FormularioBecas becaId={id} isEditing={true} />
      </Box>
    </SidebarLayout>
  );
};

export default EditarBecas;