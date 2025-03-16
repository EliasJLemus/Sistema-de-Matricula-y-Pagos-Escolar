--Reporte estudiante
SELECT 
    e.numero_estudiante AS "Código Estudiante",
    CONCAT(ig.primer_nombre, ' ', ig.segundo_nombre) AS "Nombres",
    CONCAT(ig.primer_apellido, ' ', ig.segundo_apellido) AS "Apellidos",
    ig.identidad AS "Número de Identidad",
    ig.nacionalidad AS "Nacionalidad",
    ig.genero AS "Género",
    ig.fecha_nacimiento AS "Fecha de Nacimiento",
    ig.edad AS "Edad",
    ig.direccion AS "Dirección",
    g.nombre_grado AS "Grado",
    g.seccion AS "Sección",
    CASE WHEN e.es_zurdo THEN 'Sí' ELSE 'No' END AS "Es Zurdo",
    CASE WHEN e.dif_educacion_fisica THEN 'Sí' ELSE 'No' END AS "Dificultad en Educación Física",
    CASE WHEN e.reaccion_alergica THEN 'Sí' ELSE 'No' END AS "Tiene Alergias",
    e.descripcion_alergica AS "Descripción de Alergias",
    e.fecha_admision AS "Fecha de Admisión",
    ARRAY_TO_STRING(
        ARRAY(
            SELECT CONCAT(
                enc.numero_encargado, ' - ',
                ig_enc.primer_nombre, ' ', ig_enc.segundo_nombre, ' ',
                ig_enc.primer_apellido, ' ', ig_enc.segundo_apellido, ' | ',
                ee.parentesco, ' | Tel: ', enc.telefono, ' | Email: ', enc.correo_electronico
            )
            FROM "Estudiantes"."EstudianteEncargado" ee
            JOIN "Estudiantes"."Encargados" enc ON ee.id_encargado = enc.id
            JOIN "Estudiantes"."InformacionGeneral" ig_enc ON enc.id_info_general = ig_enc.id
            WHERE ee.id_estudiante = e.id
        ), 
        E'\n'
    ) AS "Información de Encargados"
FROM "Estudiantes"."Estudiantes" e
JOIN "Estudiantes"."InformacionGeneral" ig ON e.id_info_general = ig.id
LEFT JOIN "Administracion"."Grados" g ON e.id_grado = g.id;

--REPORTE MATRICULA AÑO 2025
SELECT 
    e.numero_estudiante AS "Código Estudiante",
    CONCAT(ig.primer_nombre, ' ', COALESCE(ig.segundo_nombre, '')) AS "Nombres",
    CONCAT(ig.primer_apellido, ' ', COALESCE(ig.segundo_apellido, '')) AS "Apellidos",
    ig.identidad AS "Número de Identidad",
    ig.genero AS "Género",
    ig.edad AS "Edad",
    g.nombre_grado AS "Grado",
    g.seccion AS "Sección",
    g.year_electivo AS "Año Electivo",
    m.decha_matricula AS "Fecha de Matrícula",
    m.year_academico AS "Año Académico",
    CASE 
        WHEN m.estado = 'Pendiente' THEN 'PENDIENTE'
        WHEN m.estado = 'Pagado' THEN 'PAGADO'
        ELSE m.estado::TEXT
    END AS "Estado de Matrícula",
    ppm.tarifa AS "Tarifa de Matrícula",
    ppm.vencimiento AS "Fecha de Vencimiento",
    CONCAT(
        (SELECT COUNT(*) 
         FROM "Estudiantes"."EstudianteEncargado" ee 
         WHERE ee.id_estudiante = e.id), 
        ' encargado(s)'
    ) AS "Cantidad de Encargados",
    b.nombre_beca AS "Beca Aplicada",
    b.descuento AS "Descuento (%)",
    CASE 
        WHEN b.id IS NOT NULL AND b.estado = 'Activa' THEN (ppm.tarifa - (ppm.tarifa * b.descuento / 100))
        ELSE ppm.tarifa
    END AS "Total a Pagar"
FROM "Pagos"."Matricula" m
JOIN "Estudiantes"."Estudiantes" e ON m.id_estudiante = e.id
JOIN "Estudiantes"."InformacionGeneral" ig ON e.id_info_general = ig.id
JOIN "Pagos"."PlanPagoMatricula" ppm ON m.id_plan_matricula = ppm.id
JOIN "Administracion"."Grados" g ON e.id_grado = g.id
LEFT JOIN "Pagos"."Becas" b ON b.id = (
    SELECT bec.id 
    FROM "Pagos"."Becas" bec
    JOIN "Pagos"."Mensualidad" men ON men.id_beca = bec.id
    WHERE men.id_estudiante = e.id
    ORDER BY men.fecha_inicio DESC
    LIMIT 1
)
WHERE m.year_academico = 2025
ORDER BY g.nombre_grado, g.seccion, e.numero_estudiante;


--REPORT MENSUALIDADES
SELECT
    e.numero_estudiante AS "Número de Estudiante",
    ig.primer_nombre || ' ' || ig.primer_apellido AS "Nombre Completo",
    g.nombre_grado AS "Grado",
    m.fecha_vencimiento AS "Fecha de Vencimiento",
    m.subtotal AS "Subtotal (Sin Descuento)",
    COALESCE(b.descuento, 0) || '%' AS "Descuento Aplicado",
    m.total AS "Total a Pagar",
    m.estado AS "Estado de Pago"
FROM "Pagos"."Mensualidad" m
INNER JOIN "Estudiantes"."Estudiantes" e ON m.id_estudiante = e.id
INNER JOIN "Estudiantes"."InformacionGeneral" ig ON e.id_info_general = ig.id
INNER JOIN "Administracion"."Grados" g ON e.id_grado = g.id
LEFT JOIN "Pagos"."Becas" b ON m.id_beca = b.id
WHERE m.estado IN ('Pendiente', 'Pagado')
ORDER BY "Estado de Pago", "Nombre Completo";

--REPORT BECAS
SELECT
    b.nombre_beca AS "Nombre de la Beca",
    b.descuento || '%' AS "Porcentaje de Descuento",
    b.estado AS "Estado de la Beca",
    COUNT(DISTINCT m.id_estudiante) AS "Estudiantes Beneficiados",
    STRING_AGG(e.numero_estudiante::TEXT, ', ') AS "Números de Estudiantes"
FROM "Pagos"."Becas" b
LEFT JOIN "Pagos"."Mensualidad" m ON b.id = m.id_beca
LEFT JOIN "Estudiantes"."Estudiantes" e ON m.id_estudiante = e.id
GROUP BY b.id
ORDER BY "Estudiantes Beneficiados" DESC;

--REPORTE INGRESOS VS DEUDAS
SELECT
    'Matrículas' AS "Tipo de Pago",
    SUM(CASE WHEN pp.estado = 'Pagado' THEN pp.tarifa ELSE 0 END) AS "Ingresos ($)",
    SUM(CASE WHEN pp.estado = 'Pendiente' THEN pp.tarifa ELSE 0 END) AS "Deudas ($)"
FROM "Pagos"."PlanPagoMatricula" pp
UNION ALL
SELECT
    'Mensualidades',
    SUM(CASE WHEN m.estado = 'Pagado' THEN m.total ELSE 0 END),
    SUM(CASE WHEN m.estado = 'Pendiente' THEN m.total ELSE 0 END)
FROM "Pagos"."Mensualidad" m
UNION ALL
SELECT
    'Nivelados',
    SUM(n.monto_pagado),
    SUM(n.saldo_restante)
FROM "Pagos"."Nivelado" n
ORDER BY "Tipo de Pago";


--Reporte antiguedad del estudiante
SELECT
    e.numero_estudiante AS "Número de Estudiante",
    ig.primer_nombre || ' ' || ig.primer_apellido AS "Nombre del Estudiante",
    e.fecha_admision AS "Fecha de Admisión",
    EXTRACT(YEAR FROM AGE(CURRENT_DATE, e.fecha_admision)) || ' años' AS "Antigüedad"
FROM "Estudiantes"."Estudiantes" e
INNER JOIN "Estudiantes"."InformacionGeneral" ig ON e.id_info_general = ig.id
ORDER BY "Antigüedad" DESC;