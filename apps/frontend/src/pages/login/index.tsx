import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography } from "@mui/material";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Debes ingresar correo y contraseña.');
      return;
    }

    setIsSubmitting(true);

    // Simulación para luego integrar backend
    setTimeout(() => {
      console.log('Credenciales enviadas:', { email, password });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        display: 'flex',
        backgroundColor: '#f7f7f7b8',
        padding: 0,
        margin: 0,
      }}
    >
      <Box
        boxShadow={3}
        p={5}
        bgcolor="#1B1263"
        sx={{
          width: '35%',
          borderTopRightRadius: '50px',
          borderBottomRightRadius: '50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Bienvenido
        </Typography>

        <TextField
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        />

        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            mb: 2,
            backgroundColor: 'white',
            borderRadius: 1,
          }}
        />

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={isSubmitting}
          sx={{
            bgcolor: '#4CAF50',
            color: 'white',
            borderRadius: 2,     
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#45A049',
            },
          }}
        >
          {isSubmitting ? 'Cargando...' : 'Iniciar sesión'}
        </Button>
      </Box>
    </Container>
  );
};
