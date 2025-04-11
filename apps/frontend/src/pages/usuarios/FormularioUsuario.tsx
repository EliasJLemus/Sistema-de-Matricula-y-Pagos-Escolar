import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export type Rol = 'administracion' | 'directivo';

export interface UsuarioFormData {
  nombre_usuario: string;
  correo: string;
  password: string;
  rol: Rol;
}

interface FormularioUsuarioProps {
  onSubmit: SubmitHandler<UsuarioFormData>;
  initialData?: Partial<UsuarioFormData>;
}

const roles = [
  { value: 'administracion', label: 'Administración' },
  { value: 'directivo', label: 'Directivo' },
];

const validationSchema = Yup.object({
  nombre_usuario: Yup.string().required('El nombre de usuario es requerido'),
  correo: Yup.string().email('Correo inválido').required('El correo es requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('La contraseña es requerida'),
  rol: Yup.string().oneOf(['administracion', 'directivo']).required('El rol es requerido'),
});

const FormularioUsuario: React.FC<FormularioUsuarioProps> = ({ onSubmit, initialData = {} }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioFormData>({
    defaultValues: {
      nombre_usuario: '',
      correo: '',
      password: '',
      rol: 'administracion',
      ...initialData,
    },
    resolver: yupResolver(validationSchema),
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Nombre de Usuario"
        fullWidth
        {...register('nombre_usuario')}
        error={!!errors.nombre_usuario}
        helperText={errors.nombre_usuario?.message}
      />
      <TextField
        label="Correo"
        fullWidth
        {...register('correo')}
        error={!!errors.correo}
        helperText={errors.correo?.message}
      />
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        {...register('password')}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        select
        label="Rol"
        fullWidth
        {...register('rol')}
        error={!!errors.rol}
        helperText={errors.rol?.message}
      >
        {roles.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary">
        Guardar Usuario
      </Button>
    </Box>
  );
};

export default FormularioUsuario;
