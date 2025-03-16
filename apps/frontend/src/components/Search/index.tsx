import { Box, IconButton, useTheme, InputBase } from "@mui/material";
import { tokens } from "../../theme";
import { Search } from "@mui/icons-material";

const SearchComponent = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      display="flex"
      alignItems="center"
      color={colors.primary[400]}
      borderRadius="3px"
      border="1px solid"
      borderColor={colors.grey[500]}
      sx={{
        padding: "0 8px", 
        width: "30%", 
      }}
    >
      <InputBase
        sx={{
          ml: 2,
          flex: 1,
          color: theme.palette.mode === "dark" ? "#fff" : "#000",
          padding: "5px", 
        }}
        placeholder="Search"
      />
      <IconButton type="button" sx={{ p: 1 }}>
        <Search />
      </IconButton>
    </Box>
  );
};

export default SearchComponent;
