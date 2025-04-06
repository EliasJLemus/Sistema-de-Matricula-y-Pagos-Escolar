export type EstudiantesTablaType = {
    uuid?: string;
    codigo_estudiante?: string;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    nacionalidad?: string;
    identidad?: string;
    genero?: "M" | "F" | "N/A" | Boolean | string;
    fecha_nacimiento?: string; // formato DD/MM/YYYY
    edad?: number;
    direccion?: string;
    grado?: string;
    seccion?: string;
    es_zurdo?: "Sí" | "No" | Boolean;
    dif_educacion?: "Sí" | "No" | Boolean;
    alergia?: "Sí" | "No" | Boolean;
    desc_alergia?: string | null;
    fecha_admision?: string; // formato DD/MM/YYYY
    estado?: string;
    tipo_persona?: "Estudiante" | "Docente" | "Administrativo" | "Otro";
    nombre_grado?: string;
    reaccion_alergica?: boolean;
    dif_educacion_fisica?: "Sí" | "No" | Boolean;
    descripcion_alergica?: string | null;
    tipo_pago?: "Normal" | "Nivelado" | null;
  };
  