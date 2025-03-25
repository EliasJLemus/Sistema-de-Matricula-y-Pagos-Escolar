import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Agregar logo de la escuela (asegúrate de tener el logo en base64 o como imagen pública)
const schoolLogo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo%20Sunny%20Path-baCvL17UVIOWy2lkb1I5T8lqOm7wDX.png'; // Reemplaza con el logo en base64

const generatePDF = <T,>(title: string, columns: { name: keyof T; label: string }[], data: T[]) => {
  if (!data || data.length === 0) {
    alert("No hay datos para exportar");
    return;
  }

  const doc = new jsPDF();

  doc.addImage(schoolLogo, 'PNG', 10, 10, 30, 30); // Ajusta la posición y tamaño según sea necesario

  // Nombre de la escuela y nombre del reporte
  doc.setFontSize(18);
  doc.text("Sunny Path School", 50, 20); // Ajusta la posición
  doc.setFontSize(12);
  doc.text(title, 50, 30); // Ajusta la posición

  // Fecha de emisión
  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Fecha de emisión: ${currentDate}`, 50, 40); // Ajusta la posición

  // Espacio antes de la tabla
  const startY = 50;

  const tableColumn = columns.map(col => col.label);
  const tableRows = data.map(row => columns.map(col => String(row[col.name] || "")));

  autoTable(doc, { startY: startY, head: [tableColumn], body: tableRows });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
  }
  // Guardar el PDF con el título
  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
};

export { generatePDF };