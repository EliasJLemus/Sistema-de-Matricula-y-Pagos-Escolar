/*ESQUEMA ESTUDIANTES**/
--Tabla: informacion general
CREATE TABLE "Estudiantes"."InformacionGeneral" (
	id SERIAL PRIMARY KEY,
	primer_nombre VARCHAR(100),
	segundo_nombre VARCHAR(100),
	primer_apellido VARCHAR(100),
	segundo_apellido VARCHAR(100),
	nacionalidad VARCHAR(50),
	identidad VARCHAR(20) UNIQUE NOT NULL,
	genero genero,
	fecha_nacimiento DATE NOT NULL,
	edad INT,
	direccion VARCHAR(200)
)
ALTER TABLE "Estudiantes"."InformacionGeneral" ADD COLUMN tipo_persona VARCHAR(20) CHECK (tipo_persona IN ('Estudiante', 'Encargado'));
CREATE UNIQUE INDEX idx_tipo_persona ON "Estudiantes"."InformacionGeneral" (id) WHERE tipo_persona = 'Estudiante';
CREATE UNIQUE INDEX idx_tipo_persona_encargado ON "Estudiantes"."InformacionGeneral" (id) WHERE tipo_persona = 'Encargado';

ALTER TABLE "Estudiantes"."InformacionGeneral"
ALTER COLUMN tipo_persona SET NOT NULL;


CREATE OR REPLACE FUNCTION "Estudiantes".validar_tipo_persona()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se inserta en Estudiantes, validar que tipo_persona sea 'Estudiante'
    IF TG_TABLE_NAME = 'Estudiantes' THEN
        IF (SELECT tipo_persona FROM "Estudiantes"."InformacionGeneral" WHERE id = NEW.id_info_general) <> 'Estudiante' THEN
            RAISE EXCEPTION 'El ID no corresponde a un estudiante';
        END IF;
    END IF;

    -- Si se inserta en Encargados, validar que tipo_persona sea 'Encargado'
    IF TG_TABLE_NAME = 'Encargados' THEN
        IF (SELECT tipo_persona FROM "Estudiantes"."InformacionGeneral" WHERE id = NEW.id_info_general) <> 'Encargado' THEN
            RAISE EXCEPTION 'El ID no corresponde a un encargado';
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


--tabla: Encargados
CREATE TABLE "Estudiantes"."Encargados" (
	id SERIAL PRIMARY KEY,
	numero_encargado INT UNIQUE NOT NULL,
	id_info_general INT NOT NULL,
	correo_electronico VARCHAR(100),
	telefono VARCHAR(10),

	CONSTRAINT fk_encargados_info_generak FOREIGN KEY (id_info_general) REFERENCES "Estudiantes"."InformacionGeneral" (id) 
	ON DELETE CASCADE 
	ON UPDATE CASCADE 
)

--Tabla: Estudiantes
CREATE TABLE "Estudiantes"."Estudiantes" (
	id SERIAL PRIMARY KEY,
	numero_estudiante INT UNIQUE NOT NULL,
	id_info_general INT NOT NULL,
	id_grado INT,
	es_zurdo BOOLEAN,
	dif_educacion_fisica BOOLEAN,
	reaccion_alergica BOOLEAN,
	descripcion_alergica TEXT,
	fecha_admision DATE,

	CONSTRAINT fk_estudiantes_info_general FOREIGN KEY(id_info_general)
	REFERENCES "Estudiantes"."InformacionGeneral" (id)
	ON UPDATE CASCADE
	ON DELETE CASCADE,

	CONSTRAINT fk_estudiantes_grado FOREIGN KEY(id_grado)
	REFERENCES "Administracion"."Grados"(id)
	ON UPDATE CASCADE
	
)
--tabla: Estudiante-Encargado
CREATE TABLE "Estudiantes"."EstudianteEncargado" (
	id_estudiante INT,
	id_encargado INT,
	parentesco VARCHAR(30),
	
	PRIMARY KEY (id_estudiante, id_encargado),
	FOREIGN KEY (id_estudiante) REFERENCES "Estudiantes"."Estudiantes"(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE,
	
    FOREIGN KEY (id_encargado) REFERENCES "Estudiantes"."Encargados"(id)
	ON DELETE CASCADE
	ON UPDATE CASCADE
)

/*ESQUEMA: ADMINISTRACION*/
--Tabla: Grado
CREATE TABLE "Administracion"."Grados" (
	id SERIAL PRIMARY KEY,
	nombre_grado VARCHAR(20),
	seccion VARCHAR(10),
	capacidad_maxima INT,
	año_electivo INT
)
--Tabla: Usuarios
CREATE TABLE "Administracion"."Usuarios" (
	id SERIAL PRIMARY KEY,
	nombre_usuario VARCHAR (100),
	correo VARCHAR(100) UNIQUE,
	password VARCHAR(150),
	rol rol NOT NULL
)

CREATE TYPE rol AS ENUM ('directivo', 'administracion');

/**ESQUEMA PAGO*/
--Tabla: Becas
CREATE TABLE "Pagos"."Becas" (
	id SERIAL PRIMARY KEY,
	nombre_beca VARCHAR(50),
	descuento INT,
	estado estado,
	id_autorizado_por INT,

	CONSTRAINT fk_becas_usuarios 
	FOREIGN KEY (id_autorizado_por)
	REFERENCES "Administracion"."Usuarios"(id)
)

CREATE TYPE estado AS ENUM ('Activa', 'Inactiva');

--Tabla: Plan matricula
CREATE TABLE "Pagos"."PlanPagosMatricula"(
	id SERIAL PRIMARY KEY,
	tipo VARCHAR(50),
	vencimiento DATE,
	tarifa DECIMAL (10,2),
	estado estado_pagos,
	id_grado INT,

	CONSTRAINT fk_plan_matricula_grado 
	FOREIGN KEY (id_grado) REFERENCES 
	"Administracion"."Grados" (id)
)

CREATE TYPE estado_pagos AS ENUM('Pendiente', 'Pagado')

--Tabla: Plan mensualidad
CREATE TABLE "Pagos"."PlanPagoMensualidad"(
	id SERIAL PRIMARY KEY,
	tarifa DECIMAL(7,2),
	periodo INT,
	id_grado INT,
	estado estado_pagos,

	CONSTRAINT fk_plan_mensualidad_grado 
	FOREIGN KEY (id_grado)
	REFERENCES "Administracion"."Grados" (id)
)

--Tabla: plan Nivelado
CREATE TABLE "Pagos"."PlanPagoNivelado"(
	id SERIAL PRIMARY KEY,
	id_grado INT,
	monto_total DECIMAL(10, 2),
	cuotas DECIMAL(10, 2),
	fecha_inicio DATE,
	fecha_fin DATE,
	estado estado_pagos,

	CONSTRAINT fk_plan_nivelado_grado 
	FOREIGN KEY (id_grado)
	REFERENCES "Administracion"."Grados" (id)
)

--Tabla: Matricula
CREATE TABLE "Pagos"."Matricula" (
	id SERIAL PRIMARY KEY,
	id_estudiante INT,
	id_plan_matricula INT,
	decha_matricula DATE,
	year_academico INT,
	estado estado_pagos,

	CONSTRAINT fk_matricula_estudiante 
	FOREIGN KEY (id_estudiante) REFERENCES
	"Estudiantes"."Estudiantes"(id)
	ON UPDATE CASCADE,

	CONSTRAINT fk_matricula_plan
	FOREIGN KEY (id_plan_matricula) REFERENCES
	"Pagos"."PlanPagoMatricula"(id)
)

--Tabla: Mensualidad
CREATE TABLE "Pagos"."Mensualidad"(
	id SERIAL PRIMARY KEY,
	id_plan_mensualidad INT,
	recargo DECIMAL(5,2),
	id_beca INT,
	fecha_inicio DATE,
	fecha_vencimiento DATE,
	estado estado_pagos,
	id_estudiante INT,
	subtotal DECIMAL(10,2),
	total DECIMAL(10,2),

	CONSTRAINT fk_mensualidad_estudiante 
	FOREIGN KEY (id_estudiante) REFERENCES
	"Estudiantes"."Estudiantes"(id)
	ON UPDATE CASCADE,

	CONSTRAINT fk_mensualidad_plan
	FOREIGN KEY (id_plan_mensualidad) REFERENCES
	"Pagos"."PlanPagoMensualidad"(id),

	CONSTRAINT fk_mensualidad_beca
	FOREIGN KEY (id_beca) REFERENCES
	"Pagos"."Becas"(id)
	ON UPDATE CASCADE
)

--Tabla: Nivelado
CREATE TABLE "Pagos"."Nivelado" (
	id SERIAL PRIMARY KEY,
	id_estudiante INT,
	id_plan_nivelado INT,
	monto_pagado DECIMAL(10,2),
	fecha_pago DATE,
	recargo DECIMAL(5,2),
	saldo_restante DECIMAL(10,2),
	id_beca INT,
	estado estado_pagos,

	CONSTRAINT fk_nivelado_estudiante 
	FOREIGN KEY (id_estudiante) REFERENCES
	"Estudiantes"."Estudiantes"(id)
	ON UPDATE CASCADE,

	CONSTRAINT fk_nivelado_plan
	FOREIGN KEY (id_plan_nivelado) REFERENCES
	"Pagos"."PlanPagoMensualidad"(id),

	CONSTRAINT fk_nivelado_beca
	FOREIGN KEY (id_beca) REFERENCES
	"Pagos"."Becas"(id)
	ON UPDATE CASCADE
)

--Tabla: plan detallado
CREATE TABLE "Pagos"."PlanPagoDetallado"(
	id SERIAL PRIMARY KEY,
	id_estudiante INT,
	tipo_pago tipo_pago,
	id_plan_matricula INT,
	id_plan_mensualidad INT,
	id_plan_nivelado INT,
	descripcion TEXT,
	periodicidad VARCHAR(20),
	id_usuario INT,
	fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_plan_estudiante
	FOREIGN KEY (id_estudiante) REFERENCES
	"Estudiantes"."Estudiantes"(id)
	ON UPDATE CASCADE
	ON DELETE CASCADE,

	CONSTRAINT fk_plan_detalle_matricula
	FOREIGN KEY (id_plan_matricula)
	REFERENCES "Pagos"."PlanPagoMatricula" (id)
	ON UPDATE CASCADE,

	CONSTRAINT fk_plan_detalle_mensualidad
	FOREIGN KEY (id_plan_mensualidad)
	REFERENCES "Pagos"."PlanPagoMensualidad" (id)
	ON UPDATE CASCADE,

	CONSTRAINT fk_plan_detalle_nivelado
	FOREIGN KEY (id_plan_nivelado)
	REFERENCES "Pagos"."PlanPagoNivelado" (id)
	ON UPDATE CASCADE,

	CONSTRAINT fk_plan_usuario 
	FOREIGN KEY (id_usuario)
	REFERENCES "Administracion"."Usuarios"(id)
	
)

CREATE TYPE tipo_pago AS ENUM('Normal', 'Nivelado')