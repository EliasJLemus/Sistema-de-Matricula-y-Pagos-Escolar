import React, { useState, useEffect } from "react";
import { 
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Box,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  useTheme
} from "@mui/material";

// Array de países completo y correctamente definido
const paises = [
  { codigo: "+1", nombre: "EE.UU./Canadá", digitos: 10, ejemplo: "3055551234" },
  { codigo: "+52", nombre: "México", digitos: 10, ejemplo: "5512345678" },
  { codigo: "+51", nombre: "Perú", digitos: 9, ejemplo: "987654321" },
  { codigo: "+54", nombre: "Argentina", digitos: 10, ejemplo: "91123456789" },
  { codigo: "+55", nombre: "Brasil", digitos: 11, ejemplo: "21987654321" },
  { codigo: "+56", nombre: "Chile", digitos: 9, ejemplo: "912345678" },
  { codigo: "+57", nombre: "Colombia", digitos: 10, ejemplo: "3012345678" },
  { codigo: "+58", nombre: "Venezuela", digitos: 10, ejemplo: "4121234567" },
  { codigo: "+503", nombre: "El Salvador", digitos: 8, ejemplo: "70123456" },
  { codigo: "+502", nombre: "Guatemala", digitos: 8, ejemplo: "51234567" },
  { codigo: "+505", nombre: "Nicaragua", digitos: 8, ejemplo: "81234567" },
  { codigo: "+506", nombre: "Costa Rica", digitos: 8, ejemplo: "61234567" },
  { codigo: "+507", nombre: "Panamá", digitos: 8, ejemplo: "61234567" },
  { codigo: "+504", nombre: "Honduras", digitos: 8, ejemplo: "91234567" },
  { codigo: "+593", nombre: "Ecuador", digitos: 9, ejemplo: "991234567" },
  { codigo: "+591", nombre: "Bolivia", digitos: 8, ejemplo: "71234567" },
  { codigo: "+598", nombre: "Uruguay", digitos: 8, ejemplo: "94234567" },
  { codigo: "+592", nombre: "Guyana", digitos: 7, ejemplo: "6091234" },
  { codigo: "+34", nombre: "España", digitos: 9, ejemplo: "612345678" },
  { codigo: "+44", nombre: "Reino Unido", digitos: 10, ejemplo: "7912345678" },
  { codigo: "+33", nombre: "Francia", digitos: 9, ejemplo: "612345678" },
  { codigo: "+49", nombre: "Alemania", digitos: 10, ejemplo: "15123456789" },
  { codigo: "+39", nombre: "Italia", digitos: 10, ejemplo: "3123456789" },
  { codigo: "+7", nombre: "Rusia", digitos: 10, ejemplo: "9123456789" },
  { codigo: "+86", nombre: "China", digitos: 11, ejemplo: "13123456789" },
  { codigo: "+91", nombre: "India", digitos: 10, ejemplo: "9876543210" },
  { codigo: "+81", nombre: "Japón", digitos: 10, ejemplo: "9012345678" },
  { codigo: "+82", nombre: "Corea del Sur", digitos: 9, ejemplo: "102345678" },
  { codigo: "+971", nombre: "Emiratos Árabes", digitos: 9, ejemplo: "501234567" },
  { codigo: "+20", nombre: "Egipto", digitos: 10, ejemplo: "1001234567" },
  { codigo: "+27", nombre: "Sudáfrica", digitos: 9, ejemplo: "711234567" },
  { codigo: "+61", nombre: "Australia", digitos: 9, ejemplo: "412345678" },
  { codigo: "+64", nombre: "Nueva Zelanda", digitos: 9, ejemplo: "211234567" }
].sort((a, b) => a.nombre.localeCompare(b.nombre));

interface TelefonoInputProps {
  value?: string;
  onChange?: (telefonoCompleto: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  onBlur?: () => void;
  required?: boolean; // Nueva prop
}

export const TelefonoInput: React.FC<TelefonoInputProps> = ({ 
  value = "", 
  onChange,
  error = false,
  helperText = "",
  label = "Teléfono",
  onBlur,
  required = false // Nueva prop con valor por defecto
}) => {
  const theme = useTheme();
  const [paisSeleccionado, setPaisSeleccionado] = useState(paises[0]);
  const [numero, setNumero] = useState("");
  const [errorLocal, setErrorLocal] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [touched, setTouched] = useState(false);
  const [showNumberError, setShowNumberError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) {
      const paisEncontrado = paises.find(p => value.startsWith(p.codigo)) || paises[0];
      const num = value.replace(paisEncontrado.codigo, "");
      setPaisSeleccionado(paisEncontrado);
      setNumero(num);
    }
  }, [value]);

  const handlePaisChange = (e: any) => {
    const codigoPais = e.target.value;
    const pais = paises.find(p => p.codigo === codigoPais) || paises[0];
    setPaisSeleccionado(pais);
    setNumero("");
    setErrorLocal("");
    setShowNumberError(false);
    if (onChange) onChange("");
    setMenuAbierto(false);
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    
    if (/^\d*$/.test(valor)) {
      setNumero(valor);
      setShowNumberError(false);
      
      if (touched && valor.length !== paisSeleccionado.digitos) {
        setErrorLocal(`${paisSeleccionado.digitos} dígitos requeridos`);
      } else {
        setErrorLocal("");
      }

      if (onChange) {
        const telefonoCompleto = valor ? `${paisSeleccionado.codigo}${valor}` : "";
        onChange(telefonoCompleto);
      }
    } else {
      setShowNumberError(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
    if (required && !numero) {
      setErrorLocal("Este campo es requerido");
    } else if (numero.length !== paisSeleccionado.digitos) {
      setErrorLocal(`${paisSeleccionado.digitos} dígitos requeridos`);
    } else {
      setErrorLocal("");
    }
    if (onBlur) onBlur();
  };

  const paisesFiltrados = busqueda 
    ? paises.filter(pais => 
        pais.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
        pais.codigo.includes(busqueda)
    )
    : paises;

  const hasError = (touched && !!errorLocal) || error;
  const showErrorOutline = hasError && !isFocused;

  return (
    <FormControl 
      fullWidth 
      error={hasError || showNumberError}
      required={required} // Pasamos la prop required al FormControl
      sx={{
        '& .MuiInputLabel-root': {
          fontFamily: "'Nunito', sans-serif",
          fontSize: "15px",
          color: "#1A1363 !important",
          '&.Mui-focused': {
            color: "#1A1363 !important",
          },
        },
        '& .MuiOutlinedInput-root': {
          borderRadius: "12px",
          backgroundColor: "#f8f9fa",
          fontFamily: "'Nunito', sans-serif",
          fontSize: "15px",
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: "#538A3E",
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: "#1A1363",
            borderWidth: "2px",
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: showErrorOutline ? "#f44336" : isFocused ? "#1A1363" : "rgba(0, 0, 0, 0.23)",
          },
        },
        '& .MuiFormHelperText-root': {
          fontFamily: "'Nunito', sans-serif",
          marginLeft: 0,
          fontSize: "0.65rem",
          lineHeight: 1.2,
          marginTop: "3px",
        },
      }}
    >
      <InputLabel htmlFor="telefono-input" required={required}>
        {label}
      </InputLabel>
      <OutlinedInput
        id="telefono-input"
        value={numero}
        onChange={handleNumeroChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required} // Pasamos la prop al OutlinedInput
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 1 }}>
            <FormControl variant="standard" sx={{ minWidth: 70 }}>
              <Select
                value={paisSeleccionado.codigo}
                onChange={handlePaisChange}
                onOpen={() => setMenuAbierto(true)}
                onClose={() => {
                  setMenuAbierto(false);
                  setBusqueda("");
                }}
                open={menuAbierto}
                sx={{
                  '&:before, &:after': { borderBottom: 'none' },
                  '& .MuiSelect-select': { 
                    paddingRight: '0 !important',
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 500,
                    color: "#1A1363",
                    fontSize: "15px",
                  },
                  '& .MuiSvgIcon-root': {
                    color: "#1A1363",
                  },
                  '&:hover': {
                    '& .MuiSelect-select': {
                      color: "#538A3E",
                    },
                    '& .MuiSvgIcon-root': {
                      color: "#538A3E",
                    }
                  }
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 300,
                      borderRadius: "12px",
                      mt: 1,
                      '& .MuiMenuItem-root': {
                        py: 1,
                        minHeight: 'auto',
                        fontFamily: "'Nunito', sans-serif",
                        fontSize: "14px",
                      }
                    }
                  }
                }}
                renderValue={(selected) => (
                  <Typography fontWeight={500}>{selected}</Typography>
                )}
              >
                <Box px={1} py={0.5}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar país..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: "8px",
                        fontFamily: "'Nunito', sans-serif",
                      },
                    }}
                  />
                </Box>
                {paisesFiltrados.map((pais) => (
                  <MenuItem 
                    key={pais.codigo} 
                    value={pais.codigo}
                    sx={{ py: 1 }}
                  >
                    <Typography component="span" fontWeight={500}>
                      {pais.codigo}
                    </Typography>
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      {pais.nombre}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </InputAdornment>
        }
        label={label}
        inputProps={{
          maxLength: paisSeleccionado.digitos
        }}
      />
      <FormHelperText sx={{ fontSize: '0.65rem' }}>
        {showNumberError ? "Solo se permiten números" : 
         (touched && errorLocal) ? errorLocal : 
         helperText || `Ejemplo: ${paisSeleccionado.codigo}${paisSeleccionado.ejemplo}`}
      </FormHelperText>
    </FormControl>
  );
};