export type EstudiantesTablaType = {
    uuid?: string;
    codigo_estudiante?: string;
    primer_nombre?: string;
    segundo_nombre?: string;
    primer_apellido?: string;
    segundo_apellido?: string;
    nacionalidad?: string;
    identidad?: string;
    genero?: "M" | "F" | "N/A";
    fecha_nacimiento?: string; // formato DD/MM/YYYY
    edad?: number;
    direccion?: string;
    grado?: string;
    seccion?: string;
    es_zurdo?: "Sí" | "No";
    dif_educacion?: "Sí" | "No";
    alergia?: "Sí" | "No";
    desc_alergia?: string;
    fecha_admision?: string; // formato DD/MM/YYYY
    estado?: string;
  };
  