SELECT * FROM "Estudiantes".registrar_estudiante(
	'11111111-aaaa-4bbb-8ccc-1234567890ab',  -- p_uuid estudiante
	'22222222-bbbb-4ccc-9ddd-abcdefabcdef',  -- p_uuid_info_general
	'Carlos',                                -- p_primer_nombre
	'Andrés',                                -- p_segundo_nombre
	'Mejía',                                 -- p_primer_apellido
	'López',                                 -- p_segundo_apellido
	'0801190012345',                         -- p_identidad
	'Hondureña',                             -- p_nacionalidad
	'Masculino',                             -- p_genero (enum)
	'2010-03-15',                            -- p_fecha_nacimiento
	14,                                      -- p_edad
	'Col. El Pedregal, Tegucigalpa',         -- p_direccion
	'Segundo',                               -- p_nombre_grado
	'B',                                     -- p_seccion
	false,                                   -- p_es_zurdo
	false,                                   -- p_dif_educacion_fisica
	true,                                    -- p_reaccion_alergica
	'Alergia al polvo y mariscos',           -- p_descripcion_alergica
	'Estudiante',                            -- p_tipo_persona
	'2025-01-15'                             -- p_fecha_admision
);
