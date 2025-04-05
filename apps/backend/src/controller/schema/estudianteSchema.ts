import { z } from "zod";

export const registrarEstudianteSchema = z.object({
  uuid: z.string().uuid(),
  uuid_info_general: z.string().uuid(),

  primer_nombre: z.string().min(1),
  segundo_nombre: z.string().optional().nullable(),
  primer_apellido: z.string().min(1),
  segundo_apellido: z.string().optional().nullable(),

  identidad: z.string().min(13).max(20),
  nacionalidad: z.string().min(3),
  genero: z.enum(["Masculino", "Femenino"]),

  fecha_nacimiento: z.coerce.date(),
  edad: z.number().int().min(0),

  direccion: z.string().min(5),

  nombre_grado: z.string().min(1),
  seccion: z.string().min(1).max(10),

  es_zurdo: z.boolean(),
  dif_educacion_fisica: z.boolean(),
  reaccion_alergica: z.boolean(),
  descripcion_alergica: z.string().optional().nullable(),

  tipo_persona: z.enum(["Estudiante", "Encargado"]),

  fecha_admision: z.coerce.date(),
});


export const actualizarEstudianteSchema = z.object({
  uuid: z.string().uuid(),

  primer_nombre: z.string().min(1, "El primer nombre es requerido."),
  segundo_nombre: z.string().optional().nullable(),
  primer_apellido: z.string().min(1, "El primer apellido es requerido."),
  segundo_apellido: z.string().optional().nullable(),

  identidad: z.string().min(13, "Debe tener al menos 13 caracteres.").max(20),
  nacionalidad: z.string().min(3),

  genero: z.enum(["Masculino", "Femenino"]),

  fecha_nacimiento: z.coerce.date(),
  edad: z.number().int().min(0),

  direccion: z.string(),

  nombre_grado: z.string().min(1),
  seccion: z.string().min(1).max(10),

  es_zurdo: z.boolean(),
  dif_educacion_fisica: z.boolean(),
  reaccion_alergica: z.boolean(),
  descripcion_alergica: z.string().optional().nullable(),

  estado: z.string().min(1, "El estado es requerido."),

    tipo_persona: z.enum(["Estudiante", "Encargado"]),

  fecha_admision: z.coerce.date(),
});
