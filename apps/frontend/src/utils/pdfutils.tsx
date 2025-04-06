import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const schoolLogo =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Sunny%20Path-baCvL17UVIOWy2lkb1I5T8lqOm7wDX.png";

export const generatePDF = <T,>(
  title: string,
  columns: { name: keyof T; label: string }[],
  data: T[]
) => {
  if (!data || data.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const doc = new jsPDF("landscape", "pt", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 📌 Header con diseño mejorado
  doc.addImage(schoolLogo, "PNG", 40, 30, 60, 60); // Más grande y balanceado

  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(26, 19, 99); // Azul oscuro institucional
  doc.text("Sunny Path Bilingual School", pageWidth / 2, 50, { align: "center" });

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(title, pageWidth / 2, 75, { align: "center" });

  doc.setDrawColor(237, 173, 76);
  doc.setLineWidth(1.5);
  doc.line(30, 85, pageWidth - 30, 85);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-HN")}`, pageWidth / 2, 100, {
    align: "center",
  });

  // 📊 Tabla (sin cambios como pediste)
  const tableColumn = columns.map((col) => col.label);
  const tableRows = data.map((row) =>
    columns.map((col) => {
      const value = row[col.name];
      if (value instanceof Date) {
        return value.toLocaleDateString("es-HN");
      }
      if (typeof value === "number") {
        return value.toLocaleString("es-HN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      return String(value ?? "");
    })
  );

  autoTable(doc, {
    startY: 110,
    head: [tableColumn],
    body: tableRows,
    styles: {
      fontSize: 8,
      halign: "center",
      valign: "middle",
      overflow: "linebreak",
      cellPadding: 4,
      lineColor: [255, 255, 255],
      lineWidth: 0.5,
      minCellHeight: 18,
      textColor: [55, 55, 55],
    },
    headStyles: {
      fillColor: [237, 173, 76],
      textColor: "#ffffff",
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [255, 251, 235],
    },
    margin: { top: 100, left: 30, right: 30 },
    theme: "striped",
    didDrawPage: (data) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      const pageNumber = doc.getCurrentPageInfo().pageNumber;
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(
        `Página ${pageNumber} de ${pageCount}`,
        pageWidth - 40,
        pageHeight - 15
      );
    },
  });

  // 💾 Guardar
  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
};
