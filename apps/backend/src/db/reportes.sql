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