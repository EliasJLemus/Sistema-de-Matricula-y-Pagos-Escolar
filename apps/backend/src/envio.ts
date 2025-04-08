import cron from "node-cron";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import {Database} from "@/db/service"

const db = new Database()

const obtenerMatriculasPendientes = async () => {
  const query = `
    SELECT 
      e.codigo_estudiante,
      i.primer_nombre || ' ' || i.primer_apellido AS nombre_estudiante,
      i2.primer_nombre || ' ' || i2.primer_apellido AS nombre_encargado,
      enc.correo_electronico AS correo,
      g.nombre_grado,
      g.seccion,
      m.total,
      m.fecha_matricula
    FROM "Pagos"."Matricula" m
    JOIN "Estudiantes"."Estudiantes" e ON e.uuid = m.uuid_estudiante
    JOIN "Estudiantes"."InformacionGeneral" i ON e.uuid_info_general = i.uuid
    JOIN "Estudiantes"."EstudianteEncargado" ee ON ee.uuid_estudiante = e.uuid AND ee.es_principal = true
    JOIN "Estudiantes"."Encargados" enc ON enc.uuid = ee.uuid_encargado
    JOIN "Estudiantes"."InformacionGeneral" i2 ON i2.uuid = enc.uuid_info_general
    JOIN "Administracion"."Grados" g ON g.uuid = e.uuid_grado
    WHERE m.uuid_comprobante IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "Pagos"."ComprobantePago" c 
      WHERE c.uuid = m.uuid_comprobante AND c.estado = 'Pendiente'
    )
      WHERE enc = '9bbf9712-386f-4fbf-a01f-02a5d1f66303'
  `;

  const result = await db.query(query);
  return result.rows;
};

// Simulación: padres
const generarPDF = (datos) =>
  new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text("Comprobante de Matrícula Pendiente", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Encargado: ${datos.nombre_encargado}`);
    doc.text(`Estudiante: ${datos.nombre_estudiante}`);
    doc.text(`Grado: ${datos.nombre_grado} - Sección: ${datos.seccion}`);
    doc.text(`Monto: L. ${datos.total}`);
    doc.text(`Fecha de Matrícula: ${new Date(datos.fecha_matricula).toLocaleDateString()}`);
    doc.text(`Fecha de Envío: ${new Date().toLocaleDateString()}`);
    doc.end();
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "ajvb2002@gmail.com", 
      pass: "xmruvtwenvhyzkon", 
    },
  });
cron.schedule("* * * * *", async () => {
  console.log("🚀 Ejecutando CRON de comprobantes de matrícula...");

  try {
    const registros = await obtenerMatriculasPendientes();

    for (const padre of registros) {
      const pdf = await generarPDF(padre);

      await transporter.sendMail({
        from: '"Sunny Path" <tucorreo@gmail.com>',
        to: padre.correo,
        subject: "Comprobante de Matrícula Pendiente",
        text: `Estimado/a ${padre.nombre_encargado}, adjunto encontrará el comprobante pendiente.`,
        attachments: [{ filename: "comprobante_matricula.pdf", content: pdf }],
      });

      console.log(`✅ Correo enviado a ${padre.nombre_encargado} <${padre.correo}>`);
    }

    if (registros.length === 0) console.log("🟡 No hay comprobantes pendientes.");
  } catch (error) {
    console.error("❌ Error en el CRON de matrícula:", error.message);
  }
});

console.log("🟢 CRON de comprobantes de matrícula ACTIVADO");