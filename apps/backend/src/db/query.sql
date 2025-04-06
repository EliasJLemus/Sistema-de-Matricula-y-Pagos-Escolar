
/*==========================
= ESQUEMA: ESTUDIANTES =
==========================*/

CREATE TYPE genero AS ENUM ('Masculino', 'Femenino');

CREATE TABLE "Estudiantes"."InformacionGeneral" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	primer_nombre VARCHAR(100),
	segundo_nombre VARCHAR(100),
	primer_apellido VARCHAR(100),
	segundo_apellido VARCHAR(100),
	nacionalidad VARCHAR(50),
	identidad VARCHAR(20) UNIQUE NOT NULL,
	genero genero,
	fecha_nacimiento DATE NOT NULL,
	edad INT,
	direccion VARCHAR(200),
	tipo_persona VARCHAR(20) CHECK (tipo_persona IN ('Estudiante', 'Encargado')) NOT NULL
);

CREATE UNIQUE INDEX idx_tipo_persona ON "Estudiantes"."InformacionGeneral" (uuid) WHERE tipo_persona = 'Estudiante';
CREATE UNIQUE INDEX idx_tipo_persona_encargado ON "Estudiantes"."InformacionGeneral" (uuid) WHERE tipo_persona = 'Encargado';

CREATE TABLE "Estudiantes"."Encargados" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	numero_encargado INT UNIQUE NOT NULL,
	uuid_info_general UUID NOT NULL,
	correo_electronico VARCHAR(100),
	telefono VARCHAR(10),
	FOREIGN KEY (uuid_info_general) REFERENCES "Estudiantes"."InformacionGeneral"(uuid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Estudiantes"."Estudiantes" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	numero_estudiante INT UNIQUE NOT NULL,
	uuid_info_general UUID NOT NULL,
	uuid_grado UUID,
	es_zurdo BOOLEAN,
	dif_educacion_fisica BOOLEAN,  
	reaccion_alergica BOOLEAN,
	descripcion_alergica TEXT,
	fecha_admision DATE,
	estado TEXT,
	FOREIGN KEY (uuid_info_general) REFERENCES "Estudiantes"."InformacionGeneral"(uuid) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (uuid_grado) REFERENCES "Administracion"."Grados"(uuid) ON UPDATE CASCADE
);

CREATE TABLE "Estudiantes"."EstudianteEncargado" (
	uuid_estudiante UUID,
	uuid_encargado UUID,
	parentesco VARCHAR(30),
	es_principal BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (uuid_estudiante, uuid_encargado),
	FOREIGN KEY (uuid_estudiante) REFERENCES "Estudiantes"."Estudiantes"(uuid) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY (uuid_encargado) REFERENCES "Estudiantes"."Encargados"(uuid) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE OR REPLACE FUNCTION "Estudiantes".validar_tipo_persona()
RETURNS TRIGGER AS $$
BEGIN
	IF TG_TABLE_NAME = 'Estudiantes' THEN
		IF (SELECT tipo_persona FROM "Estudiantes"."InformacionGeneral" WHERE uuid = NEW.uuid_info_general) <> 'Estudiante' THEN
			RAISE EXCEPTION 'El UUID no corresponde a un estudiante';
		END IF;
	ELSIF TG_TABLE_NAME = 'Encargados' THEN
		IF (SELECT tipo_persona FROM "Estudiantes"."InformacionGeneral" WHERE uuid = NEW.uuid_info_general) <> 'Encargado' THEN
			RAISE EXCEPTION 'El UUID no corresponde a un encargado';
		END IF;
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_estudiante
BEFORE INSERT ON "Estudiantes"."Estudiantes"
FOR EACH ROW EXECUTE FUNCTION "Estudiantes".validar_tipo_persona();

CREATE TRIGGER trg_validar_encargado
BEFORE INSERT ON "Estudiantes"."Encargados"
FOR EACH ROW EXECUTE FUNCTION "Estudiantes".validar_tipo_persona();


/*===============================
= ESQUEMA: ADMINISTRACION =
===============================*/

CREATE TABLE "Administracion"."Grados" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre_grado VARCHAR(20),
	seccion VARCHAR(10),
	capacidad_maxima INT,
	year_electivo INT,
	nivel VARCHAR(30)
);

CREATE TYPE rol AS ENUM ('directivo', 'administracion');

CREATE TABLE "Administracion"."Usuarios" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre_usuario VARCHAR(100),
	correo VARCHAR(100) UNIQUE,
	password VARCHAR(150),
	rol rol NOT NULL
);


/*======================
= ESQUEMA: PAGOS =
======================*/

CREATE TYPE estado AS ENUM ('Activa', 'Inactiva');
CREATE TYPE estado_pagos AS ENUM('Pendiente', 'Pagado');
CREATE TYPE tipo_pago AS ENUM('Normal', 'Nivelado');

CREATE TABLE "Pagos"."Becas" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nombre_beca VARCHAR(50),
	descuento INT,
	estado estado,
	uuid_autorizado_por UUID,
	FOREIGN KEY (uuid_autorizado_por) REFERENCES "Administracion"."Usuarios"(uuid)
);

CREATE TABLE "Pagos"."PlanPagoMatricula" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	tipo VARCHAR(50),
	vencimiento DATE,
	tarifa DECIMAL(10,2),
	estado estado_pagos,
	nivel VARCHAR(30),
	year_academico INT
);
ALTER TABLE "Pagos"."PlanPagoMatricula"
  ADD CONSTRAINT fk_plan_matricula_nivel FOREIGN KEY (nivel) REFERENCES "Administracion"."Niveles"(nivel) ON UPDATE CASCADE;


CREATE TABLE "Pagos"."PlanPagoMensualidad" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	tarifa DECIMAL(7,2),
	periodo INT,
	nivel VARCHAR(30),
	estado estado_pagos,
	year_academico INT
);
ALTER TABLE "Pagos"."PlanPagoMensualidad"
  ADD CONSTRAINT fk_plan_mensualidad_nivel FOREIGN KEY (nivel) REFERENCES "Administracion"."Niveles"(nivel) ON UPDATE CASCADE;

CREATE TABLE "Pagos"."PlanPagoNivelado" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	nivel VARCHAR(30),
	monto_total DECIMAL(10,2),
	cuotas DECIMAL(10,2),
	fecha_inicio DATE,
	fecha_fin DATE,
	estado estado_pagos,
    year_academico INT
);
ALTER TABLE "Pagos"."PlanPagoNivelado"
  ADD CONSTRAINT fk_plan_nivelado_nivel FOREIGN KEY (nivel) REFERENCES "Administracion"."Niveles"(nivel) ON UPDATE CASCADE;

CREATE TABLE "Pagos"."Matricula" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	uuid_estudiante UUID,
	uuid_plan_matricula UUID,
	fecha_matricula DATE,
	year_academico INT,
	estado estado_pagos,
	FOREIGN KEY (uuid_estudiante) REFERENCES "Estudiantes"."Estudiantes"(uuid) ON UPDATE CASCADE,
	FOREIGN KEY (uuid_plan_matricula) REFERENCES "Pagos"."PlanPagosMatricula"(uuid)
);

CREATE TABLE "Pagos"."Mensualidad" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	uuid_plan_mensualidad UUID,
	recargo DECIMAL(5,2),
	uuid_beca UUID,
	fecha_inicio DATE,
	fecha_vencimiento DATE,
	estado estado_pagos,
	uuid_estudiante UUID,
	subtotal DECIMAL(10,2),
	total DECIMAL(10,2),
	FOREIGN KEY (uuid_estudiante) REFERENCES "Estudiantes"."Estudiantes"(uuid) ON UPDATE CASCADE,
	FOREIGN KEY (uuid_plan_mensualidad) REFERENCES "Pagos"."PlanPagoMensualidad"(uuid),
	FOREIGN KEY (uuid_beca) REFERENCES "Pagos"."Becas"(uuid) ON UPDATE CASCADE
);

CREATE TABLE "Pagos"."Nivelado" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	uuid_estudiante UUID,
	uuid_plan_nivelado UUID,
	monto_pagado DECIMAL(10,2),
	fecha_pago DATE,
    fecha_inicio DATE,
    feca_fin Date,
	recargo DECIMAL(5,2),
	saldo_restante DECIMAL(10,2),
	uuid_beca UUID,
	estado estado_pagos,
	FOREIGN KEY (uuid_estudiante) REFERENCES "Estudiantes"."Estudiantes"(uuid) ON UPDATE CASCADE,
	FOREIGN KEY (uuid_plan_nivelado) REFERENCES "Pagos"."PlanPagoMensualidad"(uuid),
	FOREIGN KEY (uuid_beca) REFERENCES "Pagos"."Becas"(uuid) ON UPDATE CASCADE
);

CREATE TABLE "Pagos"."PlanPagoDetallado" (
	uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	uuid_estudiante UUID,
	tipo_pago tipo_pago,
	uuid_plan_matricula UUID,
	uuid_plan_mensualidad UUID,
	uuid_plan_nivelado UUID,
	descripcion TEXT,
	periodicidad VARCHAR(20),
	uuid_usuario UUID,
	fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (uuid_estudiante) REFERENCES "Estudiantes"."Estudiantes"(uuid) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (uuid_plan_matricula) REFERENCES "Pagos"."PlanPagosMatricula"(uuid) ON UPDATE CASCADE,
	FOREIGN KEY (uuid_plan_mensualidad) REFERENCES "Pagos"."PlanPagoMensualidad"(uuid) ON UPDATE CASCADE,
	FOREIGN KEY (uuid_plan_nivelado) REFERENCES "Pagos"."PlanPagoNivelado"(uuid) ON UPDATE CASCADE,
	FOREIGN KEY (uuid_usuario) REFERENCES "Administracion"."Usuarios"(uuid)
);

/*TRIGGERRS*/
ALTER TABLE "Estudiantes"."Estudiantes"
ADD COLUMN codigo_estudiante VARCHAR(20) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_estudiante()
RETURNS TRIGGER AS $$
DECLARE
    secuencia INT;
BEGIN
    SELECT COUNT(*) + 1 INTO secuencia
    FROM "Estudiantes"."Estudiantes"
    WHERE EXTRACT(YEAR FROM fecha_admision) = EXTRACT(YEAR FROM NEW.fecha_admision);

    NEW.codigo_estudiante := 
        'EST-' || EXTRACT(YEAR FROM NEW.fecha_admision) || '-' || LPAD(secuencia::TEXT, 4, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_generar_codigo_estudiante
BEFORE INSERT ON "Estudiantes"."Estudiantes"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_estudiante();

ALTER TABLE "Estudiantes"."Encargados"
ADD COLUMN codigo_encargado VARCHAR(20) UNIQUE;


CREATE OR REPLACE FUNCTION generar_codigo_encargado()
RETURNS TRIGGER AS $$
DECLARE
    secuencia INT;
BEGIN
    SELECT COUNT(*) + 1 INTO secuencia
    FROM "Estudiantes"."Encargados";

    NEW.codigo_encargado := 'ENC-' || LPAD(secuencia::TEXT, 4, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_encargado
BEFORE INSERT ON "Estudiantes"."Encargados"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_encargado();

CREATE OR REPLACE FUNCTION generar_codigo_grado()
RETURNS TRIGGER AS $$
BEGIN
    NEW.codigo_grado := 'GRD-' ||
                        TRIM(NEW.nombre_grado) || TRIM(NEW.seccion) || '-' ||
                        NEW.year_electivo;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TABLE "Administracion"."Niveles" (
  nivel VARCHAR(30) PRIMARY KEY
);
INSERT INTO "Administracion"."Niveles" (nivel) VALUES
('Pre-Basica'), ('Basica'), ('Secundaria');
ALTER TABLE "Administracion"."Grados"
  ADD CONSTRAINT fk_nivel FOREIGN KEY (nivel) REFERENCES "Administracion"."Niveles"(nivel) ON UPDATE CASCADE;


CREATE TRIGGER trg_generar_codigo_grado
BEFORE INSERT ON "Administracion"."Grados"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_grado();

CREATE OR REPLACE FUNCTION generar_codigo_usuario()
RETURNS TRIGGER AS $$
DECLARE
    prefijo TEXT;
    parte_nombre TEXT;
    parte_apellido TEXT;
BEGIN
    -- Definir prefijo según el rol
    IF NEW.rol = 'administracion' THEN
        prefijo := 'AD';
    ELSIF NEW.rol = 'directivo' THEN
        prefijo := 'DI';
    ELSE
        prefijo := 'XX'; -- fallback
    END IF;

    
    parte_nombre := SPLIT_PART(NEW.nombre_usuario, ' ', 1);
    parte_apellido := SPLIT_PART(NEW.nombre_usuario, ' ', 2);

    NEW.codigo_usuario := prefijo || '-' || 
                          UPPER(LEFT(parte_nombre, 1) || parte_apellido);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_usuario
BEFORE INSERT ON "Administracion"."Usuarios"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_usuario();

ALTER TABLE "Pagos"."Becas"
ADD COLUMN codigo_beca VARCHAR(20) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_beca()
RETURNS TRIGGER AS $$
DECLARE
    sufijo TEXT;
BEGIN
    -- Detectar sufijo basado en el nombre de la beca
    IF NEW.nombre_beca ILIKE '%matricula%' THEN
        sufijo := 'MAT';
    ELSIF NEW.nombre_beca ILIKE '%excelencia%' THEN
        sufijo := 'EXC';
    ELSIF NEW.nombre_beca ILIKE '%social%' THEN
        sufijo := 'SOC';
    ELSE
        sufijo := 'DSC'; -- genérico de "descuento"
    END IF;

    NEW.codigo_beca := 'BCA-' || NEW.descuento || sufijo;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_beca
BEFORE INSERT ON "Pagos"."Becas"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_beca();

ALTER TABLE "Pagos"."Matricula"
ADD COLUMN codigo_matricula VARCHAR(25) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_matricula()
RETURNS TRIGGER AS $$
DECLARE
    secuencia INT;
BEGIN
    -- Contar cuántas matrículas existen para ese año
    SELECT COUNT(*) + 1 INTO secuencia
    FROM "Pagos"."Matricula"
    WHERE year_academico = NEW.year_academico;

    -- Generar código
    NEW.codigo_matricula := 
        'MAT-' || NEW.year_academico || '-' || LPAD(secuencia::TEXT, 4, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_matricula
BEFORE INSERT ON "Pagos"."Matricula"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_matricula();

ALTER TABLE "Pagos"."Mensualidad"
ADD COLUMN codigo_mensualidad VARCHAR(30) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_mensualidad()
RETURNS TRIGGER AS $$
DECLARE
    cod_estudiante TEXT;
BEGIN
    -- Buscar el código del estudiante
    SELECT codigo_estudiante INTO cod_estudiante
    FROM "Estudiantes"."Estudiantes"
    WHERE uuid = NEW.uuid_estudiante;

    -- Generar el código final
    NEW.codigo_mensualidad := 'MEN-' ||
                               TO_CHAR(NEW.fecha_inicio, 'YYYY-MM') || '-' ||
                               cod_estudiante;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_mensualidad
BEFORE INSERT ON "Pagos"."Mensualidad"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_mensualidad();

ALTER TABLE "Pagos"."Nivelado"
ADD COLUMN codigo_nivelado VARCHAR(30) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_nivelado()
RETURNS TRIGGER AS $$
DECLARE
    cod_estudiante TEXT;
BEGIN
    -- Obtener el código del estudiante
    SELECT codigo_estudiante INTO cod_estudiante
    FROM "Estudiantes"."Estudiantes"
    WHERE uuid = NEW.uuid_estudiante;

    -- Generar código nivelado
    NEW.codigo_nivelado := 'NIV-' ||
                            EXTRACT(YEAR FROM NEW.fecha_pago)::TEXT || '-' ||
                            cod_estudiante;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_nivelado
BEFORE INSERT ON "Pagos"."Nivelado"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_nivelado();

ALTER TABLE "Pagos"."PlanPagoDetallado"
ADD COLUMN codigo_plan_detallado VARCHAR(35) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_plan_detallado()
RETURNS TRIGGER AS $$
DECLARE
    cod_estudiante TEXT;
    tipo TEXT;
    anio TEXT;
BEGIN
    -- Obtener el código del estudiante
    SELECT codigo_estudiante INTO cod_estudiante
    FROM "Estudiantes"."Estudiantes"
    WHERE uuid = NEW.uuid_estudiante;

    -- Determinar tipo de plan
    tipo := UPPER(LEFT(NEW.tipo_pago::TEXT, 3));  -- NOR o NIV

    -- Año de modificación (o año actual si es NULL)
    anio := TO_CHAR(COALESCE(NEW.fecha_modificacion, CURRENT_DATE), 'YYYY');

    -- Armar el código
    NEW.codigo_plan_detallado := 'DET-' || tipo || '-' || anio || '-' || cod_estudiante;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_plan_detallado
BEFORE INSERT ON "Pagos"."PlanPagoDetallado"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_plan_detallado();

ALTER TABLE "Pagos"."PlanPagoMensualidad"
ADD COLUMN codigo_plan_mensualidad VARCHAR(30) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_plan_mensualidad()
RETURNS TRIGGER AS $$
DECLARE
    grado TEXT;
    seccion TEXT;
    anio TEXT;
BEGIN
    -- Obtener grado y seccion
    SELECT nombre_grado, seccion INTO grado, seccion
    FROM "Administracion"."Grados"
    WHERE uuid = NEW.uuid_grado;

    anio := TO_CHAR(CURRENT_DATE, 'YYYY');

    NEW.codigo_plan_mensualidad := 
        'PMEN-G' || grado || seccion || '-' || anio;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_plan_mensualidad
BEFORE INSERT ON "Pagos"."PlanPagoMensualidad"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_plan_mensualidad();

ALTER TABLE "Pagos"."PlanPagoMatricula"
ADD COLUMN codigo_plan_matricula VARCHAR(35) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_plan_matricula()
RETURNS TRIGGER AS $$
DECLARE
    grado TEXT;
    seccion TEXT;
    anio TEXT;
    secuencia INT;
BEGIN
    -- Obtener grado y seccion
    SELECT nombre_grado, seccion INTO grado, seccion
    FROM "Administracion"."Grados"
    WHERE uuid = NEW.uuid_grado;

    anio := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Contar cuántos planes de matrícula hay para ese grado y año
    SELECT COUNT(*) + 1 INTO secuencia
    FROM "Pagos"."PlanPagoMatricula" pm
    WHERE pm.uuid_grado = NEW.uuid_grado
    AND TO_CHAR(pm.vencimiento, 'YYYY') = anio;

    NEW.codigo_plan_matricula := 
        'PMAT-G' || grado || seccion || '-' || anio || '-' || LPAD(secuencia::TEXT, 3, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_plan_matricula
BEFORE INSERT ON "Pagos"."PlanPagoMatricula"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_plan_matricula();

ALTER TABLE "Pagos"."PlanPagoNivelado"
ADD COLUMN codigo_plan_nivelado VARCHAR(35) UNIQUE;

CREATE OR REPLACE FUNCTION generar_codigo_plan_nivelado()
RETURNS TRIGGER AS $$
DECLARE
    grado TEXT;
    seccion TEXT;
    anio TEXT;
    secuencia INT;
BEGIN
    -- Obtener grado y sección
    SELECT nombre_grado, seccion INTO grado, seccion
    FROM "Administracion"."Grados"
    WHERE uuid = NEW.uuid_grado;

    anio := TO_CHAR(CURRENT_DATE, 'YYYY');

    -- Contar los planes nivelados ya registrados para ese grado y año
    SELECT COUNT(*) + 1 INTO secuencia
    FROM "Pagos"."PlanPagoNivelado" p
    WHERE p.uuid_grado = NEW.uuid_grado
    AND TO_CHAR(p.fecha_inicio, 'YYYY') = anio;

    -- Generar el código
    NEW.codigo_plan_nivelado := 
        'PNIV-G' || grado || seccion || '-' || anio || '-' || LPAD(secuencia::TEXT, 3, '0');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generar_codigo_plan_nivelado
BEFORE INSERT ON "Pagos"."PlanPagoNivelado"
FOR EACH ROW
EXECUTE FUNCTION generar_codigo_plan_nivelado();

/**
COMPROBANTE
*/
CREATE TYPE comprobante_estado AS ENUM ('Pendiente', 'Enviado', 'Rechazado', 'Aceptado');

CREATE TABLE "Pagos"."ComprobantePago" (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_imagen TEXT, -- ahora puede ser NULL
  estado comprobante_estado DEFAULT 'Pendiente',
  fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  observaciones TEXT
);

ALTER TABLE "Pagos"."Matricula"
ADD COLUMN uuid_comprobante UUID REFERENCES "Pagos"."ComprobantePago"(uuid);

ALTER TABLE "Pagos"."Mensualidad"
ADD COLUMN uuid_comprobante UUID REFERENCES "Pagos"."ComprobantePago"(uuid);

ALTER TABLE "Pagos"."Nivelado"
ADD COLUMN uuid_comprobante UUID REFERENCES "Pagos"."ComprobantePago"(uuid);


//*SE REPITE PARA LAS DEMAS*/
CREATE OR REPLACE FUNCTION crear_comprobante_para_matricula()
RETURNS TRIGGER AS $$
DECLARE
  v_uuid_comprobante UUID;
BEGIN
  INSERT INTO "Pagos"."ComprobantePago"(estado) VALUES ('Pendiente')
  RETURNING uuid INTO v_uuid_comprobante;

  NEW.uuid_comprobante := v_uuid_comprobante;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_crear_comprobante_matricula
BEFORE INSERT ON "Pagos"."Matricula"
FOR EACH ROW
EXECUTE FUNCTION crear_comprobante_para_matricula();

