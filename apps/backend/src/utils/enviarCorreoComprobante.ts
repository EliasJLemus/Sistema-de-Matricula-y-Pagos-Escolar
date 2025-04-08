import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

// Datos esperados: los que devuelve datosCorreoMatricula()
type DatosCorreoMatricula = {
  nombre_encargado: string;
  correo: string;
  nombre_estudiante: string;
  nombre_grado: string;
  seccion: string;
  tarifa_base: number;
  descuento_aplicado: number;
  total: number;
  fecha_matricula: string;
  codigo_matricula: string;
  uuid_comprobante: string;
};

export const enviarCorreoComprobante = async (datos: DatosCorreoMatricula) => {
  try {
    console.log("📧 Enviando correo de comprobante...");
    const pdfBuffer = await generarPDF(datos);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "ajvb2002@gmail.com",
        pass: "xmruvtwenvhyzkon",
      },
    });

    await transporter.sendMail({
      from: `"Sunny Path" <ajvb2002@gmail.com>`,
      to: datos.correo,
      subject: "Adjunte su Comprobante de Pago",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc;">
          <h2 style="color: #2e7d32;">📄 Comprobante de Matrícula Pendiente</h2>
          <p>Hola <strong>${datos.nombre_encargado}</strong>,</p>
          <p>Hemos registrado la matrícula del estudiante <strong>${datos.nombre_estudiante}</strong> con el siguiente detalle:</p>
          <ul>
            <li><strong>Grado:</strong> ${datos.nombre_grado} - ${datos.seccion}</li>
            <li><strong>Monto base:</strong> L. ${datos.tarifa_base}</li>
            <li><strong>Descuento aplicado:</strong> L. ${datos.descuento_aplicado}</li>
            <li><strong>Total a pagar:</strong> L. ${datos.total}</li>
            <li><strong>Fecha de matrícula:</strong> ${new Date(datos.fecha_matricula).toLocaleDateString()}</li>
            <li><strong>Código de matrícula:</strong> ${datos.codigo_matricula}</li>
          </ul>
          <p>Por favor, haga clic en el botón para subir la imagen del comprobante:</p>
          <a href="http://localhost:5173/subir-comprobante?comprobante=${datos.uuid_comprobante}"
            style="display:inline-block;background:#2e7d32;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;margin-top:15px;">
            Subir Comprobante
          </a>
          <p style="margin-top: 30px; font-size: 0.9em; color: #555;">Gracias por su colaboración. Este paso es necesario para emitir su factura oficial.</p>
        </div>
      `,
      attachments: [
        {
          filename: "comprobante_matricula.pdf",
          content: pdfBuffer,
        },
      ],
    });

    console.log(`✅ Correo enviado a ${datos.correo}`);
  } catch (error: any) {
    console.error("❌ Error al enviar el correo de comprobante:", error.message);
  }
};

// PDF Generator
const generarPDF = (datos: DatosCorreoMatricula) =>
  new Promise<Buffer>((resolve) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text("Comprobante de Matrícula", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Encargado: ${datos.nombre_encargado}`);
    doc.text(`Estudiante: ${datos.nombre_estudiante}`);
    doc.text(`Grado: ${datos.nombre_grado} - Sección: ${datos.seccion}`);
    doc.text(`Monto Base: L. ${datos.tarifa_base}`);
    doc.text(`Descuento Aplicado: L. ${datos.descuento_aplicado}`);
    doc.text(`Total a Pagar: L. ${datos.total}`);
    doc.text(`Fecha de Matrícula: ${new Date(datos.fecha_matricula).toLocaleDateString()}`);
    doc.text(`Código Matrícula: ${datos.codigo_matricula}`);
    doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`);
    doc.end();
  });
