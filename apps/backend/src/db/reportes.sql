--Reporte estudiante
SELECT 
    e.numero_estudiante AS "No. Estudiante",
    ig.primer_nombre || ' ' || COALESCE(ig.segundo_nombre, '') || ' ' || 
    ig.primer_apellido || ' ' || COALESCE(ig.segundo_apellido, '') AS "Nombre Completo",
    ig.fecha_nacimiento AS "Fecha Nacimiento",
    ig.edad AS "Edad",
    ig.genero AS "Genero",
    ig.identidad AS "Identidad",
    ig.nacionalidad AS "Nacionalidad",
    ig.direccion AS "Direccion",
    g.nombre_grado || ' ' || g.seccion AS "Grado",
    e.fecha_admision AS "Fecha Admision",
    e.es_zurdo AS "Es Zurdo?",
    e.dif_educacion_fisica AS "Deficit Fisico?",
    e.reaccion_alergica AS "Reaccion Alergica",
    e.descripcion_alergica AS "Descripcion Alergica",
    STRING_AGG(DISTINCT 
        ee.parentesco || ': ' || 
        igenc.primer_nombre || ' ' || COALESCE(igenc.segundo_nombre, '') || ' ' || 
        igenc.primer_apellido || ' ' || COALESCE(igenc.segundo_apellido, ''), 
        '; '
    ) AS "Encargados",
    STRING_AGG(DISTINCT enc.telefono, '; ') AS "Telefonos de Encargados",
    STRING_AGG(DISTINCT enc.correo_electronico, '; ') AS "Correos de Encargados"
FROM "Estudiantes"."Estudiantes" e
JOIN "Estudiantes"."InformacionGeneral" ig ON e.id_info_general = ig.id
JOIN "Administracion"."Grados" g ON e.id_grado = g.id
LEFT JOIN "Estudiantes"."EstudianteEncargado" ee ON e.id = ee.id_estudiante
LEFT JOIN "Estudiantes"."Encargados" enc ON ee.id_encargado = enc.id
LEFT JOIN "Estudiantes"."InformacionGeneral" igenc ON enc.id_info_general = igenc.id
GROUP BY e.id, e.numero_estudiante, ig.id, g.nombre_grado, g.seccion
ORDER BY g.nombre_grado, g.seccion, ig.primer_apellido, ig.primer_nombre;