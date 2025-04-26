"use client"

// Common styles used across student management components
export const fontFamily =
  "'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"

// Text field styles
export const textFieldStyle = {
  "& .MuiInputLabel-root": {
    fontFamily,
    fontSize: "14px",
    color: "#1A1363",
    "&.Mui-focused": {
      color: "#1A1363",
    },
  },
  "& .MuiInputBase-root": {
    fontFamily,
    borderRadius: "12px",
    backgroundColor: "#f8f9fa",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#538A3E",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1A1363",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px rgba(26, 19, 99, 0.1)",
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336",
    },
    "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336",
    },
  },
  "& .MuiFormHelperText-root": {
    fontFamily,
  },
  "& .MuiFormLabel-root.Mui-error": {
    color: "#f44336",
  },
}

// Form control styles
export const formControlStyle = {
  "& .MuiInputLabel-root": {
    fontFamily,
    fontSize: "14px",
    color: "#1A1363",
    "&.Mui-focused": {
      color: "#1A1363",
    },
  },
  "& .MuiFormLabel-root": {
    fontFamily,
    fontSize: "14px",
    color: "#1A1363",
  },
  "& .MuiSelect-select": {
    fontFamily,
    backgroundColor: "#f8f9fa",
  },
  "& .MuiRadio-root": {
    color: "#538A3E",
  },
  "& .Mui-checked": {
    color: "#538A3E",
  },
  "& .MuiInputBase-root": {
    borderRadius: "12px",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#538A3E",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#1A1363",
      borderWidth: "2px",
    },
    "&.Mui-focused": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 10px rgba(26, 19, 99, 0.1)",
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336",
    },
    "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f44336",
    },
  },
  "& .MuiMenuItem-root:hover": {
    backgroundColor: "#e7f5e8",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#f44336",
  },
  "& .MuiFormLabel-root.Mui-error": {
    color: "#f44336",
  },
}

// Button styles
export const primaryButtonStyle = {
  bgcolor: "#538A3E",
  fontFamily,
  textTransform: "none",
  borderRadius: "10px",
  color: "white",
  px: 3,
  py: 1.2,
  height: "40px",
  fontWeight: 600,
  fontSize: "15px",
  boxShadow: "0px 4px 10px rgba(83, 138, 62, 0.3)",
  "&:hover": {
    backgroundColor: "#3e682e",
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 12px rgba(83, 138, 62, 0.4)",
  },
  "&:active": {
    backgroundColor: "#2e5022",
    transform: "translateY(1px)",
  },
  "&.Mui-disabled": {
    bgcolor: "rgba(83, 138, 62, 0.7)",
    color: "white",
  },
  transition: "all 0.2s ease-in-out",
}

export const secondaryButtonStyle = {
  fontFamily,
  textTransform: "none",
  borderRadius: "10px",
  bgcolor: "#F38223",
  color: "white",
  px: 3,
  py: 1.2,
  height: "40px",
  fontWeight: 600,
  fontSize: "15px",
  boxShadow: "0px 4px 10px rgba(243, 130, 35, 0.3)",
  "&:hover": {
    backgroundColor: "#e67615",
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 12px rgba(243, 130, 35, 0.4)",
  },
  "&:active": {
    backgroundColor: "#d56a10",
    transform: "translateY(1px)",
  },
  "&.Mui-disabled": {
    bgcolor: "rgba(243, 130, 35, 0.7)",
    color: "white",
  },
  transition: "all 0.2s ease-in-out",
}

export const paginationButtonStyle = {
  fontFamily,
  textTransform: "none",
  borderRadius: "10px",
  minWidth: "34px",
  height: "34px",
  fontWeight: 600,
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  transition: "all 0.2s ease-in-out",
}

export const zoomButtonStyle = {
  fontFamily,
  textTransform: "none",
  borderRadius: "10px",
  bgcolor: "#1A1363",
  color: "white",
  px: 3,
  py: 1.2,
  height: "40px",
  fontWeight: 600,
  fontSize: "15px",
  boxShadow: "0px 4px 10px rgba(26, 19, 99, 0.3)",
  "&:hover": {
    backgroundColor: "#13104d",
    transform: "translateY(-2px)",
    boxShadow: "0px 6px 12px rgba(26, 19, 99, 0.4)",
  },
  "&:active": {
    backgroundColor: "#0c0a33",
    transform: "translateY(1px)",
  },
  transition: "all 0.2s ease-in-out",
}
