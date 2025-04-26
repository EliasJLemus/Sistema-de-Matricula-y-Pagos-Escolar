"use client";

import type React from "react";
import EditIcon from "@mui/icons-material/Edit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fontFamily } from "@/styles/common-styles";

interface TablaContenidoProps {
  tableData: any[];
  handleEdit: (id: string) => void;
}

export const TablaContenido: React.FC<TablaContenidoProps> = ({
  tableData,
  handleEdit,
}) => {
  // Función para obtener el nombre completo del estudiante
  const getNombreCompleto = (estudiante: any) => {
    const primerNombre = estudiante.primer_nombre || "";
    const segundoNombre = estudiante.segundo_nombre || "";
    const primerApellido = estudiante.primer_apellido || "";
    const segundoApellido = estudiante.segundo_apellido || "";

    return `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`
      .trim()
      .replace(/\s+/g, " ");
  };

  return (
    <div className="border border-[#edad4c] rounded-lg overflow-hidden">
      <div style={{ overflowX: "auto", width: "100%" }}>
        <Table className="bg-[#fff9db]">
          <TableHeader className="bg-[#edad4c] sticky top-0 z-10">
            <TableRow>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Código
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Nombre Completo
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Nacionalidad
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Identidad
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Género
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Fecha Nacimiento
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Edad
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Dirección
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Grado
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Sección
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Es Zurdo
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Dif. Educación
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Alergia
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Desc. Alergia
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Fecha Admisión
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Estado
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Plan Pago
              </TableHead>
              <TableHead
                className="text-white font-bold"
                style={{ fontFamily }}
              >
                Editar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item, index) => (
              <TableRow
                key={item.uuid}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-[#fff9db]"
                } hover:bg-[#e7f5e8] cursor-pointer transition-colors`}
              >
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.codigo_estudiante}
                </TableCell>
                <TableCell
                  className="text-[#4D4D4D] font-medium"
                  style={{ fontFamily }}
                >
                  {getNombreCompleto(item)}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.nacionalidad}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.identidad}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {String(item.genero)}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.fecha_nacimiento}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.edad}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.direccion}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.grado}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.seccion}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.es_zurdo ? "Sí" : "No"}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.dif_educacion ? "Sí" : "No"}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.alergia ? "Sí" : "No"}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.desc_alergia || "N/A"}
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.fecha_admision}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.estado === "Activo"
                        ? "bg-[#538A3E] text-white hover:bg-[#538A3E] hover:text-white w-16 justify-center"
                        : "bg-[#F38223] text-white hover:bg-[#F38223] hover:text-white w-16 justify-center"
                    }
                    style={{
                      fontFamily,
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontWeight: 600,
                    }}
                  >
                    {item.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-[#4D4D4D]" style={{ fontFamily }}>
                  {item.plan_pago}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => handleEdit(item.uuid as string)}
                      className="p-1 text-[#538A3E] hover:text-[#3e682e] transition-colors hover:scale-125"
                      title="Editar"
                      style={{
                        transition: "all 0.2s ease, transform 0.2s ease",
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
