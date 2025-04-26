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

interface InformacionAdicionalProps {
  formData: any;
  errors: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
  handleRadioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InformacionAdicional: React.FC<InformacionAdicionalProps> = ({
  formData,
  errors,
  handleChange,
  handleKeyDown,
  handlePaste,
  handleRadioChange,
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
          Información Adicional
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "12px",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                },
              }}
            >
              <FormControl component="fieldset" sx={formControlStyle}>
                <FormLabel component="legend">¿Es Zurdo?</FormLabel>
                <RadioGroup
                  row
                  name="es_zurdo"
                  value={formData.es_zurdo?.toString()}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Sí"
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
                    value="false"
                    control={<Radio />}
                    label="No"
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
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "12px",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                },
              }}
            >
              <FormControl component="fieldset" sx={formControlStyle}>
                <FormLabel component="legend">
                  ¿Dificultad en Educación Física?
                </FormLabel>
                <RadioGroup
                  row
                  name="dif_educacion_fisica"
                  value={formData.dif_educacion_fisica?.toString()}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Sí"
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
                    value="false"
                    control={<Radio />}
                    label="No"
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
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "12px",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                },
              }}
            >
              <FormControl component="fieldset" sx={formControlStyle}>
                <FormLabel component="legend">¿Reacción Alérgica?</FormLabel>
                <RadioGroup
                  row
                  name="reaccion_alergica"
                  value={formData.reaccion_alergica?.toString()}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Sí"
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
                    value="false"
                    control={<Radio />}
                    label="No"
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
            </Card>
          </Grid>

          {formData.reaccion_alergica && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descripción de la Alergia"
                name="descripcion_alergica"
                value={formData.descripcion_alergica || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                multiline
                rows={3}
                error={!!errors.descripcion_alergica}
                helperText={errors.descripcion_alergica}
                required
                sx={{
                  ...textFieldStyle,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#538A3E",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1A1363",
                      borderWidth: "2px",
                    },
                  },
                }}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};
