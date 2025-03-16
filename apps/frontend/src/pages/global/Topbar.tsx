import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import {
  LightModeOutlined,
  NotificationsOutlined,
  SettingsOutlined,
  PersonOutlined,
  DarkModeOutlined,
} from "@mui/icons-material";
import SearchComponent from "../../components/Search"

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? colors.primary[800] : colors.primary[200],
        borderBottom: `1px solid ${colors.grey[400]}`,
      }}
    >
        <SearchComponent></SearchComponent>
      {/* Icons */}
      <Box display="flex" alignItems="center">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlined /> : <LightModeOutlined />}
        </IconButton>
        <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <IconButton>
          <PersonOutlined />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
