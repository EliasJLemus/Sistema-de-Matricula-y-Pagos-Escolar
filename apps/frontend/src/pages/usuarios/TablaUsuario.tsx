import React from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { UsuarioFormData } from './FormularioUsuario';

const mockUsuarios: UsuarioFormData[] = [
  {
    nombre_usuario: 'Carlos Martínez',
    correo: 'carlos@colegio.edu',
    password: '****',
    rol: 'administracion',
  },
  {
    nombre_usuario: 'Laura Gómez',
    correo: 'laura@instituto.edu',
    password: '****',
    rol: 'directivo',
  },
];

interface Props {
  onEdit: (user: UsuarioFormData) => void;
}

const TablaUsuarios: React.FC<Props> = ({ onEdit }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockUsuarios.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.nombre_usuario}</TableCell>
              <TableCell>{user.correo}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" size="small" onClick={() => onEdit(user)}>
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaUsuarios;
