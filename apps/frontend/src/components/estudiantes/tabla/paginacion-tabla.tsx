"use client";

import type React from "react";
import { Box, Button, Typography } from "@mui/material";
import { fontFamily, paginationButtonStyle } from "@/styles/common-styles";

interface PaginacionTablaProps {
  page: number;
  pageCount: number;
  total: number;
  tableData: any[];
  setPage: (page: number | ((prev: number) => number)) => void;
}

export const PaginacionTabla: React.FC<PaginacionTablaProps> = ({
  page,
  pageCount,
  total,
  tableData,
  setPage,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: tableData.length > 0 ? "space-between" : "center",
        mt: 2,
        p: 2,
        bgcolor: "white",
        borderRadius: "12px",
        boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontFamily,
          display: "flex",
          alignItems: "center",
          textAlign: tableData.length > 0 ? "left" : "center",
        }}
      >
        {tableData.length > 0
          ? `Mostrando ${tableData.length} de ${total} registros`
          : "No se encontraron estudiantes para los filtros actuales."}
      </Typography>

      {tableData.length > 0 && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page <= 1}
            sx={{
              ...paginationButtonStyle,
              bgcolor: "#F38223",
              color: "white",
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
                bgcolor: "rgba(243, 130, 35, 0.4)",
                color: "white",
              },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </Button>
          {[...Array(Math.min(5, pageCount))].map((_, i) => {
            const pageNum = page <= 3 ? i + 1 : page - 2 + i;
            if (pageNum <= pageCount) {
              return (
                <Button
                  key={i}
                  variant={pageNum === page ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setPage(pageNum)}
                  sx={
                    pageNum === page
                      ? {
                          ...paginationButtonStyle,
                          bgcolor: "#538A3E",
                          color: "white",
                          "&:hover": {
                            bgcolor: "#3e682e",
                            transform: "translateY(-2px)",
                            boxShadow: "0px 6px 12px rgba(83, 138, 62, 0.4)",
                          },
                        }
                      : {
                          ...paginationButtonStyle,
                          bgcolor: "#f8f9fa",
                          color: "#333",
                          border: "1px solid #ddd",
                          "&:hover": {
                            bgcolor: "#e7f5e8",
                            transform: "translateY(-2px)",
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
                          },
                        }
                  }
                >
                  {pageNum}
                </Button>
              );
            }
            return null;
          })}
          <Button
            variant="contained"
            size="small"
            onClick={() => setPage((p) => Math.min(p + 1, pageCount))}
            disabled={page >= pageCount}
            sx={{
              ...paginationButtonStyle,
              bgcolor: "#F38223",
              color: "white",
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
                bgcolor: "rgba(243, 130, 35, 0.4)",
                color: "white",
              },
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Button>
        </Box>
      )}
    </Box>
  );
};
