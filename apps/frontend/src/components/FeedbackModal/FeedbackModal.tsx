import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  CircularProgress,
  DialogActions,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

export type FeedbackStatus = "loading" | "success" | "error";

interface FeedbackModalProps {
  open: boolean;
  status: FeedbackStatus;
  title: string;
  description: string;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  status,
  title,
  description,
  onClose,
}) => {
  const renderIcon = () => {
    switch (status) {
      case "loading":
        return <CircularProgress size={40} sx={{ color: "#538A3E" }} />;
      case "success":
        return <CheckCircleIcon sx={{ fontSize: 40, color: "#538A3E" }} />;
      case "error":
        return <ErrorIcon sx={{ fontSize: 40, color: "#f44336" }} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          fontFamily: "Nunito, sans-serif",
          textAlign: "center",
          fontWeight: 700,
          fontSize: "1.25rem",
          mt: 1,
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Box display="flex" justifyContent="center" mb={2}>
          {renderIcon()}
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Nunito, sans-serif",
            color: "#555",
            mb: 2,
          }}
        >
          {description}
        </Typography>

        {(status === "success" || status === "error") && (
          <DialogActions sx={{ justifyContent: "center" }}>
            <Button
              onClick={onClose}
              variant="contained"
              sx={{
                bgcolor: "#1A1363",
                color: "#fff",
                borderRadius: "8px",
                fontFamily: "Nunito, sans-serif",
                px: 3,
                py: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#100d4f",
                },
              }}
            >
              Cerrar
            </Button>
          </DialogActions>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
