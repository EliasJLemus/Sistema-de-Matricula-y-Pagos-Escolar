import { Box, IconButton, Typography } from "@mui/material";
import MenuOutlined from "@mui/icons-material/MenuOutlined";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "70px",
        backgroundColor: "#F5F1E3", 
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        borderBottom: "1px solid #ccc",
      }}
    >
      {/* Botón menú */}
      <IconButton onClick={onMenuClick}>
        <MenuOutlined />
      </IconButton>

      <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333", flexGrow: 1, textAlign: "center" }}>
        Sunny Path Bilingual School
      </Typography>

      {/* Espacio vacío para balancear el IconButton */}
      <Box width="40px" />
    </Box>
  );
};

export default Topbar;
