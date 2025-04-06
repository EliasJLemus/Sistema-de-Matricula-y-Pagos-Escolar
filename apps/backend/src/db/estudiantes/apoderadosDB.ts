import cron from "node-cron";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

// Simulación: padres
const obtenerPadresParaEnvio = async () => [
  {
    nombre: "Carlos López",
    correo: "av2002273@gmail.com", // poné tu correo real para pruebas
    estudiante: "Luis López",
    grado: "3ro Primaria",
    monto: "L.1,200.00",
    fecha_pago: "05/04/2025",
  },
];

// PDF Generator
const generarPDF = async (padre) =>
  new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(18).text("Comprobante de Pago", { align: "center" }).moveDown();
    doc.fontSize(14).text(`Padre: ${padre.nombre}`);
    doc.text(`Estudiante: ${padre.estudiante}`);
    doc.text(`Grado: ${padre.grado}`);
    doc.text(`Monto pagado: ${padre.monto}`);
    doc.text(`Fecha de pago: ${padre.fecha_pago}`);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`);

    doc.end();
  });

// ✅ Transporter usando Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "ajvb2002@gmail.com", 
    pass: "xmruvtwenvhyzkon", 
  },
});

// CRON JOB (cada minuto, para probar)
cron.schedule("* * * * *", async () => {
  console.log("⏰ Cron ejecutado");

  const padres = await obtenerPadresParaEnvio();

  for (const padre of padres) {
    const pdfBuffer = await generarPDF(padre);

    try {
        await transporter.sendMail({
            from: `"Sunny Path" <ajvb2002@gmail.com>`,
            to: padre.correo,
            subject: "Adjunte su Comprobante de Pago",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc;">
                <h2 style="color: #2e7d32;">📄 Comprobante de Pago Pendiente</h2>
                <p>Hola <strong>${padre.nombre}</strong>,</p>
                <p>Hemos registrado que debe subir el comprobante correspondiente al pago de:</p>
                <ul>
                  <li><strong>Estudiante:</strong> ${padre.estudiante}</li>
                  <li><strong>Grado:</strong> ${padre.grado}</li>
                  <li><strong>Monto:</strong> ${padre.monto}</li>
                  <li><strong>Fecha de pago:</strong> ${padre.fecha_pago}</li>
                </ul>
                <p>Por favor, haga clic en el botón de abajo para subir la foto del comprobante:</p>
               <a href="http://localhost:5173/subir-comprobante?padre=${encodeURIComponent(padre.nombre)}"
                style="display:inline-block;background:#2e7d32;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;margin-top:15px;">
                Subir Comprobante
                </a>
                <p style="margin-top: 30px; font-size: 0.9em; color: #555;">Gracias por su colaboración. Este paso es necesario para emitir su factura oficial.</p>
              </div>
            `,
          });
          

      console.log(`✅ Comprobante enviado a ${padre.correo}`);
    } catch (err) {
      console.error(`❌ Error al enviar a ${padre.correo}:`, err.message);
    }
  }
});

console.log("📡 Cron job de envío de comprobantes ACTIVADO");
