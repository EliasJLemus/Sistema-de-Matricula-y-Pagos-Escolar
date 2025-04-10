import { z } from 'zod';

export const registrarEncargadoSchema = z.object({
  primer_nombre: z.string().min(1, 'El primer nombre es requerido'),
  segundo_nombre: z.string().optional(),
  primer_apellido: z.string().min(1, 'El primer apellido es requerido'),
  segundo_apellido: z.string().optional(),
  identidad: z
    .string()
    .min(13, 'Debe tener 13 dígitos')
    .max(13, 'Debe tener 13 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números'),
  genero: z.enum(['Masculino', 'Femenino', 'Otro']),
  fecha_nacimiento: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Fecha inválida' }),
  correo: z.string().email('Correo inválido'),
  telefono: z
    .string()
    .min(8, 'Teléfono inválido'),
  es_principal: z.boolean(),
  parentesco: z.string().min(1, 'Parentesco requerido'),
  uuid: z.string().uuid('UUID inválido'),
});
