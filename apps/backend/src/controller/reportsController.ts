import PdfDocument from 'pdfkit';
import fs from 'fs';
import {Request, Response} from "express";

export const generatePaymentsReport = (req: Request, res: Response) => 
    {
        const doc = new PdfDocument();
        const fileName = `reporte_pagos_${new Date().getTime()}.pdf`;
        const filePath = `./reports/${fileName}`;

        doc.pipe(fs.createWriteStream(filePath));
        doc.fontSize(18).text('Reporte de Pagos', {align: 'center'});

        const pagos = [
            { estudiante: "Juan Pérez", monto: 150, fecha: "2025-03-15" },
            { estudiante: "María Gómez", monto: 200, fecha: "2025-03-14" },
        ];

        doc.moveDown();
        pagos.forEach((pago) => {
            doc.text(`Estudiante: ${pago.estudiante}`);
            doc.text(`Monto: ${pago.monto}`);
            doc.text(`Fecha: ${pago.fecha}`);
            doc.moveDown();
        });

        doc.end();

        doc.on("end", () => {
            res.download(filePath, fileName, ()=> {
                fs.unlinkSync(filePath
                );
            })
        })
    }