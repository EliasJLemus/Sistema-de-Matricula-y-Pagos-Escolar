import { Box, List, ListItemButton, ListItemIcon, ListItemText, Avatar } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentIcon from "@mui/icons-material/Payment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import DescriptionIcon from "@mui/icons-material/Description";

interface SidebarProps {
  isSidebarVisible: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarVisible }) => {
  return (
    <Box
      sx={{
        width: isSidebarVisible ? "300px" : "0px",
        height: "100vh",
        backgroundColor: "#9EB384",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "hidden",
        transition: "width 0.3s ease",
      }}
    >
      {isSidebarVisible && (
        <>
          {/* Perfil */}
          <Box>
            <Box textAlign="center" py={3}>
              <Avatar
                alt="User"
                src="https://via.placeholder.com/100"
                sx={{
                  width: 90,
                  height: 90,
                  margin: "0 auto",
                  border: "3px solid white",
                }}
              />
            </Box>

            {/* Lista */}
            <List>
              {[
                { icon: <HomeIcon to="/home"/>, text: "Home" },
                { icon: <SchoolIcon />, text: "Estudiantes" },
                { icon: <PeopleIcon />, text: "Apoderados" },
                { icon: <AssignmentIcon />, text: "Matrículas" },
                { icon: <DescriptionIcon />, text: "Reportes" },
                { icon: <PaymentIcon />, text: "Pagos" },
              ].map((item, index) => (
                <ListItemButton key={index} sx={{ py: 2 }}>
                  <ListItemIcon sx={{ minWidth: "40px" }}>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontSize: "18px", fontWeight: 500 }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Box>

          {/* Salir */}
          <Box p={2}>
            <ListItemButton sx={{ backgroundColor: "#444", color: "#fff", py: 2 }}>
              <ListItemIcon><ExitToAppIcon sx={{ color: "#fff" }} /></ListItemIcon>
              <ListItemText primary="Salir" primaryTypographyProps={{ fontSize: "16px" }} />
            </ListItemButton>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Sidebar;
