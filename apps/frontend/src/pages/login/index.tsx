import React from 'react';
import { Box, Button, Container, Grid, Paper, TextField, Typography } from "@mui/material";

export const LoginPage: React.FC = () => {
    return (
       <Container
        maxWidth={false}
        sx={{
            height: "100vh",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            backgroundColor: "#f7f7f7b8",
            padding: "0px",
            margin: "0px"
        }}
        >
            
            <Box
            boxShadow={3} p={3} 
            bgcolor="#1B1263" 
            sx={{
                width: "35%", 
                maxWidth: "100%",
                "borderTopRightRadius": "50px",
                "borderBottomRightRadius": "50px",
            }}
            height="100vh"
            margin="0px"
            position={"absolute"}
            left={"0"}
            >

            </Box>

       </Container>
    )
}