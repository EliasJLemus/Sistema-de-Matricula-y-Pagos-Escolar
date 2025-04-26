"use client";

import type React from "react";
import {
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { textFieldStyle, formControlStyle } from "@/styles/common-styles";

interface DatosPersonalesProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  handleGenderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFechaNacimientoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DatosPersonales: React.FC<DatosPersonalesProps> = ({
  formData,
  errors,
  handleChange,
  handleKeyDown,
  handlePaste,
  handleGenderChange,
  handleFechaNacimientoChange,
}) => {
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
          Datos Personales
        </Typography>

        <Grid container spacing={3}>
          {/* Primera fila */}
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Primer Nombre"
              name="primer_nombre"
              value={formData.primer_nombre || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              error={!!errors.primer_nombre}
              helperText={errors.primer_nombre}
              required
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Segundo Nombre"
              name="segundo_nombre"
              value={formData.segundo_nombre || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              error={!!errors.segundo_nombre}
              helperText={errors.segundo_nombre}
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Primer Apellido"
              name="primer_apellido"
              value={formData.primer_apellido || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              error={!!errors.primer_apellido}
              helperText={errors.primer_apellido}
              required
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Segundo Apellido"
              name="segundo_apellido"
              value={formData.segundo_apellido || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              error={!!errors.segundo_apellido}
              helperText={errors.segundo_apellido}
              sx={textFieldStyle}
            />
          </Grid>

          {/* Segunda fila */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Identidad"
              name="identidad"
              value={formData.identidad || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              error={!!errors.identidad}
              helperText={errors.identidad}
              required
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nacionalidad"
              name="nacionalidad"
              value={formData.nacionalidad || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              error={!!errors.nacionalidad}
              helperText={errors.nacionalidad}
              required
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl component="fieldset" sx={formControlStyle}>
              <FormLabel id="genero-label">Género</FormLabel>
              <RadioGroup
                row
                aria-labelledby="genero-label"
                name="genero"
                value={formData.genero}
                onChange={handleGenderChange}
              >
                <FormControlLabel
                  value="Masculino"
                  control={
                    <Radio
                      sx={{
                        color: "#0000FF",
                        "&.Mui-checked": {
                          color: "#0000FF",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: "#0000FF",
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      Masculino
                    </Typography>
                  }
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "'Nunito', sans-serif",
                    },
                    "& .MuiRadio-root": {
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    },
                  }}
                />
                <FormControlLabel
                  value="Femenino"
                  control={
                    <Radio
                      sx={{
                        color: "#E91E63",
                        "&.Mui-checked": {
                          color: "#E91E63",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        color: "#E91E63",
                        fontFamily: "'Nunito', sans-serif",
                      }}
                    >
                      Femenino
                    </Typography>
                  }
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "'Nunito', sans-serif",
                    },
                    "& .MuiRadio-root": {
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      },
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Tercera fila */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento || ""}
              onChange={handleFechaNacimientoChange}
              error={!!errors.fecha_nacimiento}
              helperText={errors.fecha_nacimiento || ""}
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Edad"
              name="edad"
              type="number"
              value={formData.edad || ""}
              InputProps={{
                readOnly: true,
                sx: {
                  bgcolor: "rgba(0,0,0,0.02)",
                },
              }}
              sx={textFieldStyle}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Dirección"
              name="direccion"
              value={formData.direccion || ""}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              error={!!errors.direccion}
              helperText={errors.direccion}
              sx={textFieldStyle}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
