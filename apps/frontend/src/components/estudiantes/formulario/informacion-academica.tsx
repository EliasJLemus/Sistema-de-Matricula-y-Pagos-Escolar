"use client";

import type React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { textFieldStyle, formControlStyle } from "@/styles/common-styles";

interface InformacionAcademicaProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSelectChange: (e: any) => void;
  isEditing: boolean;
}

export const InformacionAcademica: React.FC<InformacionAcademicaProps> = ({
  formData,
  errors,
  handleChange,
  handleSelectChange,
  isEditing,
}) => {
  // Obtener la fecha actual en formato YYYY-MM-DD para establecerla como predeterminada
  const today = new Date().toISOString().split("T")[0];

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        borderRadius: "16px",
        border: "1px solid rgba(0,0,0,0.05)",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: "#1A1363",
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
            mb: 3,
            "&::before": {
              content: '""',
              display: "inline-block",
              width: "5px",
              height: "24px",
              backgroundColor: "#538A3E",
              marginRight: "10px",
              borderRadius: "3px",
            },
          }}
        >
          Información Académica
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <FormControl
              fullWidth
              error={!!errors.nombre_grado}
              required
              sx={formControlStyle}
            >
              <InputLabel id="grado-label" error={!!errors.nombre_grado}>
                Grado
              </InputLabel>
              <Select
                labelId="grado-label"
                name="nombre_grado"
                value={formData.nombre_grado || ""}
                label="Grado"
                onChange={handleSelectChange}
                error={!!errors.nombre_grado}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root:hover": {
                        backgroundColor: "#e7f5e8",
                      },
                      borderRadius: "12px",
                      mt: 1,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    },
                  },
                }}
              >
                <MenuItem
                  value="Primero"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Primero
                </MenuItem>
                <MenuItem
                  value="Segundo"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Segundo
                </MenuItem>
                <MenuItem
                  value="Tercero"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Tercero
                </MenuItem>
                <MenuItem
                  value="Cuarto"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Cuarto
                </MenuItem>
                <MenuItem
                  value="Quinto"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Quinto
                </MenuItem>
                <MenuItem
                  value="Sexto"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Sexto
                </MenuItem>
                <MenuItem
                  value="Séptimo"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Séptimo
                </MenuItem>
                <MenuItem
                  value="Octavo"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Octavo
                </MenuItem>
                <MenuItem
                  value="Noveno"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Noveno
                </MenuItem>
              </Select>
              {errors.nombre_grado && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ fontFamily: "'Nunito', sans-serif", mt: 0.5, ml: 1.5 }}
                >
                  {errors.nombre_grado}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl
              fullWidth
              error={!!errors.seccion}
              required
              sx={formControlStyle}
            >
              <InputLabel id="seccion-label" error={!!errors.seccion}>
                Sección
              </InputLabel>
              <Select
                labelId="seccion-label"
                name="seccion"
                value={formData.seccion || ""}
                label="Sección"
                onChange={handleSelectChange}
                error={!!errors.seccion}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root:hover": {
                        backgroundColor: "#e7f5e8",
                      },
                      borderRadius: "12px",
                      mt: 1,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    },
                  },
                }}
              >
                <MenuItem value="A" sx={{ fontFamily: "'Nunito', sans-serif" }}>
                  A
                </MenuItem>
                <MenuItem value="B" sx={{ fontFamily: "'Nunito', sans-serif" }}>
                  B
                </MenuItem>
                <MenuItem value="C" sx={{ fontFamily: "'Nunito', sans-serif" }}>
                  C
                </MenuItem>
              </Select>
              {errors.seccion && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ fontFamily: "'Nunito', sans-serif", mt: 0.5, ml: 1.5 }}
                >
                  {errors.seccion}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Fecha de Admisión"
              name="fecha_admision"
              type="date"
              value={formData.fecha_admision || today}
              onChange={handleChange}
              error={!!errors.fecha_admision}
              helperText={errors.fecha_admision || ""}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: new Date().toISOString().split("T")[0],
              }}
              required
              sx={textFieldStyle}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl
              fullWidth
              error={!!errors.plan_pago}
              required
              sx={formControlStyle}
            >
              <InputLabel id="plan-pago-label" error={!!errors.plan_pago}>
                Plan de Pago
              </InputLabel>
              <Select
                labelId="plan-pago-label"
                name="plan_pago"
                value={formData.plan_pago || ""}
                label="Plan de Pago"
                onChange={handleSelectChange}
                error={!!errors.plan_pago}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      "& .MuiMenuItem-root:hover": {
                        backgroundColor: "#e7f5e8",
                      },
                      borderRadius: "12px",
                      mt: 1,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    },
                  },
                }}
              >
                <MenuItem
                  value="Normal"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Normal
                </MenuItem>
                <MenuItem
                  value="Nivelado"
                  sx={{ fontFamily: "'Nunito', sans-serif" }}
                >
                  Nivelado
                </MenuItem>
              </Select>
              {errors.plan_pago && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ fontFamily: "'Nunito', sans-serif", mt: 0.5, ml: 1.5 }}
                >
                  {errors.plan_pago}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {isEditing && (
            <Grid item xs={12} md={3}>
              <FormControl fullWidth sx={formControlStyle}>
                <InputLabel id="estado-label">Estado</InputLabel>
                <Select
                  labelId="estado-label"
                  name="estado"
                  value={formData.estado || "Activo"}
                  label="Estado"
                  onChange={handleSelectChange}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        "& .MuiMenuItem-root:hover": {
                          backgroundColor: "#e7f5e8",
                        },
                        borderRadius: "12px",
                        mt: 1,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    },
                  }}
                >
                  <MenuItem
                    value="Activo"
                    sx={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#538A3E",
                        }}
                      />
                      Activo
                    </Box>
                  </MenuItem>
                  <MenuItem
                    value="Inactivo"
                    sx={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#F38223",
                        }}
                      />
                      Inactivo
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
